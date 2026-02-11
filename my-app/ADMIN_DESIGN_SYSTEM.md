# Admin Dashboard - Editorial Modernism Design System

## Overview

The TiMax Admin Dashboard uses **Editorial Modernism** - a design aesthetic inspired by magazine layouts and brutalist architecture, featuring warm paper-like backgrounds, bold typography, and hard-edged shadows.

## Core Aesthetic Principles

### 1. Typography Hierarchy

**Headlines (Crimson)**
```tsx
<h1 className="font-serif text-4xl font-semibold text-foreground">
  Dashboard Overview
</h1>
```
- Use `font-serif` for all major headings
- Crimson font adds editorial authority
- Weights: 400 (regular), 600 (semibold), 700 (bold)

**Body Text (DM Sans)**
```tsx
<p className="font-sans text-base text-muted-foreground">
  Monitor platform activity and user metrics
</p>
```
- Use `font-sans` for all body text, labels, and UI elements
- Clean, readable sans-serif
- Excellent for data display and dense information

**Uppercase Labels**
```tsx
<span className="text-uppercase-tracked text-xs text-muted-foreground">
  Total Users
</span>
```
- Use for section headers and stat labels
- Adds editorial magazine feel

### 2. Color Palette

**Bronze Accents** - The signature element
- Primary: `#9A6F4F` (light mode) / `#D4A574` (dark mode)
- Use sparingly for emphasis: active states, CTAs, important metrics
- Think of it like metallic ink in print

**Backgrounds**
- Light: `#F8F7F4` - warm editorial paper
- Dark: `#0F0F0F` - near black for contrast
- Cards: `#FFFFFF` (light) / `#1A1A1A` (dark)

**Neutrals**
- Foreground: `#1A1A1A` (light) / `#EFEDE8` (dark)
- Muted: `#E8E6E1` (light) / `#242424` (dark)
- Borders: `#D4D2CC` (light) / `#2A2A2A` (dark)

### 3. Brutalist Shadows

Hard-edged, offset shadows (not blurred) - inspired by brutalist architecture.

**Utility Classes:**
```tsx
// Small: 2px offset
<div className="shadow-editorial-sm">...</div>

// Medium: 4px offset
<div className="shadow-editorial-md">...</div>

// Large: 8px offset
<div className="shadow-editorial-lg">...</div>

// Brutalist: 8px x 8px diagonal
<div className="shadow-editorial-brutalist">...</div>

// Hover lift effect
<div className="hover:shadow-editorial-lift">...</div>
```

**When to use:**
- Stats cards: `shadow-editorial-md`
- Navigation items: `shadow-editorial-sm`
- Modal overlays: `shadow-editorial-lg`
- Featured elements: `shadow-editorial-brutalist`

### 4. Layout Components

#### Stats Card Pattern

```tsx
<div className="bg-card border border-border shadow-editorial-md hover:shadow-editorial-lift transition-all duration-300">
  <div className="p-6">
    {/* Label */}
    <p className="text-uppercase-tracked text-xs text-muted-foreground mb-2">
      Total Users
    </p>

    {/* Stat */}
    <p className="font-serif text-4xl font-semibold text-foreground">
      1,234
    </p>

    {/* Trend indicator */}
    <div className="flex items-center gap-2 mt-2">
      <span className="text-sm text-primary">+12%</span>
      <span className="text-xs text-muted-foreground">vs last month</span>
    </div>
  </div>

  {/* Bronze accent line */}
  <div className="h-1 bg-primary/20"></div>
</div>
```

#### Sidebar Navigation Pattern

```tsx
<nav className="space-y-1">
  <a
    href="/admin"
    className="flex items-center gap-3 px-4 py-3 border-l-4 border-transparent hover:border-primary hover:bg-accent/5 transition-all"
  >
    <Icon className="w-5 h-5" />
    <span className="font-sans text-sm font-medium">Dashboard</span>
  </a>

  {/* Active state */}
  <a
    href="/admin/users"
    className="flex items-center gap-3 px-4 py-3 border-l-4 border-primary bg-accent/10"
  >
    <Icon className="w-5 h-5 text-primary" />
    <span className="font-sans text-sm font-medium text-primary">Users</span>
  </a>
</nav>
```

