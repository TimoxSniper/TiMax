# TiMax Design System - Editorial Modernism

## 1. Design-Philosophie

- **Brutalistisch** - Scharfe Schatten statt Blur/Glow
- **Typografisch** - Klare Hierarchie mit Serif-Headlines
- **Luxuriös** - Bronze-Akzentfarbe als Premium-Element
- **Minimalistisch** - Großzügiger Weißraum

---

## 2. Farbpalette

### Light Mode

| Farbe       | Hex       | Verwendung                |
| ----------- | --------- | ------------------------- |
| Background  | `#F8F7F4` | Warmes Editorial-Papier   |
| Foreground  | `#1A1A1A` | Text                      |
| Primary     | `#9A6F4F` | Bronze (Buttons, Akzente) |
| Secondary   | `#E8E6E1` | Hintergründe              |
| Muted       | `#666461` | Sekundärtext              |
| Destructive | `#B23A2F` | Fehler/Löschen            |
| Border      | `#D4D2CC` | Rahmen                    |

### Dark Mode

| Farbe      | Hex       | Verwendung      |
| ---------- | --------- | --------------- |
| Background | `#0F0F0F` | Near-Black      |
| Foreground | `#EFEDE8` | Text            |
| Primary    | `#D4A574` | Helleres Bronze |
| Secondary  | `#242424` | Hintergründe    |

---

## 3. Typografie

| Schrift    | Font           | Verwendung                    |
| ---------- | -------------- | ----------------------------- |
| Serif      | Crimson        | Headlines, Editorial-Elemente |
| Sans-Serif | DM Sans        | Body-Text, UI-Elemente        |
| Mono       | JetBrains Mono | Code, technische Inhalte      |

---

## 4. Schatten-System

- `shadow-editorial-sm` - Subtiler Schatten
- `shadow-editorial-md` - Standard
- `shadow-editorial-lg` - Prominent
- `shadow-editorial-brutalist` - 8px Offset

---

## 5. Komponenten-Übersicht

| Kategorie   | Komponenten                                                                   |
| ----------- | ----------------------------------------------------------------------------- |
| **ui/**     | Button, Card, Input, Badge, Dialog, Sheet, Toast, Progress, Skeleton          |
| **chat/**   | ChatInterface, ChatSidebar, ChatHeader, ChatInput, MessageList, MessageBubble |
| **upload/** | FileUpload, UploadList                                                        |
| **layout/** | MainNavigation, Footer, Breadcrumbs, CookieConsent                            |
| **home/**   | HeroSection, StatsSection, Testimonials, EmailSignup                          |
| **admin/**  | AdminSidebar, ChatsTable, UploadsTable, UsersTable, StatsCards                |

---

## 6. Grid-Background

Der Grid-Hintergrund verwendet explizite Farben mit erhöhter Opacity:

- **Light Mode**: `rgb(0, 0, 0)` mit `opacity-[0.15]`
- **Dark Mode**: `rgb(255, 255, 255)` mit `opacity-[0.2]`
- **Grid-Größe**: `48px 48px`
- **Z-Index**: `z-0` (hinter allen Content-Elementen)

---

## 7. Dark Mode Konfiguration

CSS Custom Variant in `globals.css`:

```css
@custom-variant dark (&:is(.dark *), .dark &);
```

Dies ermöglicht sowohl verschachtelte als auch direkte Dark Mode Selektoren.
