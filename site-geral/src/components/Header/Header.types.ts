export interface HeaderProps {
  currentPath?: string
}

export interface NavItem {
  label: string
  href: string
  submenu?: SubMenuItem[]
}

export interface SubMenuItem {
  label: string
  href: string
}

