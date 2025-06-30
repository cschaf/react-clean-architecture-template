/**
 * Sidebar Component - Presentation Layer
 * Diese Komponente stellt die Seitenleiste der Anwendung bereit
 */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/shared/utils'
import { ROUTES } from '@/shared/constants'

interface SidebarProps {
  readonly isOpen: boolean
  readonly isMobile: boolean
  readonly onClose: () => void
  readonly className?: string
}

interface NavigationItem {
  readonly label: string
  readonly href: string
  readonly icon: React.ReactNode
  readonly badge?: string | number
  readonly children?: NavigationItem[]
}

const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Benutzer',
    href: ROUTES.USERS,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    badge: '12',
  },
  {
    label: 'Einstellungen',
    href: ROUTES.SETTINGS,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

export function Sidebar({ isOpen, isMobile, onClose, className }: SidebarProps): JSX.Element {
  const location = useLocation()

  return (
    <aside
      className={cn(
        'fixed top-14 left-0 z-40 w-64 h-[calc(100vh-3.5rem)] transition-transform duration-300 ease-in-out bg-background border-r shadow-lg',
        // Mobile behavior
        isMobile ? (
          isOpen ? 'translate-x-0' : '-translate-x-full'
        ) : (
          // Desktop behavior
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        ),
        // Ensure proper stacking
        'md:relative md:top-0 md:z-auto md:shadow-none',
        className
      )}
      role="navigation"
      aria-label="Hauptnavigation"
    >
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Navigation */}
          <ul className="space-y-2 font-medium">
            {navigationItems.map((item) => (
              <SidebarItem
                key={item.href}
                item={item}
                isActive={location.pathname === item.href}
                onClose={isMobile ? onClose : undefined}
              />
            ))}
          </ul>

          {/* Divider */}
          <hr className="my-4 border-gray-200 dark:border-gray-700" />

          {/* Additional Sections */}
          <div className="space-y-4">
            <SidebarSection title="Tools">
              <SidebarItem
                item={{
                  label: 'Dokumentation',
                  href: '/docs',
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ),
                }}
                isActive={location.pathname === '/docs'}
                onClose={isMobile ? onClose : undefined}
              />
              <SidebarItem
                item={{
                  label: 'Support',
                  href: '/support',
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                }}
                isActive={location.pathname === '/support'}
                onClose={isMobile ? onClose : undefined}
              />
            </SidebarSection>
          </div>

          {/* Bottom Actions */}
          <div className="absolute bottom-4 left-3 right-3">
            <div className="bg-muted rounded-lg p-3">
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Upgrade verfügbar
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Erhalten Sie Zugang zu erweiterten Funktionen
              </p>
              <button className="w-full bg-primary text-primary-foreground text-xs font-medium py-2 px-3 rounded-md hover:bg-primary/90 transition-colors">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </aside>
  )
}

// Sidebar Item Component
interface SidebarItemProps {
  readonly item: NavigationItem
  readonly isActive: boolean
  readonly onClose?: () => void
  readonly level?: number
}

function SidebarItem({ item, isActive, onClose, level = 0 }: SidebarItemProps): JSX.Element {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const hasChildren = item.children && item.children.length > 0

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    } else {
      onClose?.()
    }
  }

  const itemClasses = cn(
    'flex items-center p-2 rounded-lg transition-colors group',
    'hover:bg-accent hover:text-accent-foreground',
    isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
    level > 0 ? 'ml-4' : ''
  )

  if (hasChildren) {
    return (
      <li>
        <button
          onClick={handleClick}
          className={cn(itemClasses, 'w-full justify-between')}
        >
          <div className="flex items-center">
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </div>
          <svg
            className={cn('w-4 h-4 transition-transform', isExpanded ? 'rotate-90' : '')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        {isExpanded && (
          <ul className="mt-2 space-y-1">
            {item.children?.map((child) => (
              <SidebarItem
                key={child.href}
                item={child}
                isActive={location.pathname === child.href}
                onClose={onClose}
                level={level + 1}
              />
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <li>
      <Link
        to={item.href}
        onClick={handleClick}
        className={itemClasses}
      >
        {item.icon}
        <span className="flex-1 ml-3 whitespace-nowrap">{item.label}</span>
        {item.badge && (
          <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-xs font-medium text-primary-foreground bg-primary rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    </li>
  )
}

// Sidebar Section Component
interface SidebarSectionProps {
  readonly title: string
  readonly children: React.ReactNode
}

function SidebarSection({ title, children }: SidebarSectionProps): JSX.Element {
  return (
    <div>
      <h3 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h3>
      <ul className="space-y-1">
        {children}
      </ul>
    </div>
  )
}

// Mini Sidebar für kompakte Ansicht
interface MiniSidebarProps {
  readonly className?: string
}

export function MiniSidebar({ className }: MiniSidebarProps): JSX.Element {
  const location = useLocation()

  return (
    <aside className={cn('w-16 bg-background border-r', className)}>
      <div className="flex flex-col items-center py-4 space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'p-3 rounded-lg transition-colors relative group',
              'hover:bg-accent hover:text-accent-foreground',
              location.pathname === item.href
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground'
            )}
            title={item.label}
          >
            {item.icon}
            {item.badge && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-primary-foreground bg-primary rounded-full">
                {item.badge}
              </span>
            )}
            
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {item.label}
            </div>
          </Link>
        ))}
      </div>
    </aside>
  )
}
