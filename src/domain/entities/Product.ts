/**
 * Product Entity - Domain Layer
 * Diese Klasse repräsentiert die Geschäftslogik für Produkte
 */

import { BaseEntity, DomainError, ValidationError } from '@/shared/types'

export interface ProductProps {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly price: number
  readonly currency: string
  readonly categoryId: string
  readonly images: string[]
  readonly inStock: number
  readonly isActive: boolean
  readonly tags: string[]
  readonly createdAt: Date
  readonly updatedAt: Date
}

export class Product implements BaseEntity {
  private constructor(private readonly props: ProductProps) {
    this.validateName(props.name)
    this.validateDescription(props.description)
    this.validatePrice(props.price)
    this.validateStock(props.inStock)
  }

  public static create(props: Omit<ProductProps, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const now = new Date()
    return new Product({
      ...props,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    })
  }

  public static fromPersistence(props: ProductProps): Product {
    return new Product(props)
  }

  // Getter für Properties
  public get id(): string {
    return this.props.id
  }

  public get name(): string {
    return this.props.name
  }

  public get description(): string {
    return this.props.description
  }

  public get price(): number {
    return this.props.price
  }

  public get currency(): string {
    return this.props.currency
  }

  public get categoryId(): string {
    return this.props.categoryId
  }

  public get images(): readonly string[] {
    return [...this.props.images]
  }

  public get inStock(): number {
    return this.props.inStock
  }

  public get isActive(): boolean {
    return this.props.isActive
  }

  public get tags(): readonly string[] {
    return [...this.props.tags]
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }

  // Business Logic Methods
  public updateBasicInfo(updates: {
    name?: string
    description?: string
    price?: number
    categoryId?: string
  }): Product {
    if (updates.name) {
      this.validateName(updates.name)
    }
    if (updates.description) {
      this.validateDescription(updates.description)
    }
    if (updates.price !== undefined) {
      this.validatePrice(updates.price)
    }

    return new Product({
      ...this.props,
      ...updates,
      updatedAt: new Date(),
    })
  }

  public updateStock(newStock: number): Product {
    this.validateStock(newStock)

    return new Product({
      ...this.props,
      inStock: newStock,
      updatedAt: new Date(),
    })
  }

  public reduceStock(quantity: number): Product {
    if (quantity <= 0) {
      throw new DomainError('Menge muss positiv sein', 'INVALID_QUANTITY')
    }

    if (this.props.inStock < quantity) {
      throw new DomainError('Nicht genügend Lagerbestand', 'INSUFFICIENT_STOCK')
    }

    return new Product({
      ...this.props,
      inStock: this.props.inStock - quantity,
      updatedAt: new Date(),
    })
  }

  public addStock(quantity: number): Product {
    if (quantity <= 0) {
      throw new DomainError('Menge muss positiv sein', 'INVALID_QUANTITY')
    }

    return new Product({
      ...this.props,
      inStock: this.props.inStock + quantity,
      updatedAt: new Date(),
    })
  }

  public addImage(imageUrl: string): Product {
    if (!imageUrl || imageUrl.trim().length === 0) {
      throw new ValidationError('Bild-URL ist erforderlich', 'imageUrl')
    }

    if (this.props.images.includes(imageUrl)) {
      throw new DomainError('Bild ist bereits vorhanden', 'IMAGE_ALREADY_EXISTS')
    }

    return new Product({
      ...this.props,
      images: [...this.props.images, imageUrl],
      updatedAt: new Date(),
    })
  }

  public removeImage(imageUrl: string): Product {
    const imageIndex = this.props.images.indexOf(imageUrl)
    if (imageIndex === -1) {
      throw new DomainError('Bild nicht gefunden', 'IMAGE_NOT_FOUND')
    }

    return new Product({
      ...this.props,
      images: this.props.images.filter(img => img !== imageUrl),
      updatedAt: new Date(),
    })
  }

