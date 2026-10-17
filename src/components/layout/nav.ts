import { MessageCircle, UserPlus, UserRound, Users, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Key used to look up the badge count. */
  badge?: 'requests'
}

export const navItems: NavItem[] = [
  { to: '/chats', label: 'Chats', icon: MessageCircle },
  { to: '/requests', label: 'Requests', icon: UserPlus, badge: 'requests' },
  { to: '/contacts', label: 'Contacts', icon: Users },
  { to: '/profile', label: 'Profile', icon: UserRound },
]
