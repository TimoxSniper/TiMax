# PRD: Fix API Routes and Rebuild Admin Dashboard

## Introduction

Complete overhaul of the admin dashboard and API infrastructure. Current issues prevent chats and uploads from working correctly in both user-facing pages and admin views. This PRD covers fixing all API routes and rebuilding the admin dashboard from scratch using the Editorial Modernism design system with real-time data updates.

## Goals

- Fix non-functional API routes for chats and uploads (user and admin views)
- Build a production-grade admin dashboard from scratch with all current features
- Implement real-time data updates for monitoring
- Apply Editorial Modernism design system (Bronze accents, Crimson/DM Sans typography, brutalist shadows)
- Ensure proper authentication, authorization, and multi-user data isolation
- Maintain compliance with Next.js 15+ patterns (Promise params)

## User Stories

### US-001: Audit and fix chat API routes
**Description:** As a developer, I need to identify and fix all issues with chat API routes so users can send/receive messages and admins can view chat data.

**Acceptance Criteria:**
- [ ] Audit `/api/chat/*` routes for Next.js 15+ compliance (await params)
- [ ] Fix CSRF validation issues
- [ ] Fix rate limiting implementation
- [ ] Verify user_id filtering for multi-user isolation
- [ ] Test chat creation, message sending, and history retrieval
- [ ] Verify admin can view all user chats
- [ ] Typecheck and lint pass
- [ ] All chat API tests pass

### US-002: Audit and fix upload API routes
**Description:** As a developer, I need to identify and fix all issues with upload API routes so users can upload files and admins can view upload data.

**Acceptance Criteria:**
- [ ] Audit `/api/upload/*` routes for Next.js 15+ compliance (await params)
- [ ] Fix file validation and size limits
- [ ] Fix n8n webhook integration
- [ ] Verify user_id filtering for multi-user isolation
- [ ] Test file upload, status polling, and retrieval
- [ ] Verify admin can view all user uploads
- [ ] Typecheck and lint pass
- [ ] All upload API tests pass

### US-003: Audit and fix admin API routes
**Description:** As a developer, I need to ensure admin-only API routes properly enforce role-based access and return correct data.

**Acceptance Criteria:**
- [ ] Audit `/api/admin/*` routes for role verification
- [ ] Fix user management endpoints
- [ ] Fix stats/analytics endpoints
- [ ] Verify admin role check in all routes
- [ ] Test all CRUD operations
- [ ] Typecheck and lint pass

### US-004: Design admin dashboard layout with Editorial Modernism
**Description:** As an admin user, I want a beautiful, professional dashboard that matches the TiMax design system so I can efficiently monitor the platform.