  public addTag(tag: string): Product {
    const normalizedTag = tag.trim().toLowerCase()
    if (!normalizedTag) {
      throw new ValidationError('Tag ist erforderlich', 'tag')
    }

    if (this.props.tags.some(t => t.toLowerCase() === normalizedTag)) {
      throw new DomainError('Tag ist bereits vorhanden', 'TAG_ALREADY_EXISTS')
    }

    return new Product({
      ...this.props,
      tags: [...this.props.tags, tag.trim()],
      updatedAt: new Date(),
    })
  }

  public removeTag(tag: string): Product {
    const tagIndex = this.props.tags.findIndex(t => t.toLowerCase() === tag.toLowerCase())
    if (tagIndex === -1) {
      throw new DomainError('Tag nicht gefunden', 'TAG_NOT_FOUND')
    }

    return new Product({
      ...this.props,
      tags: this.props.tags.filter((_, index) => index !== tagIndex),
      updatedAt: new Date(),
    })
  }

  public activate(): Product {
    if (this.props.isActive) {
      throw new DomainError('Produkt ist bereits aktiv', 'PRODUCT_ALREADY_ACTIVE')
    }

    return new Product({
      ...this.props,
      isActive: true,
      updatedAt: new Date(),
    })
  }

  public deactivate(): Product {
    if (!this.props.isActive) {
      throw new DomainError('Produkt ist bereits deaktiviert', 'PRODUCT_ALREADY_INACTIVE')
    }

    return new Product({
      ...this.props,
      isActive: false,
      updatedAt: new Date(),
    })
  }

  // Query Methods
  public isAvailable(): boolean {
    return this.props.isActive && this.props.inStock > 0
  }

  public canOrder(quantity: number): boolean {
    return this.isAvailable() && this.props.inStock >= quantity
  }

  public hasTag(tag: string): boolean {
    return this.props.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  }

  public isInCategory(categoryId: string): boolean {
    return this.props.categoryId === categoryId
  }

  public isOutOfStock(): boolean {
    return this.props.inStock === 0
  }

  public isLowStock(threshold = 10): boolean {
    return this.props.inStock <= threshold && this.props.inStock > 0
  }

  public hasImages(): boolean {
    return this.props.images.length > 0
  }

  public getMainImage(): string | undefined {
    return this.props.images[0]
  }

  public getPriceFormatted(locale = 'de-DE'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this.props.currency,
    }).format(this.props.price)
  }

  // Serialization
  public toPlainObject(): ProductProps {
    return { ...this.props }
  }

  public toPublicObject(): Omit<ProductProps, 'inStock'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { inStock, ...publicProps } = this.props
    return publicProps
  }

  // Private Validation Methods
  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationError('Produktname ist erforderlich', 'name')
    }

    if (name.length < 2) {
      throw new ValidationError('Produktname muss mindestens 2 Zeichen haben', 'name')
    }

    if (name.length > 100) {
      throw new ValidationError('Produktname darf maximal 100 Zeichen haben', 'name')
    }
  }

  private validateDescription(description: string): void {
    if (!description || description.trim().length === 0) {
      throw new ValidationError('Produktbeschreibung ist erforderlich', 'description')
    }

    if (description.length < 10) {
      throw new ValidationError('Produktbeschreibung muss mindestens 10 Zeichen haben', 'description')
    }

    if (description.length > 1000) {
      throw new ValidationError('Produktbeschreibung darf maximal 1000 Zeichen haben', 'description')
    }
  }

  private validatePrice(price: number): void {
    if (price < 0) {
      throw new ValidationError('Preis muss mindestens 0 sein', 'price')
    }

    if (price > 999999.99) {
      throw new ValidationError('Preis ist zu hoch', 'price')
    }
  }

  private validateStock(stock: number): void {
    if (stock < 0) {
      throw new ValidationError('Lagerbestand muss mindestens 0 sein', 'inStock')
    }

    if (!Number.isInteger(stock)) {
      throw new ValidationError('Lagerbestand muss eine ganze Zahl sein', 'inStock')
    }
  }
}
