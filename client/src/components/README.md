# Components Documentation

This directory contains reusable React components for the Blood Bank application.

## Component Structure

### Layout Components

#### `Layout.js`
Main layout wrapper that provides consistent structure across the application.
- **Props:**
  - `children` (required): Content to be rendered
  - `navItems` (optional): Array of navigation items for header
  - `footerLinks` (optional): Array of links for footer
  - `showLogout` (optional): Whether to show logout button (default: true)
  - `fullWidth` (optional): Whether content should be full width (default: false)
  - `contentClassName` (optional): Additional CSS classes for content

#### `Header.js`
Application header with logo, navigation, and logout functionality.
- **Props:**
  - `navItems` (optional): Array of navigation items
  - `showLogout` (optional): Whether to show logout button (default: true)

#### `Footer.js`
Application footer with copyright and branding information.
- **Props:**
  - `links` (optional): Array of footer links with `label`, `href`, and optional `external` flag

#### `Content.js`
Main content wrapper with consistent styling and layout.
- **Props:**
  - `children` (required): Content to be rendered
  - `className` (optional): Additional CSS classes
  - `fullWidth` (optional): Whether content should be full width (default: false)

### Utility Components

#### `Loading.js`
Displays a loading spinner with optional message.
- **Props:**
  - `message` (optional): Loading message (default: "Loading...")
  - `size` (optional): Size of the loader - 'sm', 'md', or 'lg' (default: 'md')

#### `ErrorBoundary.js`
Catches JavaScript errors in child components and displays a fallback UI.
- Automatically wraps components to prevent app crashes
- Shows user-friendly error messages in production
- Displays detailed error information in development mode

### Route Components

#### `ProtectedRoute.js`
Route wrapper that requires authentication.
- Redirects to login if user is not authenticated

#### `PublicRoute.js`
Route wrapper for public pages.
- Redirects to home if user is already authenticated

## Usage Examples

### Basic Layout Usage
```jsx
import Layout from './components/Layout';

function MyPage() {
  return (
    <Layout>
      <h1>My Content</h1>
    </Layout>
  );
}
```

### Layout with Custom Navigation
```jsx
import Layout from './components/Layout';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
];

const footerLinks = [
  { label: 'Privacy Policy', href: '/privacy', external: false },
  { label: 'Terms of Service', href: '/terms', external: false },
];

function MyPage() {
  return (
    <Layout navItems={navItems} footerLinks={footerLinks}>
      <h1>My Content</h1>
    </Layout>
  );
}
```

### Using Loading Component
```jsx
import Loading from './components/Loading';

function MyComponent() {
  if (loading) {
    return <Loading message="Fetching data..." size="lg" />;
  }
  return <div>Content</div>;
}
```

## Best Practices

1. **Always use Layout for authenticated pages** - Ensures consistent header/footer
2. **Wrap components in ErrorBoundary** - Prevents app crashes from component errors
3. **Use Loading component** - Provides consistent loading states
4. **Follow PropTypes** - All components use PropTypes for type checking
5. **Accessibility** - Components include proper ARIA labels and semantic HTML

