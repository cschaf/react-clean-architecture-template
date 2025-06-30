/**
 * Datum- und Zeit-Utility-Funktionen
 * Diese Datei enthält Hilfsfunktionen für die Arbeit mit Daten und Zeiten
 */

import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'

/**
 * Formatiert ein Datum in einem lesbaren Format
 */
export function formatDate(
  date: Date | string,
  pattern = 'dd.MM.yyyy'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (!isValid(dateObj)) {
    return 'Ungültiges Datum'
  }
  
  return format(dateObj, pattern, { locale: de })
}

/**
 * Formatiert ein Datum und Zeit
 */
export function formatDateTime(
  date: Date | string,
  pattern = 'dd.MM.yyyy HH:mm'
): string {
  return formatDate(date, pattern)
}

/**
 * Formatiert ein Datum als relative Zeit (z.B. "vor 2 Stunden")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (!isValid(dateObj)) {
    return 'Ungültiges Datum'
  }
  
  return formatDistanceToNow(dateObj, { 
    addSuffix: true, 
    locale: de 
  })
}

/**
 * Formatiert Zeit im 24-Stunden-Format
 */
export function formatTime(date: Date | string): string {
  return formatDate(date, 'HH:mm')
}

/**
 * Formatiert Zeit im 12-Stunden-Format
 */
export function formatTime12(date: Date | string): string {
  return formatDate(date, 'h:mm a')
}

/**
 * Prüft ob ein Datum heute ist
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const today = new Date()
  
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  )
}

/**
 * Prüft ob ein Datum gestern war
 */
export function isYesterday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  
  return (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  )
}

/**
 * Prüft ob ein Datum in der Zukunft liegt
 */
export function isFuture(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return dateObj.getTime() > Date.now()
}

/**
 * Prüft ob ein Datum in der Vergangenheit liegt
 */
export function isPast(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return dateObj.getTime() < Date.now()
}

/**
 * Berechnet das Alter basierend auf dem Geburtsdatum
 */
export function calculateAge(birthDate: Date | string): number {
  const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate
  const today = new Date()
  
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

/**
 * Erstellt ein Datum für den Beginn des Tages (00:00:00)
 */
export function startOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date)
  return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())
}

/**
 * Erstellt ein Datum für das Ende des Tages (23:59:59)
 */
export function endOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date)
  return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 23, 59, 59, 999)
}

/**
 * Addiert Tage zu einem Datum
 */
export function addDays(date: Date | string, days: number): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date)
  const result = new Date(dateObj)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Subtrahiert Tage von einem Datum
 */
export function subtractDays(date: Date | string, days: number): Date {
  return addDays(date, -days)
}

/**
 * Addiert Monate zu einem Datum
 */
export function addMonths(date: Date | string, months: number): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date)
  const result = new Date(dateObj)
  result.setMonth(result.getMonth() + months)
  return result
}

/**
 * Berechnet die Differenz zwischen zwei Daten in Tagen
 */
export function getDaysDifference(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2
  
  const timeDiff = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

/**
 * Erstellt ein Array von Daten zwischen zwei Daten
 */
export function getDateRange(startDate: Date | string, endDate: Date | string): Date[] {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
  const dates: Date[] = []
  
  const currentDate = new Date(start)
  while (currentDate <= end) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return dates
}

/**
 * Formatiert eine Dauer in Millisekunden zu einem lesbaren Format
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    return `${days} Tag${days === 1 ? '' : 'e'}`
  }
  if (hours > 0) {
    return `${hours} Stunde${hours === 1 ? '' : 'n'}`
  }
  if (minutes > 0) {
    return `${minutes} Minute${minutes === 1 ? '' : 'n'}`
  }
  return `${seconds} Sekunde${seconds === 1 ? '' : 'n'}`
}

/**
 * Konvertiert ein ISO-Datum zu einem lokalen Datum
 */
export function toLocalDate(isoString: string): Date {
  return parseISO(isoString)
}

/**
 * Konvertiert ein lokales Datum zu einem ISO-String
 */
export function toISOString(date: Date): string {
  return date.toISOString()
}
