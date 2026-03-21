import {
  LayoutDashboard,
  Camera,
  AlertTriangle,
  BarChart2,
  Users,
  UserCircle,
  Settings,
  Workflow,
} from 'lucide-react'

export const sidebarSections = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Live Feed', path: '/live-feed', icon: Camera },
      { label: 'Alerts', path: '/alerts', icon: AlertTriangle },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Analytics', path: '/analytics', icon: BarChart2 },
      { label: 'Workflows', path: '/workflows', icon: Workflow },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Users', path: '/users', icon: Users },
      { label: 'Profile', path: '/profile', icon: UserCircle },
      { label: 'Settings', path: '/settings', icon: Settings },
    ],
  },
]

export default sidebarSections