**Acceptance Criteria:**
- [ ] Use /frontend-design skill to design dashboard layout
- [ ] Apply Editorial Modernism style: Bronze (#9A6F4F) accents, Crimson headlines, DM Sans body
- [ ] Implement brutalist shadows (shadow-editorial-*)
- [ ] Use warm editorial background (#F8F7F4 light, #0F0F0F dark)
- [ ] Design responsive sidebar navigation
- [ ] Design card-based stats overview
- [ ] Verify in browser using dev-browser skill

### US-005: Build admin dashboard shell and navigation
**Description:** As an admin user, I want a sidebar navigation to access different admin sections.

**Acceptance Criteria:**
- [ ] Delete existing admin dashboard components
- [ ] Create new AdminLayout with sidebar navigation
- [ ] Implement nav items: Dashboard, Users, Chats, Uploads, Analytics
- [ ] Active state highlighting with Bronze accent
- [ ] Responsive mobile menu
- [ ] Dark mode support
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-006: Build admin stats dashboard (Overview)
**Description:** As an admin, I want to see key platform metrics at a glance on the dashboard home.

**Acceptance Criteria:**
- [ ] Create StatsCards component with real-time data
- [ ] Display: Total Users, Total Chats, Total Uploads, Active Sessions
- [ ] Use Editorial Modernism card design with brutalist shadows
- [ ] Implement auto-refresh (every 30 seconds)
- [ ] Show trend indicators (up/down from previous period)
- [ ] Loading states with skeletons
- [ ] Error handling with retry
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-007: Build admin users table
**Description:** As an admin, I want to view and manage all platform users.

**Acceptance Criteria:**
- [ ] Create UsersTable component with real-time data
- [ ] Display: User ID, Email, Name, Role, Created Date, Last Active
- [ ] Implement search/filter by email or name
- [ ] Implement pagination (20 users per page)
- [ ] Add role assignment dropdown (user/admin)
- [ ] Add user suspension toggle
- [ ] Implement auto-refresh (every 60 seconds)
- [ ] Loading states and error handling
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-008: Build admin chats table
**Description:** As an admin, I want to view all user chats and their messages for moderation and support.

**Acceptance Criteria:**
- [ ] Create ChatsTable component with real-time data
- [ ] Display: Chat ID, User, Title, Message Count, Created Date, Last Activity
- [ ] Implement search/filter by user or title
- [ ] Implement pagination (20 chats per page)
- [ ] Add "View Messages" action to see chat details
- [ ] Add delete chat action with confirmation
- [ ] Implement auto-refresh (every 60 seconds)
- [ ] Loading states and error handling
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-009: Build admin uploads table
**Description:** As an admin, I want to view all user uploads and their processing status.

**Acceptance Criteria:**
- [ ] Create UploadsTable component with real-time data
- [ ] Display: Upload ID, User, Filename, File Size, Status, Created Date
- [ ] Implement search/filter by filename or user
- [ ] Implement pagination (20 uploads per page)
- [ ] Add status badge with colors: Processing (yellow), Completed (green), Failed (red)
- [ ] Add "View Transcript" action for completed uploads
- [ ] Add delete upload action with confirmation
- [ ] Implement auto-refresh (every 30 seconds for status updates)
- [ ] Loading states and error handling
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-010: Build admin analytics dashboard
**Description:** As an admin, I want to see usage trends and analytics to understand platform growth.

**Acceptance Criteria:**
- [ ] Create AnalyticsDashboard component with charts
- [ ] Chart 1: New users over time (last 30 days)
- [ ] Chart 2: Chats created over time (last 30 days)
- [ ] Chart 3: Uploads over time (last 30 days)
- [ ] Chart 4: Most active users (top 10)
- [ ] Use Editorial Modernism styling for charts (Bronze accents)
- [ ] Implement auto-refresh (every 5 minutes)
- [ ] Export data as CSV functionality
- [ ] Loading states and error handling
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-011: Implement real-time updates infrastructure
**Description:** As a developer, I need to implement efficient real-time data fetching for the admin dashboard.

**Acceptance Criteria:**
- [ ] Create useRealTimeData hook with configurable refresh intervals
- [ ] Implement smart polling (pause when tab inactive)
- [ ] Add optimistic UI updates for actions
- [ ] Implement error retry with exponential backoff
- [ ] Add connection status indicator
- [ ] Typecheck passes
- [ ] Hook unit tests pass

### US-012: Fix user-facing chat interface
**Description:** As a regular user, I want the chat interface to work correctly after API fixes.

**Acceptance Criteria:**
- [ ] Verify chat creation works
- [ ] Verify message sending works
- [ ] Verify chat history loads correctly
- [ ] Verify only user's own chats are visible
- [ ] Test with multiple user accounts
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-013: Fix user-facing upload interface
**Description:** As a regular user, I want the upload interface to work correctly after API fixes.

**Acceptance Criteria:**
- [ ] Verify file upload works
- [ ] Verify file validation (size, type) works
- [ ] Verify upload status updates correctly
- [ ] Verify transcript retrieval works
- [ ] Verify only user's own uploads are visible
- [ ] Test with multiple user accounts
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

## Functional Requirements

### API Routes
- FR-1: All API routes must properly await `params` (Next.js 15+ requirement)
- FR-2: All API routes must validate CSRF tokens for mutations
- FR-3: All API routes must enforce rate limiting per configuration
- FR-4: All database queries must filter by `user_id` for multi-user isolation
- FR-5: Admin API routes must verify `publicMetadata.role === "admin"`
- FR-6: Chat API must properly delegate to n8n webhook and store results
- FR-7: Upload API must validate files, delegate to n8n, and update status
- FR-8: All API routes must return proper error responses with status codes

### Admin Dashboard - General
- FR-9: Admin dashboard must be accessible only to users with admin role
- FR-10: All admin pages must use Editorial Modernism design system
- FR-11: All admin tables must support pagination (20 items per page)
- FR-12: All admin tables must support search/filter
- FR-13: All admin sections must implement auto-refresh at specified intervals
- FR-14: All admin actions must show loading states and error handling
- FR-15: Admin dashboard must be fully responsive (mobile, tablet, desktop)
- FR-16: Admin dashboard must support dark mode

### Admin Dashboard - Stats
- FR-17: Stats cards must display: Total Users, Total Chats, Total Uploads, Active Sessions
- FR-18: Stats must auto-refresh every 30 seconds
- FR-19: Stats must show trend indicators (% change from previous period)

### Admin Dashboard - Users
- FR-20: Users table must display all registered users
- FR-21: Admins can assign/revoke admin role for any user
- FR-22: Admins can suspend/unsuspend user accounts
- FR-23: Users table must auto-refresh every 60 seconds

### Admin Dashboard - Chats
- FR-24: Chats table must display all user chats across platform
- FR-25: Admins can view full chat message history
- FR-26: Admins can delete chats with confirmation dialog
- FR-27: Chats table must auto-refresh every 60 seconds

### Admin Dashboard - Uploads
- FR-28: Uploads table must display all user uploads across platform
- FR-29: Admins can view upload transcripts for completed uploads
- FR-30: Admins can delete uploads with confirmation dialog
- FR-31: Status badges must show Processing (yellow), Completed (green), Failed (red)
- FR-32: Uploads table must auto-refresh every 30 seconds

### Admin Dashboard - Analytics
- FR-33: Analytics must show charts for users, chats, uploads over last 30 days
- FR-34: Analytics must show top 10 most active users
- FR-35: Analytics data must be exportable as CSV
- FR-36: Analytics must auto-refresh every 5 minutes

### User-Facing Fixes
- FR-37: Regular users must only see their own chats and uploads
- FR-38: Chat interface must successfully send/receive messages
- FR-39: Upload interface must successfully process files and show transcripts

## Non-Goals (Out of Scope)

- No real-time WebSocket connections (polling is sufficient)
- No email notifications for admin actions
- No audit log for admin activities (future enhancement)
- No bulk user operations (import/export users)
- No advanced analytics (cohort analysis, retention metrics)
- No chat/upload content search within admin dashboard
- No automated content moderation or flagging
- No user communication tools from admin dashboard

## Design Considerations

### Editorial Modernism Design System
- **Color Palette:**
  - Background: #F8F7F4 (light), #0F0F0F (dark)
  - Primary (Bronze): #9A6F4F
  - Text: #1A1A1A (light), #EFEDE8 (dark)
  - Destructive: #B23A2F
- **Typography:**
  - Headlines: Crimson (serif)
  - Body: DM Sans (sans-serif)
  - Code: JetBrains Mono (monospace)
- **Shadows:** Brutalist shadows (shadow-editorial-sm/md/lg/brutalist)
- **Grid Background:** 48px grid with opacity-[0.15] (light) / opacity-[0.2] (dark)

### Component Reuse
- Use existing shadcn/ui components: Button, Card, Input, Badge, Dialog, Table
- Create new admin-specific components: AdminSidebar, StatsCards, data tables
- Use /frontend-design skill for layout and component design
- Use /ui-ux-pro-max skill for advanced UI patterns

### Responsive Design
- Mobile: Single column, hamburger menu for sidebar
- Tablet: Collapsible sidebar, two-column layout for stats
- Desktop: Full sidebar, multi-column layout

## Technical Considerations

### Next.js 15+ Compliance
- All route params must be awaited: `const { id } = await params`
- Use Server Components by default, Client Components only when needed
- Proper loading.tsx and error.tsx for each route

### Performance
- Implement pagination for all tables (max 20 items per page)
- Use React.memo for expensive components
- Debounce search inputs (300ms)
- Use SWR or React Query for data fetching with caching

### Security
- Verify admin role on both client and server
- CSRF protection for all mutations
- Rate limiting on admin API routes
- Input sanitization with Zod validation
- Prevent privilege escalation (admins can't remove their own admin role)

### Real-Time Updates
- Polling intervals: Stats (30s), Tables (60s for users/chats, 30s for uploads), Analytics (5min)
- Pause polling when tab is inactive (Page Visibility API)
- Visual indicator when data is updating
- Graceful error handling with retry logic

### Multi-User Isolation
- All user-facing queries MUST filter by `user_id`
- Admin queries bypass user_id filter but verify admin role
- Test with multiple user accounts to ensure isolation

### n8n Integration
- Chat API delegates to `N8N_CHAT_WEBHOOK_URL`
- Upload API delegates to `N8N_UPLOAD_WEBHOOK_URL`
- Proper error handling for webhook failures
- Status polling for upload processing

## Success Metrics

- Chat API: 100% success rate for message send/receive
- Upload API: 100% success rate for file upload and processing
- Admin dashboard loads in < 2 seconds
- Real-time updates reflect data changes within refresh interval
- Zero privilege escalation vulnerabilities
- Zero data leakage between users
- Admin dashboard is responsive on all screen sizes
- TypeScript strict mode with zero errors
- All tests pass (unit + integration)

## Implementation Plan

### Phase 1: API Route Fixes (US-001, US-002, US-003)
1. Audit all API routes for Next.js 15+ compliance
2. Fix chat API routes
3. Fix upload API routes
4. Fix admin API routes
5. Run tests and verify fixes

### Phase 2: Admin Dashboard Foundation (US-004, US-005, US-011)
1. Use /frontend-design to design dashboard layout
2. Delete existing admin dashboard
3. Build new AdminLayout with sidebar
4. Implement real-time data hook infrastructure
5. Set up routing for admin sections

### Phase 3: Admin Dashboard Features (US-006 to US-010)
1. Build stats dashboard (overview)
2. Build users table with management
3. Build chats table with moderation
4. Build uploads table with status monitoring
5. Build analytics dashboard with charts

### Phase 4: User-Facing Verification (US-012, US-013)
1. Test chat interface with fixed APIs
2. Test upload interface with fixed APIs
3. Verify multi-user isolation
4. End-to-end testing with real user accounts

## Open Questions

- Should we add email notifications when uploads fail processing?
- Should we implement WebSocket for true real-time updates (instead of polling)?
- Should we add a system health check endpoint for monitoring?
- Should admins be able to impersonate users for debugging?

## Definition of Done

- [ ] All API routes working correctly (chats, uploads, admin)
- [ ] Admin dashboard completely rebuilt from scratch
- [ ] All admin features implemented (users, chats, uploads, analytics)
- [ ] Real-time updates working with proper intervals
- [ ] Editorial Modernism design system applied throughout
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Dark mode fully supported
- [ ] TypeScript strict mode passes
- [ ] ESLint passes
- [ ] All tests pass (npm run test)
- [ ] Multi-user isolation verified
- [ ] Admin role enforcement verified
- [ ] Verified in browser (all pages manually tested)
- [ ] No console errors or warnings
- [ ] Performance meets success metrics
