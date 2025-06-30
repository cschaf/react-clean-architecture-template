/**
 * Product Repository Interface - Domain Layer
 * Diese Datei definiert das Interface für die Produkt-Datenpersistierung
 */

import { Product } from '@/domain/entities/Product'
import { Result, PaginatedResponse, PaginationParams, FilterParams } from '@/shared/types'

export interface ProductRepository {
  /**
   * Findet ein Produkt anhand der ID
   */
  findById(id: string): Promise<Result<Product | null>>

  /**
   * Findet alle Produkte mit Paginierung und Filterung
   */
  findAll(
    pagination: PaginationParams,
    filters?: FilterParams
  ): Promise<Result<PaginatedResponse<Product>>>

  /**
   * Sucht Produkte anhand verschiedener Kriterien
   */
  search(
    query: string,
    pagination: PaginationParams
  ): Promise<Result<PaginatedResponse<Product>>>

  /**
   * Findet Produkte anhand der Kategorie
   */
  findByCategory(
    categoryId: string,
    pagination: PaginationParams
  ): Promise<Result<PaginatedResponse<Product>>>

  /**
   * Findet Produkte anhand von Tags
   */
  findByTags(
    tags: string[],
    pagination: PaginationParams
  ): Promise<Result<PaginatedResponse<Product>>>

  /**
   * Findet verfügbare Produkte (aktiv und auf Lager)
   */
  findAvailable(pagination: PaginationParams): Promise<Result<PaginatedResponse<Product>>>

  /**
   * Findet Produkte mit niedrigem Lagerbestand
   */
  findLowStock(threshold: number): Promise<Result<Product[]>>

  /**
   * Findet Produkte ohne Lagerbestand
   */
  findOutOfStock(): Promise<Result<Product[]>>

  /**
   * Findet Produkte in einem Preisbereich
   */
  findByPriceRange(
    minPrice: number,
    maxPrice: number,
    pagination: PaginationParams
  ): Promise<Result<PaginatedResponse<Product>>>

  /**
   * Findet die beliebtesten Produkte
   */
  findPopular(
    limit: number,
    timeframe?: number
  ): Promise<Result<Product[]>>

  /**
   * Findet ähnliche Produkte
   */
  findSimilar(
    productId: string,
    limit: number
  ): Promise<Result<Product[]>>

  /**
   * Speichert ein neues Produkt
   */
  save(product: Product): Promise<Result<Product>>

  /**
   * Aktualisiert ein existierendes Produkt
   */
  update(product: Product): Promise<Result<Product>>

  /**
   * Löscht ein Produkt anhand der ID
   */
  delete(id: string): Promise<Result<void>>

  /**
   * Prüft ob ein Produktname bereits existiert
   */
  nameExists(name: string, excludeId?: string): Promise<Result<boolean>>

  /**
   * Zählt alle Produkte
   */
  count(): Promise<Result<number>>

  /**
   * Zählt aktive Produkte
   */
  countActive(): Promise<Result<number>>

  /**
   * Zählt Produkte in einer Kategorie
   */
  countByCategory(categoryId: string): Promise<Result<number>>

  /**
   * Bulk-Update für Preise
   */
  updatePrices(updates: Array<{ id: string; price: number }>): Promise<Result<void>>

  /**
   * Bulk-Update für Lagerbestände
   */
  updateStock(updates: Array<{ id: string; stock: number }>): Promise<Result<void>>

  /**
   * Aktiviert/Deaktiviert mehrere Produkte
   */
  updateActiveStatus(productIds: string[], isActive: boolean): Promise<Result<void>>

  /**
   * Findet Produkte, die in den letzten N Tagen erstellt wurden
   */
  findRecentProducts(days: number): Promise<Result<Product[]>>

  /**
   * Exportiert Produktdaten
   */
  export(filters?: FilterParams): Promise<Result<Product[]>>

  /**
   * Importiert Produktdaten
   */
  import(products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Result<Product[]>>
}
