export const siteNavigation = {
  menu: [
    [
      {
        label: 'Pages',
        icon: 'i-lucide-box',
        defaultOpen: true,
        children: [
          {
            label: 'Index',
            icon: 'i-lucide-house',
            to: '/',
          },
          {
            label: 'Public',
            icon: 'i-lucide-house',
            to: '/public',
          },
          {
            label: 'Guest',
            icon: 'i-lucide-house',
            to: '/guest',
          },
        ],
      },
      {
        label: 'Auth',
        icon: 'i-lucide-box',
        defaultOpen: true,
        children: [
          {
            label: 'Login',
            icon: 'i-lucide-house',
            to: '/login',
          },
          {
            label: 'Profile',
            icon: 'i-lucide-house',
            to: '/profile',
          },
          {
            label: 'Private 1',
            icon: 'i-lucide-house',
            to: '/private-1',
          },
          {
            label: 'Private 2',
            icon: 'i-lucide-house',
            to: '/private-2?query=test',
          },
        ],
      },
    ],
  ],
}
