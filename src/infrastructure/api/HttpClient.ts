/**
 * HTTP Client - Infrastructure Layer
 * Diese Klasse stellt eine zentrale HTTP-Client-Implementierung bereit
 */

import { API_CONFIG, HTTP_STATUS } from '@/shared/constants'
import { ApiResponse, ApiErrorResponse } from '@/shared/types'

export interface HttpClientOptions {
  readonly baseUrl?: string
  readonly timeout?: number
  readonly headers?: Record<string, string>
  readonly retryAttempts?: number
  readonly retryDelay?: number
}

export interface RequestOptions {
  readonly headers?: Record<string, string>
  readonly timeout?: number
  readonly signal?: AbortSignal
}

export class HttpClient {
  private readonly baseUrl: string
  private readonly timeout: number
  private readonly retryAttempts: number
  private readonly retryDelay: number
  private readonly defaultHeaders: Record<string, string>

  constructor(options: HttpClientOptions = {}) {
    this.baseUrl = options.baseUrl || API_CONFIG.baseUrl
    this.timeout = options.timeout || API_CONFIG.timeout
    this.retryAttempts = options.retryAttempts || API_CONFIG.retryAttempts
    this.retryDelay = options.retryDelay || API_CONFIG.retryDelay
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    }
  }

  public async get<T>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, options)
  }

  public async post<T>(
    url: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, options)
  }

  public async put<T>(
    url: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, options)
  }

  public async patch<T>(
    url: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, data, options)
  }

  public async delete<T>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, options)
  }

  private async request<T>(
    method: string,
    url: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const fullUrl = this.buildUrl(url)
    const headers = { ...this.defaultHeaders, ...options.headers }

    const requestInit: RequestInit = {
      method,
      headers,
      signal: options.signal,
    }

    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      requestInit.body = JSON.stringify(data)
    }

    return this.executeWithRetry(fullUrl, requestInit, this.retryAttempts)
  }

  private async executeWithRetry<T>(
    url: string,
    init: RequestInit,
    attemptsLeft: number
  ): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const response = await fetch(url, {
        ...init,
        signal: init.signal || controller.signal,
      })

      clearTimeout(timeoutId)

      return await this.handleResponse<T>(response)
    } catch (error) {
      if (attemptsLeft > 0 && this.shouldRetry(error)) {
        await this.delay(this.retryDelay)
        return this.executeWithRetry<T>(url, init, attemptsLeft - 1)
      }
      throw this.createApiError(error)
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let responseData: unknown

    try {
      const text = await response.text()
      responseData = text ? JSON.parse(text) : null
    } catch {
      responseData = null
    }

    if (!response.ok) {
      throw this.createHttpError(response.status, responseData)
    }

    // Wenn die API bereits das ApiResponse-Format verwendet
    if (this.isApiResponse(responseData)) {
      return responseData as ApiResponse<T>
    }

    // Fallback: Wrap die Daten in ApiResponse-Format
    return {
      data: responseData as T,
      success: true,
      message: this.getSuccessMessage(response.status),
    }
  }

  private createHttpError(status: number, data: unknown): ApiErrorResponse {
    const message = this.getErrorMessage(status)
    
    if (this.isApiErrorResponse(data)) {
      return data
    }

    return {
      error: {
        code: `HTTP_${status}`,
        message,
        details: data as Record<string, unknown>,
      },
      success: false,
    }
  }

  private createApiError(error: unknown): ApiErrorResponse {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        error: {
          code: 'NETWORK_ERROR',
          message: 'Netzwerkfehler: Bitte prüfen Sie Ihre Internetverbindung',
        },
        success: false,
      }
    }

    if (error instanceof Error && error.name === 'AbortError') {
      return {
        error: {
          code: 'TIMEOUT_ERROR',
          message: 'Anfrage-Timeout: Der Server antwortet nicht',
        },
        success: false,
      }
    }

    return {
      error: {
        code: 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : 'Unbekannter Fehler',
      },
      success: false,
    }
  }

  private shouldRetry(error: unknown): boolean {
    // Retry bei Netzwerkfehlern, aber nicht bei Client-Fehlern (4xx)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return true
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      return true
    }

    return false
  }

  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint
    }
    
    const cleanBase = this.baseUrl.replace(/\/$/, '')
    const cleanEndpoint = endpoint.replace(/^\//, '')
    return `${cleanBase}/${cleanEndpoint}`
  }

  private getErrorMessage(status: number): string {
    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        return 'Ungültige Anfrage'
      case HTTP_STATUS.UNAUTHORIZED:
        return 'Nicht autorisiert'
      case HTTP_STATUS.FORBIDDEN:
        return 'Zugriff verweigert'
      case HTTP_STATUS.NOT_FOUND:
        return 'Ressource nicht gefunden'
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return 'Interner Serverfehler'
      default:
        return `HTTP-Fehler: ${status}`
    }
  }

  private getSuccessMessage(status: number): string | undefined {
    switch (status) {
      case HTTP_STATUS.CREATED:
        return 'Erfolgreich erstellt'
      case HTTP_STATUS.NO_CONTENT:
        return 'Erfolgreich gelöscht'
      default:
        return undefined
    }
  }

  private isApiResponse(data: unknown): data is ApiResponse<unknown> {
    return (
      typeof data === 'object' &&
      data !== null &&
      'data' in data &&
      'success' in data &&
      typeof (data as ApiResponse<unknown>).success === 'boolean'
    )
  }

  private isApiErrorResponse(data: unknown): data is ApiErrorResponse {
    return (
      typeof data === 'object' &&
      data !== null &&
      'error' in data &&
      'success' in data &&
      (data as ApiErrorResponse).success === false
    )
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Factory Methods
  public static create(options?: HttpClientOptions): HttpClient {
    return new HttpClient(options)
  }

  public static createWithAuth(token: string, options?: HttpClientOptions): HttpClient {
    return new HttpClient({
      ...options,
      headers: {
        ...options?.headers,
        'Authorization': `Bearer ${token}`,
      },
    })
  }
}