#### Table Pattern

```tsx
<table className="w-full">
  <thead>
    <tr className="border-b-2 border-border">
      <th className="text-uppercase-tracked text-xs text-left py-3 px-4">
        User
      </th>
      <th className="text-uppercase-tracked text-xs text-left py-3 px-4">
        Status
      </th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-border/50 hover:bg-accent/5 transition-colors">
      <td className="py-3 px-4 font-sans text-sm">...</td>
      <td className="py-3 px-4 font-sans text-sm">...</td>
    </tr>
  </tbody>
</table>
```

### 5. Responsive Design

**Sidebar:**
- Desktop (≥1024px): Fixed sidebar, 256px wide
- Tablet (768-1023px): Collapsible sidebar
- Mobile (<768px): Bottom navigation or hamburger menu

**Grid Layouts:**
```tsx
{/* Stats grid - responsive */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatsCard />
  <StatsCard />
  <StatsCard />
  <StatsCard />
</div>
```

### 6. Motion & Interaction

**Hover States:**
```tsx
// Card lift
className="hover:shadow-editorial-lift hover:-translate-y-0.5 transition-all duration-300"

// Border accent
className="hover:border-primary transition-colors duration-200"

// Background tint
className="hover:bg-accent/5 transition-colors"
```

**Loading States:**
```tsx
// Skeleton with bronze shimmer
<div className="animate-pulse bg-muted">
  <div className="h-4 bg-accent/20 rounded"></div>
</div>
```

**Focus States:**
- All interactive elements use `ring-primary` for keyboard focus
- 2px ring with 2px offset for visibility

### 7. Spacing Scale

Following 4px base unit:

```
xs: 4px   (gap-1)
sm: 8px   (gap-2)
md: 16px  (gap-4)
lg: 24px  (gap-6)
xl: 32px  (gap-8)
2xl: 48px (gap-12)
```

### 8. Component Examples

**Page Header:**
```tsx
<header className="border-b-2 border-border bg-background">
  <div className="px-8 py-6">
    <h1 className="font-serif text-3xl font-semibold text-foreground">
      Dashboard
    </h1>
    <p className="text-sm text-muted-foreground mt-1">
      Monitor platform activity and user metrics
    </p>
  </div>
</header>
```

**Action Button (Bronze CTA):**
```tsx
<button className="px-6 py-3 bg-primary text-primary-foreground font-sans text-sm font-medium shadow-editorial-sm hover:shadow-editorial-md transition-all">
  Export Data
</button>
```

**Badge/Status:**
```tsx
// Active status
<span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20">
  Active
</span>

// Neutral status
<span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground border border-border">
  Pending
</span>
```

## Implementation Checklist

- [x] Design system CSS variables defined
- [x] Brutalist shadow utilities created
- [x] Font families configured (Crimson + DM Sans)
- [x] Color palette with bronze accents
- [x] Dark mode implementation
- [ ] Sidebar navigation component
- [ ] Stats card components
- [ ] Table components
- [ ] Analytics charts with bronze accents
- [ ] Responsive breakpoints tested

## Design Don'ts

❌ **Never:**
- Use soft, blurred shadows (use hard brutalist shadows only)
- Overuse bronze - it's an accent, not a primary color
- Use rounded corners excessively (keep sharp for brutalist feel)
- Use generic system fonts (always Crimson for headlines, DM Sans for body)
- Create cluttered layouts (embrace white space, editorial simplicity)

✅ **Always:**
- Let typography breathe with generous spacing
- Use bronze sparingly for maximum impact
- Maintain strong hierarchy (Crimson headlines, DM Sans body)
- Apply brutalist shadows consistently
- Test dark mode alongside light mode
