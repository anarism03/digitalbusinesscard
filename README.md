# Digital Business Card (DBC) Panel

A web application for managing digital business cards, company hierarchies, and employee profiles. Built with React, TypeScript, and Tailwind CSS.

## Purpose

Traditional paper business cards get lost, go out of date, and can't tell you who actually looked at them. This project replaces them with a **digital business card platform**: every employee gets a personal, always-up-to-date profile page (contact details, social links, job title, photo) that can be shared with a single tap, a QR code, or an NFC card — and every scan is tracked.

The platform is built around three roles working together:

* A **Super Admin** (the platform operator) onboards and manages client companies from a single dashboard.
* Each client company's **Company Admin** manages their own team: adding employees, customizing their cards, tracking who is scanning them, and auditing every change.
* **Employees** log in to their own portal to keep their profile current, without needing admin help for every small update.

The result is a lightweight internal tool that a company can hand to its sales/support/ops team so their contact information is always accurate and easy to share.

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

This repository runs against **mock data** by default (`VITE_MOCK_MODE=true` in `.env.example`), so it works out of the box with no live backend, no database, and no setup beyond `npm install`.

### Credentials

The VÖEN field accepts any 10-digit value in mock mode:

| Role | Login page | Email | Password | Can do |
| --- | --- | --- | --- | --- |
| Super Admin | `/login?mode=super-admin` | `admin@demo.com` | `demo1234` | Manage all client companies, view platform-wide stats |
| Company Admin | `/login` | `company@demo.com` | `demo1234` | Manage the demo company's employees, cards, analytics, audit log, settings |
| Employee | `/login` | `employee@demo.com` | `demo1234` | View and edit their own digital card profile |

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

