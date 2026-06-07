# 🔍 AgriFlow — Complete Backend Audit Report

**Audit Date:** June 7, 2026  
**Auditor:** Senior Software Architect  
**Codebase:** `agriflow-api/` (Laravel 11 + Sanctum + MySQL)  
**Frontend:** React (not built yet)

---

## 1. DOMAIN COMPLETENESS

### ✅ Business Features Implemented

| Feature | Status | Notes |
|---------|--------|-------|
| User Registration & Login | ✅ Implemented | Sanctum token auth |
| Role-based users (Admin, Farmer, Client, Livreur) | ✅ Implemented | Enum + DB column |
| Product CRUD (Farmers) | ✅ Implemented | With tiered quantities/pricing |
| Product Quantities (size/weight tiers) | ✅ Implemented | label + price per variant |
| Harvest Management | ✅ Implemented | open/close, ownership check |
| Harvest Status Toggle | ✅ Implemented | open ↔ close |
| Basic Order Model | ⚠️ Schema only | Migrations exist, no working controller/service |
| Order Items Model | ⚠️ Schema only | Migration exists, no working code |

### ❌ Business Features Missing

| Feature | Impact | Priority |
|---------|--------|----------|
| **Order placement (Customer)** | CRITICAL — Core business flow | P0 |
| **Order lifecycle (status transitions)** | CRITICAL — No order workflow | P0 |
| **Harvest capacity/reservation system** | CRITICAL — No overbooking prevention | P0 |
| **Delivery management** | HIGH — Livreur role has zero APIs | P1 |
| **Admin dashboard / user management** | HIGH — Admin role has zero APIs | P1 |
| **Customer product browsing** | HIGH — Customers can't discover products | P1 |
| **Farmer order fulfillment** | HIGH — Farmers can't see/process orders | P1 |
| **Farmer analytics (harvests, sales)** | MEDIUM | P2 |
| **Notification system** | MEDIUM | P2 |
| **Password reset** | MEDIUM | P2 |
| **Email verification** | LOW | P3 |
| **Reviews/Ratings** | LOW | P3 |
| **Image uploads (products)** | LOW | P3 |

---

## 2. FRONTEND READINESS — BY ROLE

### 🧑‍🌾 FARMER

#### Available APIs
| Endpoint | Method | Status |
|----------|--------|--------|
| `/api/products` | GET | ✅ Fetch farmer's own products |
| `/api/products` | POST | ✅ Create product with quantities |
| `/api/products/{id}` | GET | ✅ Show product detail |
| `/api/products/{id}` | PUT | ✅ Update product |
| `/api/products/{id}` | DELETE | ✅ Delete product |
| `/api/products/manageQuantities` | POST | ✅ Add/update quantity tiers |
| `/api/harvest` | GET | ✅ List harvests (paginated) |
| `/api/harvest` | POST | ✅ Create harvest |
| `/api/harvest/{id}` | GET | ✅ Show harvest |
| `/api/harvest/{id}` | PUT | ✅ Update harvest |
| `/api/harvest/{id}` | DELETE | ✅ Delete harvest |
| `/api/harvest/{id}/{status}` | POST | ✅ Toggle harvest status |

#### Missing APIs
- `GET /api/farmer/orders` — View orders for their products
- `PUT /api/farmer/orders/{id}/status` — Accept/reject/fulfill orders
- `GET /api/farmer/analytics` — Sales, harvest yield stats
- `GET /api/farmer/dashboard` — Dashboard summary data
- `GET /api/farmer/customers` — View customer list (for their products)

#### Missing Actions
- Mark order as fulfilled
- View revenue per harvest
- Set product availability status
- View delivery tracking for their orders

---

### 🛒 CUSTOMER (Client)

#### Available APIs
| Endpoint | Method | Status |
|----------|--------|--------|
| `/api/auth/register` | POST | ✅ |
| `/api/auth/Login` | POST | ✅ |
| `/api/me` | GET | ✅ |
| `/api/auth/logout` | GET | ✅ |

