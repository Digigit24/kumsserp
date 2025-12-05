# Sidebar Navigation - Core Module

## Updated Sidebar Structure

The sidebar has been updated to include all Core module pages with a collapsible navigation group.

## Navigation Structure

```
📊 Dashboard                    -> /dashboard
├─ 🏢 Core Module              (Collapsible Group)
│  ├─ 🏛️ Colleges              -> /core/colleges
│  ├─ 📅 Academic Years         -> /core/academic-years
│  ├─ 🎓 Academic Sessions      -> /core/academic-sessions
│  ├─ 🎉 Holidays               -> /core/holidays
│  ├─ 📅 Weekends               -> /core/weekends
│  ├─ ⚙️ System Settings        -> /core/system-settings
│  ├─ 🔔 Notification Settings  -> /core/notification-settings
│  └─ 📜 Activity Logs          -> /core/activity-logs
└─ ⚙️ Settings                  -> /settings
```

## Features

### 1. Collapsible Core Module Section
- Click on "Core Module" to expand/collapse all Core pages
- Default state: **Expanded** (open by default)
- Chevron icon indicates open/closed state
- Smooth transition animation

### 2. Visual Hierarchy
- **Top Level**: Dashboard
- **Grouped Section**: Core Module (with 8 sub-items)
- **Bottom Section**: Settings (separated by border)

### 3. Active State Highlighting
- Active route is highlighted with primary color
- Core module items are indented for visual hierarchy
- Icons change size: 5x5 for main items, 4x4 for sub-items

### 4. Icon Mapping

| Page | Icon | Description |
|------|------|-------------|
| Dashboard | Home | House icon |
| Core Module | Building2 | Building with multiple floors |
| Colleges | Building2 | Educational institution |
| Academic Years | Calendar | Annual calendar |
| Academic Sessions | GraduationCap | Mortarboard cap |
| Holidays | PartyPopper | Celebration |
| Weekends | CalendarOff | Calendar with X |
| System Settings | Cog | Gear/settings |
| Notification Settings | Bell | Notification bell |
| Activity Logs | History | Clock with arrow |
| Settings | Settings | General settings gear |

### 5. Mobile Responsiveness
- Sidebar slides in from left on mobile
- Backdrop overlay when open
- Auto-closes after navigation on mobile
- Desktop: Always visible, no close button

## Implementation Details

### State Management
```typescript
const [coreModuleOpen, setCoreModuleOpen] = useState(true);
```
- Controls collapse/expand state of Core Module section
- Persists during navigation (doesn't reset)
- Can be enhanced to persist in localStorage

### Navigation Structure
```typescript
interface NavigationGroup {
  name: string;
  icon: any;
  items: NavigationItem[];
}
```

### Active Route Detection
- Uses `useLocation()` from react-router-dom
- Compares current pathname with item href
- Highlights active item with primary theme color

## Styling

### Colors
- **Active**: Primary theme color (blue by default)
- **Inactive**: Muted foreground
- **Hover**: Accent background with accent foreground

### Spacing
- Main items: `px-3 py-2`
- Sub-items: `pl-11 pr-3 py-2` (extra left padding)
- Groups: `pt-2` for separation

### Typography
- Main items: `text-sm font-medium`
- Sub-items: `text-sm` (regular weight when inactive)
- Active items: `font-medium`

## Usage

### Accessing Core Pages

1. **From Sidebar**:
   - Click "Core Module" to expand
   - Click any sub-item to navigate

2. **Direct URL**:
   - Type URL directly: `http://localhost:3030/core/colleges`
   - All routes are protected (require authentication)

3. **Mobile**:
   - Tap hamburger menu to open sidebar
   - Tap Core Module to expand
   - Tap any page to navigate
   - Sidebar auto-closes after navigation

## Customization

### Change Default Open State
```typescript
// In Sidebar.tsx, line 40
const [coreModuleOpen, setCoreModuleOpen] = useState(false); // Closed by default
```

### Add More Groups
```typescript
const anotherModuleNavigation: NavigationGroup = {
  name: 'Student Module',
  icon: Users,
  items: [
    { name: 'Students', href: '/students', icon: User },
    { name: 'Admissions', href: '/admissions', icon: UserPlus },
  ]
};
```

### Persist Collapse State
```typescript
// Save to localStorage
const [coreModuleOpen, setCoreModuleOpen] = useState(() => {
  const saved = localStorage.getItem('coreModuleOpen');
  return saved !== null ? JSON.parse(saved) : true;
});

// Update when changed
useEffect(() => {
  localStorage.setItem('coreModuleOpen', JSON.stringify(coreModuleOpen));
}, [coreModuleOpen]);
```

## Future Enhancements

1. **Badges**: Add count badges to show pending items
2. **Search**: Add search bar to filter navigation items
3. **Breadcrumbs**: Show current location in page header
4. **Keyboard Navigation**: Arrow keys to navigate items
5. **Drag & Drop**: Reorder items (admin feature)
6. **Permissions**: Hide items based on user role
7. **Recent Pages**: Show recently visited pages
8. **Favorites**: Star/bookmark frequently used pages

## Testing

### Test Checklist
- ✅ All 8 Core pages accessible from sidebar
- ✅ Active state highlights correctly
- ✅ Collapse/expand works smoothly
- ✅ Icons display correctly
- ✅ Mobile responsive behavior
- ✅ Auto-close on mobile after navigation
- ✅ Hover states work properly
- ✅ Keyboard accessible (tab navigation)

### Browser Compatibility
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **No Performance Impact**: Static navigation structure
- **Lazy Loading**: Pages load only when accessed
- **Smooth Animations**: CSS transitions, no JS animations
- **Lightweight Icons**: lucide-react icons (tree-shakeable)

---

**Status**: ✅ Complete and Ready
**Build**: ✅ Successful
**Mobile**: ✅ Responsive
**Accessibility**: ✅ Keyboard Navigable
