<div align="center">

# 🏭 CxO Playbook

### Steel Plant Production & Efficiency Management System

A modern, real-time dashboard for steel plant executives to monitor production KPIs, track downtime events, and optimize operational efficiency — all from a single unified interface.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Pages & Modules](#-pages--modules)
- [State Management](#-state-management)
- [Form Validation](#-form-validation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

**CxO Playbook** is a domain-specific MES (Manufacturing Execution System) dashboard designed for steel plant operations. It empowers CxOs and plant managers with real-time visibility into:

- **Production yield** and burning loss metrics
- **Furnace operation** logs and coal consumption tracking
- **Downtime analysis** with Pareto charts for root-cause identification
- **Plant availability** and shift-wise performance trends

The application is fully client-side with persistent local storage, making it deployable as a standalone tool with zero backend dependencies.

---

## ✨ Features

### 📊 Executive Dashboard
- **Real-time KPI cards** — Yield %, total production, plant availability, and efficiency status
- **Pareto analysis** — Downtime categorized by Mechanical, Electrical, and Operational causes
- **Yield trend charts** — Line chart tracking actual yield vs. 97% target over time
- **Performance alerts** — Automatic warnings when yield drops below 90% or burning loss exceeds 5%
- **Recent production log table** — Detailed view with color-coded status badges

### 📝 Production Entry (Multi-Step Wizard)
- **Step 1 — Raw Materials**: Log batch IDs, heat numbers, and weights
- **Step 2 — Furnace Operations**: Record furnace readings and coal consumption
- **Step 3 — Production Runs**: Capture output per steel grade (good production + scrap)
- **Step 4 — Yield Summary**: Auto-calculated yield %, burning loss %, and material balance
- Validation ensures output cannot exceed input (negative burning loss protection)

### ⏱️ Downtime Entry
- **Shift-based event tracking** — Log each downtime event with start/end times and reason codes
- **480-minute constraint** — Validates that total runtime + downtime equals a full 8-hour shift
- **Overlap detection** — Prevents overlapping time entries across events
- **Real-time metrics** — Live calculation of total downtime, runtime, and capacity utilization

### ⚙️ Master Data Management
- **Products** — Define steel grades and dimensions (e.g., TMT Fe500 — 12mm)
- **Shifts** — Configure shift names and timings (e.g., Morning 06:00–14:00)
- **Downtime Codes** — Categorized as Mechanical, Electrical, or Operational with unique codes

### 🎨 UI / UX
- **Dark / Light theme** toggle with system preference detection
- **Skeleton loading states** for every page (smooth perceived performance)
- **Responsive sidebar** navigation with color-coded route icons
- **Toast notifications** for success and error feedback
- **Empty states** with illustrations and call-to-action prompts

---

## 🛠️ Tech Stack

| Layer              | Technology                                                                 |
| ------------------ | -------------------------------------------------------------------------- |
| **Framework**      | [Next.js 16](https://nextjs.org/) (App Router, React Server Components)   |
| **Language**       | [TypeScript 5](https://www.typescriptlang.org/)                           |
| **UI Library**     | [React 19](https://react.dev/)                                            |
| **Styling**        | [Tailwind CSS 3.4](https://tailwindcss.com/) + CSS Variables              |
| **Components**     | [shadcn/ui](https://ui.shadcn.com/) (New York style, Radix UI primitives) |
| **Icons**          | [Lucide React](https://lucide.dev/)                                       |
| **Charts**         | [Recharts 3](https://recharts.org/)                                       |
| **State Mgmt**     | [Zustand 5](https://zustand.docs.pmnd.rs/) with `persist` middleware      |
| **Forms**          | [React Hook Form 7](https://react-hook-form.com/) + [Zod 4](https://zod.dev/) |
| **Date Utilities** | [date-fns 4](https://date-fns.org/)                                       |
| **Theming**        | [next-themes](https://github.com/pacocoursey/next-themes)                 |
| **Package Manager**| [pnpm](https://pnpm.io/)                                                  |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App Router                    │
│                  (Server Components)                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │Dashboard │  │  Production  │  │   Downtime Entry  │  │
│  │  (KPIs)  │  │   Wizard     │  │   (Events Log)   │  │
│  └────┬─────┘  └──────┬───────┘  └────────┬─────────┘  │
│       │               │                    │            │
│  ┌────▼───────────────▼────────────────────▼─────────┐  │
│  │              Zustand Stores (Persisted)            │  │
│  │   productionStore  │  masterStore                  │  │
│  │   ├─ productionLogs│  ├─ products                  │  │
│  │   └─ downtimeLogs  │  ├─ shifts                    │  │
│  │                    │  └─ downtimeCodes              │  │
│  └────────────────────┴──────────────────────────────┘  │
│                         │                               │
│  ┌──────────────────────▼────────────────────────────┐  │
│  │              localStorage (Browser)               │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │   Shared: shadcn/ui • Zod Schemas • Calculations  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **pnpm** ≥ 8.x (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/david-one8/cxo-playbook.git
cd cxo-playbook

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open **[http://localhost:3000](http://localhost:3000)** — the app auto-redirects to `/dashboard`.

### Build for Production

```bash
pnpm build
pnpm start
```

---

## 📁 Project Structure

```
cxo-playbook/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (sidebar + navbar + theme)
│   ├── page.tsx                  # Redirects to /dashboard
│   ├── globals.css               # Tailwind + CSS variable theme tokens
│   ├── dashboard/
│   │   └── page.tsx              # Executive KPI dashboard
│   ├── entry/
│   │   ├── production/
│   │   │   └── page.tsx          # Multi-step production wizard
│   │   └── downtime/
│   │       └── page.tsx          # Downtime event logging
│   └── admin/
│       └── masters/
│           └── page.tsx          # Master data CRUD (products, shifts, codes)
│
├── components/
│   ├── ui/                       # shadcn/ui primitives (button, card, dialog, etc.)
│   ├── layout/                   # App shell (sidebar, navbar, theme provider)
│   ├── shared/                   # Reusable components (stat-card, skeletons, empty-state)
│   └── features/                 # Domain-specific components
│       ├── production/           # Wizard steps + yield summary
│       ├── downtime/             # Downtime event form
│       └── masters/              # Product, shift, downtime-code forms
│
├── lib/
│   ├── types/index.ts            # TypeScript interfaces (Product, Shift, Logs, etc.)
│   ├── schemas/                  # Zod validation schemas
│   │   ├── productionSchemas.ts  # Raw material, furnace, production run schemas
│   │   └── downtimeSchemas.ts    # Downtime event & log schemas
│   ├── stores/                   # Zustand state management
│   │   ├── productionStore.ts    # Production + downtime logs (persisted)
│   │   └── masterStore.ts        # Products, shifts, downtime codes (persisted)
│   └── utils/                    # Pure utility functions
│       ├── calculations.ts       # Yield, burning loss, downtime calculations
│       ├── formatters.ts         # Display formatting helpers
│       ├── time.ts               # Time conversion utilities
│       └── cn.ts                 # Tailwind class merge utility
│
└── public/                       # Static assets
```

---

## 📄 Pages & Modules

| Route                | Module               | Description                                             |
| -------------------- | -------------------- | ------------------------------------------------------- |
| `/dashboard`         | Executive Dashboard  | KPI cards, Pareto charts, yield trends, production logs |
| `/entry/production`  | Production Wizard    | 4-step form: raw materials → furnace → output → summary |
| `/entry/downtime`    | Downtime Tracker     | Shift-based event logging with 480-min validation       |
| `/admin/masters`     | Master Data          | Tabbed CRUD for products, shifts, and downtime codes    |

---

## 🗄️ State Management

The app uses **Zustand** with the `persist` middleware to store all data in `localStorage`. No backend or database is required.

### Stores

| Store              | Data                                    | Key Features                              |
| ------------------ | --------------------------------------- | ----------------------------------------- |
| `productionStore`  | Production logs, downtime logs          | CRUD operations, recent logs retrieval    |
| `masterStore`      | Products, shifts, downtime codes        | Duplicate detection, cascading validation |

Data persists across page refreshes and browser sessions automatically.

---

## ✅ Form Validation

All forms are validated using **Zod** schemas integrated with **React Hook Form**:

| Schema                  | Validates                                               |
| ----------------------- | ------------------------------------------------------- |
| `rawMaterialSchema`     | Batch ID, heat number, weight > 0                       |
| `furnaceLogSchema`      | Furnace ID, readings (end > start), coal consumption    |
| `productionRunSchema`   | Product selection, good production ≥ 0, scrap ≥ 0       |
| `productionLogSchema`   | Full production entry (date, shift, all nested arrays)  |
| `downtimeEventSchema`   | Time format validation (HH\:MM), reason code required   |
| `downtimeLogSchema`     | Date, shift, events array with overlap detection        |

---

## 🧮 Key Calculations

| Metric              | Formula                                                  |
| ------------------- | -------------------------------------------------------- |
| **Total Input**     | $\sum \text{Raw Material Weights}$                       |
| **Total Output**    | $\sum (\text{Good Production} + \text{Scrap})$           |
| **Burning Loss**    | $\text{Total Input} - \text{Total Output}$               |
| **Burning Loss %**  | $\frac{\text{Burning Loss}}{\text{Total Input}} × 100$   |
| **Yield %**         | $\frac{\text{Total Output}}{\text{Total Input}} × 100$   |
| **Plant Availability** | $\frac{\text{Runtime}}{\text{Runtime} + \text{Downtime}} × 100$ |

---

## 🤝 Contributing

1. **Fork** this repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Commit** changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to branch: `git push origin feature/my-feature`
5. **Open** a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📜 License

This project is private and proprietary. All rights reserved.

---

<div align="center">

**Built with ❤️ for Steel Plant Operations**

[Report Bug](https://github.com/david-one8/cxo-playbook/issues) · [Request Feature](https://github.com/david-one8/cxo-playbook/issues)

</div>
