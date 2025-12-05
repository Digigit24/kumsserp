# React Dashboard Starter Kit

A modern, fully-featured React dashboard starter kit with Vite, TypeScript, and shadcn/ui components.

## Features

- **Vite** - Lightning-fast development server and build tool
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** components for beautiful, accessible UI
- **Theme System** with dark/light mode toggle
- **Customizable Colors** - Primary and secondary colors with HSL values
- **Font Options** - Support for Inter, Roboto, and system fonts
- **Responsive Layout** - Mobile-first design with collapsible sidebar
- **React Router** for navigation

## Running the Application

### Development
```bash
npm install
npm run dev
```

The app will be available at http://localhost:3030

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx        # App header with theme toggle
│   │   ├── Sidebar.tsx       # Collapsible sidebar navigation
│   │   └── MainLayout.tsx    # Main layout wrapper
│   └── ui/
│       └── button.tsx        # shadcn button component
├── contexts/
│   └── ThemeContext.tsx      # Theme provider and hooks
├── lib/
│   └── utils.ts              # Utility functions (cn helper)
├── pages/
│   └── Dashboard.tsx         # Dashboard page
├── App.tsx                   # Main app component
├── main.tsx                  # Entry point
└── index.css                 # Global styles and theme variables
```

## Theme Customization

### Changing Colors

The theme uses HSL color values defined in `src/index.css`. To customize:

1. Edit the CSS variables in `:root` for light mode
2. Edit the CSS variables in `.dark` for dark mode

Example:
```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Blue by default */
  --secondary: 210 40% 96.1%;
}
```

### Using the Theme Context

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme, setColors, setFont } = useTheme();

  // Toggle between light and dark
  toggleTheme();

  // Change colors
  setColors({ primary: '221.2 83.2% 53.3%', secondary: '210 40% 96.1%' });

  // Change font
  setFont('inter'); // 'inter', 'roboto', or 'system'
}
```

## Adding New Routes

1. Create a new page component in `src/pages/`
2. Add the route to `src/App.tsx`:

```tsx
<Route path="your-route" element={<YourPage />} />
```

3. Add navigation item to `src/components/layout/Sidebar.tsx`:

```tsx
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Your Page', href: '/your-route', icon: YourIcon },
];
```

## Responsive Design

The sidebar automatically:
- Shows as an overlay on mobile (< 1024px)
- Displays as a fixed sidebar on desktop (≥ 1024px)
- Can be toggled via the menu button in the header

## Available shadcn Components

Currently included:
- Button

To add more shadcn components, create them in `src/components/ui/` following the shadcn documentation.

## Tech Stack

- **React 18.2** - UI library
- **TypeScript 5.2** - Type safety
- **Vite 5.0** - Build tool
- **Tailwind CSS 4.1** - Styling
- **React Router 6.20** - Routing
- **Lucide React** - Icons
- **class-variance-authority** - Component variants
- **clsx & tailwind-merge** - Class name utilities
