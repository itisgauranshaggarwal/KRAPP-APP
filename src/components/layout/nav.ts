import { MessageCircle, UserPlus, UserRound, Users, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Short helper shown in desktop tooltips. */
  description: string
  /** Key used to look up the badge count. */
  badge?: 'requests'
}

export const navItems: NavItem[] = [
  { to: '/chats', label: 'Chats', icon: MessageCircle, description: 'Your conversations' },
  { to: '/requests', label: 'Requests', icon: UserPlus, description: 'Friend invites', badge: 'requests' },
  { to: '/contacts', label: 'Contacts', icon: Users, description: 'People you know' },
  { to: '/profile', label: 'Profile', icon: UserRound, description: 'Your account' },
]
