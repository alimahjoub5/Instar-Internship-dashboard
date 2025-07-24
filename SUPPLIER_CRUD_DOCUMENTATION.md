# Admin Dashboard Documentation

## 1. Overview

The admin dashboard (`dash-adm`) provides centralized management for users, products, categories, subcategories, suppliers, reviews, and system settings. It uses a layout with a top navbar, a sidebar menu, and a dynamic content area powered by Angular routing.

---

## 2. Layout Structure

- **dash-adm.ts / dash-adm.html**
  - Serves as the main layout wrapper for the admin area:
    - `<app-navbar>`: Top navigation bar (profile, logout, etc.)
    - `<app-sidebar>`: Sidebar menu for section navigation
    - `<main class="main-content"><router-outlet></router-outlet></main>`: Main content area, displays the current view based on the route

---

## 3. Main Features

### 3.1 Dashboard (Home)
- **dashboard-home/**
  - Welcome view with key statistics (users, products, sales, orders)
  - Quick actions (add user, add product, view reports, settings)

### 3.2 User Management
- **users/**
  - List users with search, pagination, and filtering
  - Add, edit, delete, block/unblock users
  - Components:
    - `user/`: User list and management
    - `adduser/`: Add/edit user form
    - `delete-dialog/`: Delete confirmation dialog

### 3.3 Product Management
- **products/**
  - List products with filters (category, supplier, search)
  - Add, edit, delete products
  - Detailed product view (with 3D visualization, reviews, etc.)
  - Components:
    - `liste-product/`: Product list and management
    - `add-product/`: Add product
    - `edit-product/`: Edit product
    - `consult-product/`: Product details, 3D upload, 3D viewer

### 3.4 Category & Subcategory Management
- **categories/**
  - Add, edit, delete categories
- **subcategories/**
  - Add, edit, delete subcategories

### 3.5 Supplier Management
- **suppliers/**
  - List, add, edit, delete suppliers

### 3.6 Review Management
- **reviews/**
  - View and manage product reviews

### 3.7 System Settings
- **settings/**
  - General settings (app name, language, timezone, etc.)
  - Email settings (SMTP server, etc.)
  - Security (session duration, password policy, 2FA, etc.)
  - Notifications (email, push, SMS, new user/order notifications)

### 3.8 Admin Profile
- **profile-admin/**
  - Displays the connected admin's profile information

---

## 4. Navigation

- **Navbar**:
  - Shows the connected admin's name/email
  - Link to admin profile
  - Logout button

- **Sidebar**:
  - Dynamic links to: Dashboard, Users, Products, Categories, Subcategories, Suppliers, Settings, Logout

---

## 5. Security & Authentication

- Access is protected by Angular guards (`auth.guard.ts`)
- User information is retrieved via `UserService` and localStorage

---

## 6. Technologies Used

- Angular (standalone components)
- Angular Material (UI)
- RxJS (for API calls)
- Angular Routing
- Service-based data access (REST API)

---

## 7. Customization & Extensibility

- To add a new section, create a component in `dash-adm/`, add it to the routing and the sidebar.
- Sidebar items are dynamic and can be modified in `sidebar.component.ts`.

---

**For more detailed documentation on a specific section (e.g., product management, security) or a navigation diagram, please request it!** 