#### Missing APIs
- `GET /api/products` — Browse ALL available products (currently only returns farmer's own)
- `GET /api/products/{id}` — View product detail (public)
- `GET /api/harvests/active` — View open harvests to order from
- `POST /api/orders` — Place an order
- `GET /api/orders` — View customer's order history
- `GET /api/orders/{id}` — View order detail with status
- `PUT /api/orders/{id}/cancel` — Cancel pending order
- `GET /api/customer/dashboard` — Dashboard summary

#### Missing Actions
- Browse product catalog
- Add to cart / place order
- Track order status
- Cancel order
- View order history
- View delivery ETA

---

### 🚚 LIVREUR (Delivery)

#### Available APIs
**ZERO.** The Livreur role exists in the database and enum but has no routes, no controllers, no services whatsoever.

#### Missing APIs (all of them)
- `GET /api/delivery/orders` — Orders assigned to delivery person
- `GET /api/delivery/orders/{id}` — Order detail with customer address
- `PUT /api/delivery/orders/{id}/status` — Mark as picked up / in transit / delivered
- `GET /api/delivery/dashboard` — Today's deliveries summary
- `PUT /api/delivery/availability` — Toggle online/offline

#### Missing Actions
- Accept delivery assignment
- Mark order as picked up
- Mark order as in transit
- Mark order as delivered
- View delivery route / address

---

### 👑 ADMIN

#### Available APIs
**ZERO.** Admin role has no dedicated endpoints.

#### Missing APIs (all of them)
- `GET /api/admin/users` — List all users
- `GET /api/admin/users/{id}` — User detail
- `PUT /api/admin/users/{id}` — Update user / change role
- `DELETE /api/admin/users/{id}` — Deactivate user
- `GET /api/admin/products` — All products (moderation)
- `DELETE /api/admin/products/{id}` — Remove product
- `GET /api/admin/orders` — All orders
- `GET /api/admin/analytics` — Platform metrics
- `GET /api/admin/dashboard` — Admin dashboard summary

---

## 3. API AUDIT

### REST Compliance

| Issue | Severity | Location |
|-------|----------|----------|
| **Route names use uppercase** — `/auth/Login` breaks REST convention | 🔴 HIGH | `routes/api.php:10` |
| **Harvest routes are not RESTful** — Custom action `updateHarvestStatus` instead of PATCH on the resource | 🔴 HIGH | `routes/api.php:28` |
| **`manageQuantity` is a dangling POST** — Not RESTful; should be PATCH/PUT on product quantities sub-resource | 🟡 MEDIUM | `routes/api.php:20` |
| **`GET /auth/logout`** — Logout should be POST (state-changing action) | 🟡 MEDIUM | `routes/api.php:14` |
| **Inconsistent URL style** — Harvest uses singular `/harvest`, products use plural `/products` | 🟡 MEDIUM | `routes/api.php` |
| **No API versioning** — No `/api/v1/` prefix | 🟡 MEDIUM | Global |
| **Harvest `update` method takes `$data` not `$request`** — Parameter named `$data` but it's a FormRequest | 🟡 LOW | `HarvestController.php:39` |

### Pagination

| Resource | Paginated? | Status |
|----------|-----------|--------|
| Harvests (GET /harvest) | ✅ Yes | `Harvest::paginate(30)` |
| Products (GET /products) | ❌ No | Returns ALL products with no pagination |
| Orders | ❌ N/A | No API exists |

### Filtering & Sorting

**NONE implemented anywhere.** No query parameters for filtering by status, date range, price, category, location, etc.

### Error Handling

| Issue | Location |
|-------|----------|
| **AuthService login returns malformed JSON** — `['message', 'Invalid credentials']` (comma instead of `=>`) returns `["message","Invalid credentials"]` | `Authservice.php:39` |
| **AuthService logout returns typo** — `'massage'` instead of `'message'` | `Authservice.php:48` |
| **No global exception handler customization** — `bootstrap/app.php` has empty `withExceptions()` | `app.php:23` |
| **HarvestController destroy** — `Harvest::where('id',$id)` returns a Builder, not a Model. `delete()` on a Builder runs without 404 on missing ID | `HarvestController.php:52` |
| **No try/catch in services** — Database failures bubble up as 500 errors without structured error responses | Global |

### Validation

| Request | Quality | Issues |
|---------|---------|--------|
| `RegisterRequest` | ✅ Good | Proper rules, French messages would be nice for consistency |
| `LoginRequest` | ✅ Good | |
| `StoreProductRequest` | ⚠️ Issues | Namespace `App\Http\requests` (lowercase `r`) — **will fail on case-sensitive filesystems** |
| `StoreProductRequest` | ⚠️ Issues | Method `Authorize()` (capital A) — PSR-4 won't match, **will not be called** |
| `UpdateProductRequest` | ✅ Good | Proper ownership check in authorize() |
| `StoreHarvestRequest` | ✅ Good | |
| `UpdateHarvestRequest` | ✅ Good | |
| `StoreOrderRequest` | ⚠️ Issues | Validates `user_id` from request (should be auth user); validates `harvest` field but migration column is `harvest_id` |

### Resource Responses

| Issue | Location |
|-------|----------|
| **ProductCollection extends JSonResource** — Typo: `JSonResource` instead of `JsonResource`. **Fatal error.** | `ProductCollection.php:4` |
| **ProductCollection references `ProductResource`** — Class doesn't exist. **Fatal error.** | `ProductCollection.php:8` |
| **ProductCollection uses `$this->collection`** — Incorrect for `JsonResource`; should be `ResourceCollection` | `ProductCollection.php` |
| **HarvestResource exists but is NEVER USED** — Controllers return raw models | `HarvestController.php` |
| **No `ProductResource` exists** | Missing file |
| **No `OrderResource` exists** | Missing file |
| **No `UserResource` exists** | Missing file |
| **AuthService returns full User model** — Exposes `password` field (even though hidden, better to use resource) | `Authservice.php` |

---

## 4. BUSINESS RULES AUDIT

### Harvest Validation

| Rule | Implemented? | Notes |
|------|-------------|-------|
| One active harvest per product | ✅ Yes | `ensureNoActiveHarvest()` in HarvestService |
| Start date before end date | ✅ Yes | FormRequest validation |
| Non-negative quantities | ✅ Yes | `min:0` in validation |
| Only farmer who owns product can create harvest | ✅ Yes | `checkOwnership()` |
| Status must be open or close | ✅ Yes | Enum validation |

### Quantity Standards

| Rule | Implemented? | Notes |
|------|-------------|-------|
| Product has tiered quantities (label + price) | ✅ Yes | ProductQuantity model |
| Base price derived from min quantity price | ✅ Yes | Auto-calculated in ProductServices |
| Quantities validated as array | ✅ Yes | FormRequest |

### Capacity Validation (Harvest Reservation)

**🔴 NOT IMPLEMENTED.** This is the most critical missing business rule. The `OrderService.php` file references a `HarvestCapacityService` that does not exist:

```php
// OrderService.php — BROKEN CODE
if(!HarvestCapacityService->canReserve(...)){
```

The file contains pseudo-code/draft code with syntax errors (`$item->validate()`, `$user->id()`, `foreach($items in $item)`, inconsistent variable names). **This entire service is non-functional.**

### Overbooking Prevention

**🔴 NOT IMPLEMENTED.** Related to capacity validation above. Without a reservation system tracking available quantities per harvest, customers can overbook.

### Role Permissions

| Check | Status | Notes |
|-------|--------|-------|
| Only farmers create products | ✅ | `StoreProductRequest::authorize()` |
| Only product owner updates/deletes | ✅ | Checked in ProductServices |
| Only harvest owner manages harvest | ✅ | `checkOwnership()` |
| Role enum used consistently | ⚠️ | String comparisons like `'farmer'` mixed with `UserRole::Farmer` |
| `isAdmin()`, `isClient()`, `isFarmer()`, `isLivreur()` methods exist but are NEVER USED | 🔴 | Dead code |

---

## 5. SECURITY AUDIT

### Authentication

| Check | Status | Notes |
|-------|--------|--------|
| Sanctum token auth | ✅ | Configured |
| Route protection via `auth:sanctum` | ✅ | Applied to product & harvest routes |
| Password hashing | ✅ | Uses `bcrypt()` |
| Register prevents self-assigning Admin role | ✅ | Falls back to Client |
| **No rate limiting on login** | 🔴 | Brute force vulnerability |
| **No rate limiting on any route** | 🔴 | API abuse possible |
| **Auth guard defaults to `web` (session)** | 🔴 | API should default to `sanctum` guard |
| **No token expiration** | 🔴 | Tokens live forever |

### Authorization

| Check | Status | Notes |
|-------|--------|--------|
| Product ownership verified in services | ⚠️ | Inconsistent — some in service, some in FormRequest |
| Harvest ownership in service layer | ✅ | |
| HarvestPolicy exists | ❌ | **BROKEN** — `create()` method references undefined `$harvest` variable. Also, `viewAny()` returns `false` for everyone — no one can list harvests if policy were registered |
| **HarvestPolicy is NOT REGISTERED** | 🔴 | Not in `AuthServiceProvider`, never called |
| **No ProductPolicy** | 🔴 | Missing |
| **No OrderPolicy** | 🔴 | Missing |
| **No UserPolicy / AdminPolicy** | 🔴 | Missing |

### Ownership Validation

| Resource | Ownership Check | Location |
|----------|----------------|----------|
| Products | ✅ Yes | ProductServices + UpdateProductRequest |
| Harvests | ✅ Yes | HarvestService via `checkOwnership()` |
| Orders | ❌ N/A | No working order code |

---

## 6. ARCHITECTURE AUDIT

### Service Layer

| Service | Quality | Issues |
|---------|---------|--------|
| `AuthService` | ⚠️ Fair | Class name `Authservice` (lowercase 's'), inconsistent PascalCase. Handles both business logic AND HTTP response formatting. Should return data, controller builds response. |
| `HarvestService` | ✅ Good | Clean separation, proper exception usage. Method signatures are correct. |
| `ProductServices` | ⚠️ Fair | Class name `ProductServices` (plural, inconsistent). Mixes HTTP responses into service layer. `fetchFarmerProduct` shouldn't exist as a service method — it's a one-line query. `manageQuantity` conflates create and update logic. |
| `OrderService` | 🔴 Broken | Draft/pseudo-code. Syntax errors. References non-existent class `HarvestCapacityService`. Not usable. |

### Form Requests

| Request | Quality | Issues |
|---------|---------|--------|
| `LoginRequest` | ✅ Good | |
| `RegisterRequest` | ✅ Good | |
| `StoreProductRequest` | 🔴 Broken | Namespace `App\Http\requests` has lowercase `r`; method `Authorize()` has capital `A` — both break on Linux/case-sensitive systems |
| `UpdateProductRequest` | ✅ Good | Proper routing-based ownership check |
| `StoreHarvestRequest` | ✅ Good | |
| `UpdateHarvestRequest` | ✅ Good | |
| `StoreOrderRequest` | ⚠️ Fair | Accepts `user_id` from client — security issue |

### API Resources

| Resource | Quality | Issues |
|----------|---------|--------|
| `HarvestResource` | ✅ Good | But never used |
| `ProductCollection` | 🔴 Broken | `JSonResource` typo, references non-existent `ProductResource`, wrong base class |
| `ProductResource` | ❌ Missing | Referenced by ProductCollection but doesn't exist |
| `OrderResource` | ❌ Missing | |
| `UserResource` | ❌ Missing | |

### Thin Controllers

| Controller | Fat/Thin | Issues |
|-----------|----------|--------|
| `AuthController` | ✅ Thin | Good delegation to AuthService |
| `ProductController` | ✅ Thin | Good |
| `HarvestController` | ⚠️ Mixed | `index` and `show` and `destroy` bypass service layer entirely; `update` re-fetches `Harvest` even though route model binding already resolves it |

### Additional Architecture Issues

| Issue | Severity |
|-------|----------|
| **Duplicate project directory** — `agriflow-api/AgriFlow/` contains stale/partial copies of the same files. Confusing and dangerous. | 🔴 |
| **HarvestController namespace** — `App\Http\Controllers\Api` but routes reference both `App\Http\Controllers\Api\HarvestController` and `App\Http\Controllers\ProductController` inconsistently | 🟡 |
| **No Repository pattern** — For a project this size it's acceptable, but direct DB queries in controllers break thin-controller principle | 🟡 |
| **No API versioning directory structure** | 🟡 |
| **No tests** — `tests/Feature/ProductApiTest.php` exists but is empty/stub | 🔴 |

---

## 7. FRONTEND REQUIREMENTS EXTRACTION (Full Backlog)

### 🧑‍🌾 FARMER FRONTEND

#### Pages
1. **Dashboard** — Harvest status overview, active orders count, revenue summary, product count
2. **Products List** — Table/grid of own products with CRUD actions
3. **Product Detail/Edit** — Form with quantity tiers management
4. **Create Product** — Multi-step form (info → quantities → confirm)
5. **Harvests List** — All harvests with status filter, date range filter
6. **Harvest Detail** — Harvest info, daily capacity, progress bar
7. **Create Harvest** — Form with product selector, date range, capacity settings
8. **Orders Management** — Incoming orders filtered by status
9. **Order Detail** — Customer info, items, accept/reject/fulfill actions
10. **Analytics** — Charts: revenue over time, harvest yields, top products
11. **Profile/Settings** — Account info, notification preferences

#### Components
- `ProductCard` — Product display with price range, status badge
- `ProductForm` — Reusable create/edit form
- `QuantityTierInput` — Dynamic label/price pair input
- `HarvestCard` — Harvest summary with progress bar, status badge
- `HarvestForm` — Date picker, product selector, capacity inputs
- `OrderListItem` — Order summary with customer name, status, total
- `OrderStatusBadge` — Color-coded status indicator
- `StatusFilter` — Reusable filter tabs/dropdown
- `DataTable` — Sortable, paginated table wrapper
- `RevenueChart` — Line/bar chart component
- `DashboardStatCard` — Icon + number + label card
- `SidebarNav` — Farmer-specific navigation
- `FarmerLayout` — Layout wrapper with sidebar

#### Actions
- Create/edit/delete product
- Add/update/remove quantity tier
- Create/update/delete harvest
- Open/close harvest
- View incoming orders
- Accept/reject/fulfill order
- View analytics dashboard
- Export harvest/sales report

---

### 🛒 CUSTOMER FRONTEND

#### Pages
1. **Product Catalog** — Browse/search all available products from all farmers
2. **Product Detail** — Full product info, quantity selector, harvest availability, "Order" button
3. **Cart / Order Create** — Review items, select quantities, confirm order
4. **My Orders** — Order history list with status
5. **Order Detail / Tracking** — Order status timeline, items, delivery ETA
6. **Dashboard** — Recent orders, favorite products, spending summary
7. **Profile/Settings** — Account info, delivery address
8. **Registration** — Sign up form
9. **Login** — Sign in form

#### Components
- `ProductCard` — Image placeholder, name, farmer name, price range, stock badge
- `ProductGrid` — Responsive grid of ProductCards
- `SearchBar` — Full-text search with filters
- `QuantitySelector` — Dropdown of available label/price options
- `OrderSummary` — Line items with prices, total
- `OrderStatusTimeline` — Visual progress: pending → processing → delivering → delivered
- `OrderCard` — Order summary for list view
- `CartBadge` — Item count indicator
- `CategoryFilter` — Filter by product type/category
- `FarmerBadge` — Farmer name/rating chip
- `AddressForm` — Delivery address input
- `CustomerLayout` — Layout with navbar, search

#### Actions
- Browse/search products
- View product details
- Select quantity tier
- Place order
- View order history
- Track order status
- Cancel order (if pending)
- Update profile/delivery address

---

### 🚚 LIVREUR FRONTEND

#### Pages
1. **Dashboard** — Today's deliveries, earnings, availability toggle
2. **Delivery Queue** — List of assigned orders
3. **Delivery Detail** — Customer address, items, order notes
4. **Delivery History** — Past completed deliveries
5. **Profile/Settings** — Vehicle info, availability schedule

#### Components
- `DeliveryCard` — Order summary with address, status, action button
- `DeliveryStatusBadge` — Picked up / In transit / Delivered
- `AddressDisplay` — Formatted address with copy button
- `DeliveryTimeline` — Step-by-step delivery progress
- `AvailabilityToggle` — Online/offline switch
- `MapPlaceholder` / `DeliveryMap` — (future) route visualization
- `EarningsSummary` — Today/week earnings
- `LivreurLayout` — Mobile-optimized layout

#### Actions
- View assigned deliveries
- Accept delivery
- Mark as picked up
- Mark as in transit
- Mark as delivered
- Toggle availability
- View delivery history
- View earnings

---

### 👑 ADMIN FRONTEND

#### Pages
1. **Dashboard** — Platform metrics: total users, orders, revenue, active harvests
2. **User Management** — Table of all users with role filter, search
3. **User Detail** — User info, role change, deactivate/activate
4. **Product Moderation** — All products across all farmers
5. **Order Management** — All orders, filterable by status/farmer/customer
6. **Order Detail** — Full order info with timeline
7. **Farmer Management** — List of farmers with product/harvest counts
8. **Platform Analytics** — Revenue, order volume, user growth charts
9. **Settings** — Platform configuration

#### Components
- `AdminStatCard` — Metric display with trend indicator
- `UserTable` — Sortable, filterable user table
- `RoleBadge` — Color-coded role indicator
- `UserActionsDropdown` — Edit role, deactivate, view details
- `OrderTable` — Full order management table
- `RevenueChart` — Platform-wide revenue over time
- `UserGrowthChart` — Registration trend
- `OrderVolumeChart` — Orders per day/week
- `AdminSidebar` — Navigation
- `AdminLayout` — Layout wrapper

#### Actions
- View all users
- Change user role
- Deactivate/activate user
- Delete product (moderation)
- View all orders
- View platform analytics
- Export reports

---

## 8. MISSING BACKEND BEFORE FRONTEND

### 🔴 CRITICAL MISSING FEATURES (Frontend blocked without these)

1. **Complete Order System**
   - `OrderController` (index, store, show, update, destroy)
   - Working `OrderService` (rewrite from scratch — current file is pseudo-code)
   - `OrderPolicy` for authorization
   - `OrderResource` for API responses
   - `StoreOrderRequest` — fix validation (remove `user_id`, add proper `items[]` array)
   - Order status transitions: pending → processing → completed / canceled
   - Order history per user

2. **Harvest Capacity & Reservation System**
   - `HarvestCapacityService` — check available capacity per harvest
   - Daily capacity enforcement (`max_daily_qte`)
   - Total capacity enforcement (`estimated_total_qte`)
   - Reserved quantity tracking per harvest
   - Prevent overbooking

3. **Product Discovery for Customers**
   - Public/authenticated endpoint to list ALL products (not just farmer's own)
   - Filter by farmer, availability, price range
   - Search functionality
   - Pagination

4. **Role-Based Middleware**
   - `AdminMiddleware` — restrict admin routes
   - `FarmerMiddleware` — restrict farmer routes
   - `ClientMiddleware` — restrict customer routes
   - `LivreurMiddleware` — restrict delivery routes

### 🟡 HIGH PRIORITY FEATURES (Needed early in frontend cycle)

5. **Delivery Management System**
   - `DeliveryController`
   - Assign orders to delivery personnel
   - Delivery status workflow: assigned → picked_up → in_transit → delivered
   - Delivery person availability toggle
   - Delivery history

6. **Admin APIs**
   - `Admin/UserController` — user CRUD, role management
   - `Admin/DashboardController` — platform metrics
   - `Admin/OrderController` — order oversight
   - `Admin/AnalyticsController` — platform statistics

7. **Unified API Response Format**
   - Consistent JSON envelope: `{ data, message, errors, meta }`
   - Standardized error responses
   - Pagination metadata

8. **Security Hardening**
   - Rate limiting on auth routes
   - Token expiration/refresh
   - Sanctum guard as default for API
   - CORS configuration

### 🟢 OPTIONAL / NICE-TO-HAVE

9. Notification system (order status changes, new orders for farmers)
10. Password reset flow
11. Email verification
12. Image upload for products
13. Product categories
14. Farmer ratings/reviews
15. Delivery route optimization
16. Export to CSV/PDF
17. Webhooks for order status changes

---

## 9. READINESS SCORE

| Metric | Score | Explanation |
|--------|-------|-------------|
| **Backend Completion** | **25%** | Auth + Product + Harvest work. Orders are broken. Delivery is non-existent. Admin is non-existent. Customer-facing APIs are missing. |
| **Frontend Readiness** | **10%** | Only 2 of 4 roles have any APIs. Customer can only register/login. Livreur and Admin have nothing. |
| **Production Ready** | **0%** | Broken code in multiple places (ProductCollection, OrderService, HarvestPolicy, StoreProductRequest namespace). No rate limiting. No tests. Auth guard misconfigured. Do not deploy. |

### Role-by-Role Readiness

| Role | API Coverage | Frontend Ready |
|------|-------------|----------------|
| Farmer | ~70% | ✅ Can start building pages |
| Customer | ~10% | 🔴 Blocked — needs order system + product browsing |
| Livreur | 0% | 🔴 Blocked — needs entire delivery system |
| Admin | 0% | 🔴 Blocked — needs entire admin API |

---

## 10. NEXT RECOMMENDED WORKTREE

### ORDER OF EXECUTION

```
Step 1: FIX BROKEN CODE (1-2 days)
├── Fix ProductCollection.php (JSonResource typo + missing ProductResource)
├── Fix StoreProductRequest namespace (App\Http\requests → App\Http\Requests)
├── Fix StoreProductRequest::Authorize → authorize
├── Fix OrderService.php (rewrite from scratch)
├── Fix HarvestPolicy::create() undefined $harvest variable
├── Fix AuthService::Login() malformed JSON response
├── Fix HarvestController::destroy() — use findOrFail
└── Create ProductResource.php

Step 2: ORDER SYSTEM (3-5 days)
├── Rewrite OrderService with proper validation, capacity checks
├── Create OrderController (index, store, show, update, destroy)
├── Create OrderResource
├── Create OrderPolicy
├── Fix StoreOrderRequest — accept items array, derive user_id from auth
├── Add order routes to api.php
├── Implement order status transitions
└── Create HarvestCapacityService

Step 3: CUSTOMER-FACING APIs (2-3 days)
├── Add GET /api/products (public catalog with pagination, filtering)
├── Add GET /api/harvests/active (public open harvests)
├── Separate farmer product management from public browsing

Step 4: ROLE MIDDLEWARE + POLICIES (1-2 days)
├── Create role middleware (Admin, Farmer, Client, Livreur)
├── Register and apply policies
├── Fix HarvestPolicy and register it
├── Create ProductPolicy, OrderPolicy

Step 5: DELIVERY SYSTEM (3-4 days)
├── Create DeliveryController
├── Delivery service layer
├── Delivery status workflow
├── Assignment logic

Step 6: ADMIN SYSTEM (3-4 days)
├── Admin controllers
├── Platform analytics
├── User management endpoints

Step 7: HARDENING (2-3 days)
├── Rate limiting
├── Unified response format
├── Error handling
├── CORS
├── Tests
```

### 🎯 IMMEDIATE NEXT ACTION

**Fix the broken code first**, then build the **Order System**. The Order System is the critical path — it connects Farmers to Customers and is the core business transaction. Nothing else matters until orders work. The current `OrderService.php` is unusable draft code and must be rewritten entirely.

---

## APPENDIX: Full Bug Registry

| # | File | Bug | Severity |
|---|------|-----|----------|
| B1 | `ProductCollection.php` | `JSonResource` typo → Fatal error | 🔴 Critical |
| B2 | `ProductCollection.php` | References non-existent `ProductResource` → Fatal error | 🔴 Critical |
| B3 | `OrderService.php` | Entire file is pseudo-code with syntax errors | 🔴 Critical |
| B4 | `StoreProductRequest.php` | Namespace `App\Http\requests` (lowercase `r`) | 🔴 Critical |
| B5 | `StoreProductRequest.php` | Method `Authorize()` (capital A) — won't override `authorize()` | 🔴 Critical |
| B6 | `HarvestPolicy.php` | `create()` references undefined `$harvest` → Fatal error | 🔴 Critical |
| B7 | `Authservice.php:39` | `['message', 'Invalid credentials']` comma instead of `=>` | 🔴 High |
| B8 | `Authservice.php:48` | `'massage'` typo → `'logged out succesfull'` | 🟡 Medium |
| B9 | `HarvestController.php:52` | `Harvest::where('id',$id)->delete()` runs without 404 on missing ID | 🟡 Medium |
| B10 | `routes/api.php:10` | `Login` uppercase breaks REST convention | 🟡 Medium |
| B11 | `routes/api.php:14` | Logout is GET (should be POST) | 🟡 Medium |
| B12 | `routes/api.php:8` | `/harvest` singular, `/products` plural — inconsistent | 🟡 Medium |
| B13 | `auth.php` config | Default guard is `web` (session), should be `sanctum` for API | 🟡 Medium |
| B14 | `StoreOrderRequest.php` | Accepts `user_id` from request — should use auth user | 🔴 High |
| B15 | `User.php` | `isAdmin()`, `isClient()`, `isFarmer()`, `isLivreur()` never used | 🟢 Low |
| B16 | `HarvestStatus.php` | Declared as `enum` but uses `const` syntax — PHP 8.1+ incompatibility | 🟡 Medium |
| B17 | `OrderStatus.php` | Declared as `enum` but uses `const` syntax; `getValues()` method doesn't exist | 🔴 High |
| B18 | Migration `orders` | Calls `OrderStatus::getValues()` — method doesn't exist | 🔴 Critical |
| B19 | `ProductController.php:29` | `manageQuantity` method signature has `Product $product` but route doesn't bind one | 🟡 Medium |
| B20 | No `ProductResource` exists | Referenced by ProductCollection | 🔴 Critical |

---

**Overall Assessment:** The codebase has a functional Farmers' product & harvest management system with decent architecture. However, orders (the core transaction), delivery, admin, and customer-facing features are either broken or non-existent. The codebase is approximately 25% complete. **Do not begin frontend development until at least Step 2 (Order System) is complete.**
