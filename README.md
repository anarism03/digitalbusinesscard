# Digital Business Card (DBC) Panel

A web application for managing digital business cards, company hierarchies, and employee profiles. Built with React, TypeScript, and Tailwind CSS.

This project provides a role-based dashboard where companies can manage their employees, generate QR codes for digital business cards, and track scan analytics.

## Features

* **Role-Based Access Control**: Separate interfaces for Super Admin, Company Admin, and Employees.
* **Super Admin Dashboard**:

  * Manage multiple client companies.
  * View high-level system analytics and stats.
* **Company Admin Panel**:

  * Add, edit, and manage employee profiles.
  * Generate and customize QR codes for employee cards.
  * Bulk employee import and export functionality.
  * View scan logs, audit logs, and analytics.
* **Employee Portal**:

  * Employees can log in to view and update their personal profile information.
* **Public Card View**:

  * Responsive digital business card page accessible via QR scan.
  * Quick contact sharing and social links.

## Tech Stack

* **Framework**: React 18 with Vite
* **Language**: TypeScript
* **Styling**: Tailwind CSS & Ant Design (antd)
* **State Management**: Redux Toolkit
* **Routing**: React Router v6
* **Forms & Validation**: React Hook Form + Zod
* **Charts & Analytics**: Recharts
* **Utilities**: Axios, QRCode, Day.js

## Getting Started

### Prerequisites

Make sure you have Node.js installed (version 18+ recommended).

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd dbc_panel
```

2. Install dependencies:

```bash
npm install
```

3. Copy the example environment file:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
npm run dev
```

The application will usually be running at `http://localhost:5173`.

## Demo mode

This repository runs against **mock data** by default (`VITE_MOCK_MODE=true` in `.env.example`), so it works out of the box without a live backend. Use these accounts to sign in:

| Role | Email | Password |
| --- | --- | --- |
| Super Admin | `admin@demo.com` | `demo1234` |
| Company Admin | `company@demo.com` | `demo1234` |
| Employee | `employee@demo.com` | `demo1234` |

Super Admin signs in from `/login?mode=super-admin`; Company Admin and Employee use the regular `/login` page (VÖEN field accepts any 10-digit value in mock mode).

All data (companies, employees, scan logs, audit log) is generated in-memory and resets on page reload — nothing is sent to a real server. To point the app at the real backend instead, set `VITE_MOCK_MODE=false` in `.env`.

## Available Scripts

* `npm run dev` - Runs the app in development mode
* `npm run build` - Compiles TypeScript and builds for production
* `npm run preview` - Locally preview the production build
* `npm run lint` - Runs ESLint to check code quality
* `npm run format` - Formats source files with Prettier

## Folder Structure

```text
src/
├── components/   # Reusable UI components
├── pages/        # Role-based pages (super-admin, company-admin, employee, public)
├── hooks/        # Shared React hooks
├── store/        # Redux store and slices
├── services/     # Axios API configuration and endpoints
├── styles/       # Per-component style objects
├── types/        # TypeScript interfaces and types
├── utils/        # Framework-agnostic helpers
├── validators/   # Zod form validation schemas
└── routes/       # Application routing configuration
```

