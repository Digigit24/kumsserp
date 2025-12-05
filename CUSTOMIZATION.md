# Theme Customization Guide

## Changing Theme Colors

### Method 1: Using the Theme Context (Runtime)

You can change colors dynamically using the `useTheme` hook:

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function SettingsPage() {
  const { colors, setColors } = useTheme();

  const handleColorChange = () => {
    setColors({
      primary: '142.1 76.2% 36.3%',  // Green
      secondary: '142.1 70.6% 45.3%',
    });
  };

  return <button onClick={handleColorChange}>Change to Green Theme</button>;
}
```

### Method 2: Editing CSS Variables (Build Time)

Edit `src/index.css` to change default colors:

```css
:root {
  /* Change primary from blue to purple */
  --primary: 262.1 83.3% 57.8%;  /* Purple */
  --primary-foreground: 210 40% 98%;

  /* Change secondary */
  --secondary: 262.1 20% 90%;
  --secondary-foreground: 262.1 47.4% 11.2%;
}
```

### Popular Color Presets (HSL Values)

**Blue (Default)**
```css
--primary: 221.2 83.2% 53.3%;
```

**Purple**
```css
--primary: 262.1 83.3% 57.8%;
```

**Green**
```css
--primary: 142.1 76.2% 36.3%;
```

**Red**
```css
--primary: 0 72.2% 50.6%;
```

**Orange**
```css
--primary: 24.6 95% 53.1%;
```

**Pink**
```css
--primary: 330.4 81.2% 60.4%;
```

## Changing Fonts

### Using Theme Context

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function SettingsPage() {
  const { font, setFont } = useTheme();

  return (
    <select value={font} onChange={(e) => setFont(e.target.value as any)}>
      <option value="inter">Inter</option>
      <option value="roboto">Roboto</option>
      <option value="system">System</option>
    </select>
  );
}
```

### Adding Custom Fonts

1. Add font link to `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

2. Add font class to `src/index.css`:
```css
.font-poppins {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

3. Update ThemeContext font type:
```tsx
type Font = 'inter' | 'roboto' | 'system' | 'poppins';
```

## Dark Mode Customization

Edit dark mode colors in `src/index.css`:

```css
.dark {
  /* Make dark mode darker */
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;

  /* Adjust primary for dark mode */
  --primary: 217.2 91.2% 59.8%;
}
```

## Border Radius

Change border radius globally:

```css
:root {
  --radius: 0.5rem;  /* Default */
  /* --radius: 0rem;     Square corners */
  /* --radius: 1rem;     Very rounded */
}
```

## Creating Theme Presets

Create a theme service to switch between presets:

```tsx
// src/lib/theme-presets.ts
export const themePresets = {
  default: {
    primary: '221.2 83.2% 53.3%',
    secondary: '210 40% 96.1%',
  },
  purple: {
    primary: '262.1 83.3% 57.8%',
    secondary: '262.1 20% 90%',
  },
  green: {
    primary: '142.1 76.2% 36.3%',
    secondary: '142.1 70.6% 85%',
  },
};

// Usage
import { themePresets } from '@/lib/theme-presets';
import { useTheme } from '@/contexts/ThemeContext';

function ThemeSwitcher() {
  const { setColors } = useTheme();

  return (
    <div>
      <button onClick={() => setColors(themePresets.default)}>Default</button>
      <button onClick={() => setColors(themePresets.purple)}>Purple</button>
      <button onClick={() => setColors(themePresets.green)}>Green</button>
    </div>
  );
}
```

## Custom Sidebar Width

Edit `src/components/layout/Sidebar.tsx`:

```tsx
// Change from w-64 to your preferred width
<div className="flex flex-col h-full w-72"> {/* or w-80, w-56, etc. */}
```

## Header Height

Edit `src/components/layout/Header.tsx` and `Sidebar.tsx`:

```tsx
// Change h-16 to your preferred height
<header className="sticky top-0 z-30 h-20 border-b"> {/* or h-12, h-24, etc. */}
```

## Adding Logo

Add a logo to the sidebar:

```tsx
// src/components/layout/Sidebar.tsx
<div className="flex items-center justify-between h-16 px-4 border-b border-border">
  <div className="flex items-center gap-2">
    <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
    <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
  </div>
  {/* ... rest of the code */}
</div>
```

## Customizing shadcn Components

All shadcn components can be customized by editing their files in `src/components/ui/`.

Example - Adding a new button variant:

```tsx
// src/components/ui/button.tsx
const buttonVariants = cva(
  // ... existing code
  {
    variants: {
      variant: {
        // ... existing variants
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700",
      },
      // ...
    },
  }
)
```

## HSL to Hex Converter

To convert your existing hex colors to HSL:

1. Visit https://colordesigner.io/convert/hextohsl
2. Enter your hex color (e.g., #4F46E5)
3. Get HSL values (e.g., 243.8 75.4% 58.6%)
4. Use format: `243.8 75.4% 58.6%` (space-separated, no commas)

## CSS Variable Usage in Components

You can use theme variables in your custom components:

```tsx
// Using Tailwind classes (recommended)
<div className="bg-primary text-primary-foreground">
  Content
</div>

// Using CSS
<div style={{ backgroundColor: 'hsl(var(--primary))' }}>
  Content
</div>
```

## Tips

1. Always test both light and dark modes when changing colors
2. Maintain sufficient color contrast for accessibility
3. Use HSL format for easier color manipulation
4. Store user preferences in localStorage (already implemented)
5. Consider system preference detection for initial theme
