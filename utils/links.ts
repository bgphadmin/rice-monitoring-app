type NavLink = {
  href: string;
  label: string;
};

export const links: NavLink[] = [
  {
    href: '/',  // Home
    label: 'Home',
  },
  {
    href: '/dashboard',  
    label: 'Dashboard',
  },
  {
    href: '/inventory',  
    label: 'Inventory',
  },
  {
    href: '/distribution',  
    label: 'Distribution',
  },
  {
    href: '/users',  
    label: 'Users',
  },
  {
    href: '/about',  // Favorites
    label: 'About',
  },
];

export const adminLinks: NavLink[] = [
  { href: '/inventory', label: 'Rice Inventory' },
  { href: '/distribution', label: 'Rice Distribution' },
  { href: '/users', label: 'Add User' },
];
