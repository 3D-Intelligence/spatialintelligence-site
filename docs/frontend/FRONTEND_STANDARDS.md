# Spatial Intelligence — Frontend Engineering Standards

This document defines the frontend engineering standards for all Spatial Intelligence web properties. It is intended to be handed to coding agents and engineers to ensure consistency across projects.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [File & Directory Naming](#file--directory-naming)
4. [Component Conventions](#component-conventions)
5. [Styling](#styling)
6. [Routing](#routing)
7. [State Management](#state-management)
8. [Imports & Exports](#imports--exports)
9. [Environment Variables](#environment-variables)
10. [API Integration](#api-integration)
11. [Data Architecture](#data-architecture)
12. [Performance Patterns](#performance-patterns)
13. [Tooling & Configuration](#tooling--configuration)
14. [Code Quality Standards](#code-quality-standards)

---

## Tech Stack

All frontend projects use the following baseline stack. Do not introduce alternatives without justification.

| Concern | Tool | Version |
|---|---|---|
| Framework | React | 18.x |
| Build tool | Vite | 5.x |
| Styling | Tailwind CSS | 3.x |
| Routing | React Router DOM | 6.x |
| Animation | Framer Motion | 10.x |
| Icons | Lucide React | latest |
| Deployment | Vercel | — |
| Analytics | @vercel/analytics | latest |

### JavaScript vs TypeScript

Choose based on project type — do not default to one or the other for consistency alone.

**Use TypeScript for:**
- SaaS applications and internal tools — complex state, API contracts, and multi-contributor codebases benefit significantly from compile-time type checking
- Any project where API response shapes, props, or shared data structures are non-trivial

**Use JavaScript (JSX) for:**
- Marketing and content sites where the component tree is shallow and data flow is simple
- Rapid prototypes where type overhead would slow iteration

When using TypeScript: avoid `any`. Type all API responses, component props, and utility function signatures. If you find yourself reaching for `any` repeatedly, it is a sign the types need redesigning, not bypassing.

Do not use TypeScript `enum`. Use `const` objects with `as const` and a derived union type — this preserves string literal values, avoids enum reverse-mapping pitfalls, and keeps values iterable at runtime:

```ts
export const STAGE_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  DONE:    'done',
  FAILED:  'failed',
} as const

export type StageStatus = typeof STAGE_STATUS[keyof typeof STAGE_STATUS]
```

When using JavaScript: use JSDoc comments to document non-obvious prop shapes and function signatures. This gives IDE autocomplete without the full TypeScript toolchain.

**State management:** No global state library for UI state (no Redux, Zustand, etc.). Use React local state and props. For server state in SaaS applications, use TanStack Query. See [State Management](#state-management).

---

## Project Structure

**Marketing / content site:**

```
<project-root>/
├── src/
│   ├── main.jsx / main.tsx       # React entry point — mounts app, wraps with BrowserRouter
│   ├── App.jsx / App.tsx         # Route definitions only — no layout or business logic
│   ├── index.css                 # Tailwind directives only (@tailwind base/components/utilities)
│   ├── assets/                   # Images and static files imported by components (Vite-processed)
│   ├── components/               # Shared layout and UI components (reused across pages)
│   │   ├── Layout.jsx            # Root layout wrapper — Header + Footer + Analytics
│   │   ├── Header.jsx            # Global navigation
│   │   ├── Footer.jsx            # Global footer
│   │   └── ScrollToTop.jsx       # Route-change scroll utility
│   ├── pages/                    # One file per route
│   │   ├── Home.jsx
│   │   ├── jobs/                 # Job listing detail pages
│   │   └── studies/              # Case study pages
│   └── utils/                    # Pure utility functions — no React, no JSX
│       └── sceneCache.js
├── api/                          # Vercel serverless functions (Node.js)
│   └── send-contact-message.js
├── public/                       # Truly static assets that must have stable URLs
│   └── favicon.ico               # e.g. favicon, robots.txt, og images
├── markdowns/                    # Markdown content files for long-form copy
├── index.html                    # HTML entry point
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── vercel.json
├── .env.example                  # Required — documents all env vars with descriptions
└── .gitignore
```

**SaaS / application (TypeScript, with backend API):**

```
<project-root>/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── assets/
│   ├── components/               # Shared UI components
│   │   └── pipeline/             # Feature-scoped sub-directory (group tightly related components)
│   ├── pages/                    # One file per route
│   │   └── dashboard/            # Sub-pages lazy-loaded from a parent page
│   ├── api/                      # API layer — async functions that return UI types only
│   │   ├── jobsApi.ts            # One module per backend domain
│   │   ├── userApi.ts
│   │   └── mapper.ts             # Pure functions: ApiXxx → UI type transformations
│   ├── types/
│   │   ├── api.ts                # API contract types — mirrors backend spec exactly
│   │   └── ui.ts                 # UI types — what components actually consume
│   ├── mocks/                    # Development mock data, shaped as API types
│   │   ├── apiMockData.ts
│   │   └── uiMockData.ts
│   └── utils/                    # Pure utility functions — no React, no JSX
│       └── format.ts
├── public/
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── vercel.json
├── .env.example
└── .gitignore
```

### Asset directory rules

- `src/assets/` — images and media **imported by components**. Vite processes these: filenames are hashed for cache-busting, and assets can be optimised at build time. This is the correct location for most images.
- `public/` — assets that must be served at a **stable, predictable URL** without processing: `favicon.ico`, `robots.txt`, `og-image.png` referenced in `<meta>` tags, and any file loaded by URL rather than `import`. Do not put general images here.

### Other rules

- `src/components/` holds only components **reused across multiple pages**. Do not put page-specific UI here. Feature-scoped sub-directories (e.g., `components/pipeline/`) are encouraged when a domain has several tightly related components.
- `src/pages/` holds one component per route. Pages may contain inline sub-components if those sub-components are tightly coupled to that page and used nowhere else.
- `src/utils/` contains pure JavaScript/TypeScript modules — no JSX, no React imports.
- `api/` (root-level) contains only Vercel serverless functions (Node.js) for marketing sites. Keep each function small and single-purpose.
- `src/api/` (SaaS projects) contains the frontend API layer. Each module corresponds to a backend domain and exports async functions that return UI types only. See [Data Architecture](#data-architecture).
- `src/types/` (SaaS projects) contains two files: `api.ts` for the backend contract and `ui.ts` for UI types. See [Data Architecture](#data-architecture).
- `src/mocks/` (SaaS projects) contains development mock data. Data must be shaped as API types so it exercises the mapper layer.

---

## File & Directory Naming

| Item | Convention | Example |
|---|---|---|
| All component files | PascalCase | `Home.jsx`, `ArchitectureCaseStudy.jsx` |
| Utility modules | camelCase | `sceneCache.js` |
| Serverless API functions | kebab-case | `send-contact-message.js` |
| Directories | kebab-case | `jobs/`, `studies/` |

All component files — pages, shared components, case studies, job pages — use PascalCase. There is no exception for content-heavy pages.

### Archiving and deletion

Do not commit archived or draft versions of components alongside live code. Git is the version history — the old version is recoverable via `git log`. If a page is being redesigned, delete the old file when the new one is merged. Do not use underscore-prefix conventions (`_Home.jsx`) as a substitute for version control.

---

## Component Conventions

### Default export, named function

All components use named function declarations with a default export:

```jsx
export default function TeamPage() {
  return (
    <section>...</section>
  )
}
```

Do not use anonymous arrow functions as default exports (`export default () => ...`).

### One component per file

Each file exports one primary component. Inline sub-components are acceptable when they are tightly coupled to the parent and small (under ~50 lines). If a sub-component grows, extract it to its own file in `components/`.

### Component size

- **Shared components** (`components/`): keep small and focused. A component that exceeds 300 lines is a signal to decompose it.
- **Page components** (`pages/`): may be larger because they contain full page layouts. Pages over 500 lines should be reviewed for extraction opportunities.

### Props

- In JavaScript projects: do not use prop-types. Document non-obvious props with a JSDoc comment above the component.
- In TypeScript projects: define a `Props` type or interface above the component.
- Destructure props in the function signature.

**JavaScript:**
```jsx
/**
 * @param {{ member: { name: string, role: string, bio: string } }} props
 */
export default function TeamCard({ member }) { ... }
```

**TypeScript:**
```tsx
type Props = {
  member: { name: string; role: string; bio: string }
}

export default function TeamCard({ member }: Props) { ... }
```

---

## Styling

### Tailwind CSS only

All styling uses Tailwind utility classes. Do not introduce:
- CSS Modules
- Styled Components
- Emotion
- Inline `style` props (except for dynamic values that cannot be expressed as Tailwind classes)

### Dark mode

Dark mode is enabled globally by default using Tailwind's `class` strategy. The `<html>` element carries `class="dark"`. Do not toggle dark mode per-component.

### Tailwind configuration

Extend the Tailwind theme in `tailwind.config.js` for project-specific tokens — do not hard-code colour hex values or font names in component files.

Standard custom tokens to define per project:

```js
theme: {
  extend: {
    colors: {
      primary: '...',       // brand accent colour
      background: '...',    // page background
      accent: '...',        // secondary accent
    },
    fontFamily: {
      sans: ['Space Grotesk', 'sans-serif'],
    },
    backgroundImage: {
      'primary-gradient': '...',
      'hero-gradient': '...',
    },
    boxShadow: {
      soft: '...',
      glow: '...',
    },
  },
},
```

### Responsive design

Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`). Mobile-first — base classes apply to mobile, prefixed classes override for larger screens.

### Animations

Use Framer Motion for orchestrated, scroll-triggered, and gesture-based animations. Use Tailwind's `transition` utilities for simple, stateless transitions (hover effects, focus rings, colour changes on class toggle).

Do not reach for Framer Motion for every animation — it adds ~45KB gzipped to the bundle. Apply it where the animation has meaningful sequence, entrance choreography, or gesture response.

**Framer Motion — scroll-triggered entrance:**
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true }}
>
```

**Tailwind — simple hover transition:**
```jsx
<button className="bg-primary hover:bg-primary/80 transition-colors duration-200">
```

---

## Routing

### Structure

Routes are defined exclusively in `App.jsx`. Do not define routes inside page components or nested component files.

### Code splitting

Lazy-load all page components with `React.lazy` and wrap the route tree in `Suspense`. This ensures only the code needed for the current route is loaded on initial visit.

```jsx
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Spinner from './components/Spinner'

const Home = lazy(() => import('./pages/Home'))
const SceneGenerator = lazy(() => import('./pages/SceneGenerator'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scene-generator" element={<SceneGenerator />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
```

This is especially important for pages that import heavy libraries (Three.js, Prism.js) — without lazy loading, those libraries are bundled into the main chunk and downloaded on every page load.

### Route URL conventions

| Pattern | Example | Notes |
|---|---|---|
| Top-level pages | `/about`, `/careers` | kebab-case |
| Sub-routes | `/jobs/founding-engineer` | parent directory + kebab-case slug |
| Tool/app pages | `/scene-generator` | kebab-case, descriptive |

### Always include

- A `*` catch-all route pointing to a `NotFound` (404) page.
- A `ScrollToTop` component rendered inside the router so all route changes scroll to the top.

```jsx
// main.jsx
<BrowserRouter>
  <ScrollToTop />
  <App />
</BrowserRouter>
```

---

## State Management

### UI state — local only

Use `useState` and `useReducer` for component UI state. Do not introduce global state libraries for UI concerns.

If multiple components need to share state, lift to the nearest common ancestor. If sharing requires passing through more than two intermediate components that don't use the data, use React Context — do not drill props through uninvolved components.

### Server state — TanStack Query (SaaS projects)

For applications that fetch, cache, and synchronise data from an API, use [TanStack Query](https://tanstack.com/query). Managing server state with `useState` + `useEffect` across many endpoints is repetitive and inconsistently handles loading, error, and stale states.

```tsx
import { useQuery, useMutation } from '@tanstack/react-query'
import { fetchJobsList } from '../api/jobsApi'

function JobList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobsList,
  })
  // ...
}
```

For resources that update while the user is watching (e.g., a running pipeline job), use `refetchInterval` to poll. Gate polling on whether the resource is still active to avoid unnecessary requests once the job has reached a terminal state:

```tsx
const { data: job } = useQuery({
  queryKey: ['job', jobId],
  queryFn: () => fetchJobDetails(jobId),
  refetchInterval: (query) => {
    const status = query.state.data?.status
    return isActiveJobStatus(status) ? 5_000 : false
  },
})
```

Marketing and content sites with minimal data fetching do not require TanStack Query — use the standard fetch pattern in those cases.

### useEffect

- Always clean up effects that set up subscriptions, timers, or event listeners.
- Always include a dependency array. An empty array (`[]`) is intentional; omitting it is a bug.

```jsx
useEffect(() => {
  const handler = (e) => { ... }
  window.addEventListener('click', handler)
  return () => window.removeEventListener('click', handler)
}, [])
```

### useRef

Use `useRef` for:
- DOM node references (dropdown click-outside detection, canvas cleanup)
- Mutable values that should not trigger re-renders (animation frame IDs)

---

## Imports & Exports

### Import order

Group imports in this order, separated by blank lines:

```jsx
// 1. React core
import { useState, useEffect, useRef, lazy, Suspense } from 'react'

// 2. Third-party libraries
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

// 3. Internal components
import Layout from '../components/Layout'

// 4. Utilities and data
import { getCachedScene } from '../utils/sceneCache'

// 5. Styles (if any)
import 'prismjs/themes/prism-tomorrow.css'
```

### Dynamic imports

Use dynamic `import()` inside `useEffect` or async handlers for heavy libraries not needed on initial render. Do not use top-level `await import()` — it blocks the module graph.

```jsx
useEffect(() => {
  async function loadScene() {
    const THREE = await import('three')
    // use THREE here
  }
  loadScene()
}, [])
```

### Exports

- Use `export default function ComponentName` for all page and component files.
- Use named exports for constants and data arrays that may be imported selectively.

```jsx
// Named export for data
export const timeline = [...]

// Default export for component
export default function Vision() { ... }
```

---

## Environment Variables

### .env.example is mandatory

Every project must include a `.env.example` file that lists every environment variable with a description comment and a safe placeholder value. This is the source of truth for what environment variables the project requires.

```bash
# API endpoint for the 3D scene generation backend
VITE_SPINTEL_API_BASE_URL=https://api.example.com

# Postmark email service credentials (server-side only, not exposed to browser)
POSTMARK_API_KEY=your-api-key-here
POSTMARK_FROM_EMAIL=noreply@spatial-intelligence.com
POSTMARK_TO_EMAIL=hello@spatial-intelligence.com
```

### Naming conventions

| Prefix | Context | Access |
|---|---|---|
| `VITE_` | Browser-visible | `import.meta.env.VITE_*` |
| No prefix | Server-side only | `process.env.*` (in `/api/` functions) |

Never prefix secrets (API keys, private tokens) with `VITE_` — they will be bundled into the client JavaScript and exposed publicly.

### Feature flags

Use `VITE_ENABLE_*` prefixed boolean variables for feature flags:

```bash
VITE_ENABLE_GLB_VIEWER=true
```

Read them with a fallback:

```js
const glbEnabled = import.meta.env.VITE_ENABLE_GLB_VIEWER === 'true'
```

---

## API Integration

### Marketing sites — serverless functions

For marketing sites, light backend logic (contact forms, email dispatch) lives in `/api/` as Vercel serverless functions. Each function handles one endpoint and one responsibility.

```
api/
├── send-contact-message.js   # POST /api/send-contact-message
└── send-scene-request.js     # POST /api/send-scene-request
```

Use the native `fetch` API for these one-off form submissions. Always handle loading, success, and error states explicitly:

```jsx
const [isSubmitting, setIsSubmitting] = useState(false)
const [submitSuccess, setSubmitSuccess] = useState(false)
const [submitError, setSubmitError] = useState(null)

async function handleSubmit(e) {
  e.preventDefault()
  setIsSubmitting(true)
  setSubmitError(null)

  try {
    const res = await fetch('/api/send-contact-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (!res.ok) throw new Error('Request failed')
    setSubmitSuccess(true)
  } catch (err) {
    setSubmitError('Something went wrong. Please try again.')
  } finally {
    setIsSubmitting(false)
  }
}
```

### SaaS applications — `src/api/` layer

SaaS applications communicate with a separate backend API. Do not use Vercel serverless functions as a proxy in this case. Instead, define an `src/api/` directory with one module per backend domain:

```
src/api/
├── jobsApi.ts    # fetchJobsList, fetchJobDetails, createJob
├── userApi.ts    # fetchQuota, fetchApiKey
└── mapper.ts     # pure transformation functions (ApiXxx → UI types)
```

Each API module function:
1. Calls `fetch` against the backend URL
2. Types the raw response as the appropriate `ApiXxx` type from `src/types/api.ts`
3. Passes the raw response through `mapper.ts` and returns a UI type
4. Throws on non-OK responses so TanStack Query can surface the error automatically

Components call these functions as `queryFn` or `mutationFn` — they never call `fetch` directly, and they never handle raw API shapes. See [Data Architecture](#data-architecture) for the full pattern.

### Mock flag

During development against a backend that is not yet available, gate API calls behind a `VITE_USE_MOCKS` flag checked at the top of each API module:

```ts
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

export async function fetchJobDetails(jobId: string): Promise<Job> {
  if (USE_MOCKS) {
    const apiJob = MOCK_API_JOBS.find(j => j.id === jobId)
    if (!apiJob) throw new Error('Job not found in mocks')
    return mapJobResponseToUiJob(apiJob, MOCK_ARTIFACTS[jobId])
  }
  // ... real fetch
}
```

Mock data must be shaped as API types (not UI types) so it is always passed through the mapper. This means the mapper is exercised even without a live backend, and discrepancies between mock shapes and the real API spec surface early.

---

## Data Architecture

This section applies to SaaS applications that communicate with a backend API. It describes how to structure the boundary between raw API responses and the data that components consume.

### Two-layer type system

Define types in two files with distinct concerns:

- **`src/types/api.ts`** — mirrors the backend data contract exactly. Field names, types, and shapes match the API spec. These types are owned by the backend contract, not by the UI.
- **`src/types/ui.ts`** — defines the shapes that components consume. Field names are chosen for UI clarity, derived fields (durations, formatted values) are included, and all display-facing constants and enums live here.

```
src/types/
├── api.ts    # ApiJobResponse, ApiStageStatus, ApiArtifactsResponse, ...
└── ui.ts     # Job, Stage, Artifact, JobListItem, StageStatus, ...
```

This split matters when API field names differ from natural UI names (`tier` → `quality`, `name` → `filename`), when the UI requires derived fields computed from raw values (elapsed time from ISO timestamps), or when the API response requires normalisation before rendering (e.g., clamping a stage that is still `running` on a terminal job to `failed`).

**Components must never import from `src/types/api.ts`.** Only the mapper and API modules touch API types.

### Mapper layer

Define `src/api/mapper.ts` — a module of pure functions that transform API types to UI types. The mapper is the single place where:

- Field renames are applied (`tier` → `quality`)
- Derived fields are computed (duration from start/end timestamps)
- API edge cases are normalised (incomplete stages, missing fields)
- Flat arrays are restructured for the UI (grouping artifacts by stage)

```ts
// src/api/mapper.ts
export function mapJobResponseToUiJob(
  apiJob: ApiJobResponse,
  apiArtifacts?: ApiArtifactsResponse
): Job {
  return {
    id:        apiJob.id,
    prompt:    apiJob.prompt,
    quality:   apiJob.tier,                                    // field rename
    elapsed:   calculateDuration(apiJob.started_at, apiJob.finished_at),  // derived
    stages:    mapStages(apiJob.stages, apiJob.status, ...),  // normalisation
    artifacts: groupArtifacts(apiArtifacts?.artifacts ?? []), // restructure
    // ...
  }
}
```

Keep mapper functions pure (no side effects, no `fetch` calls). They can be unit-tested in isolation without mocking network calls.

For list views, define a lighter projection mapper (`mapJobResponseToListItem`) that returns only the fields a list card needs. This keeps list queries lean — do not fetch full job detail data just to render a list row.

### API module layer

Each file in `src/api/` corresponds to one backend domain. API module functions:

1. Accept typed parameters and return a **UI type** — never an `ApiXxx` type
2. Call `fetch`, type the raw response explicitly as the relevant `ApiXxx` type
3. Pass the raw response through the mapper and return the result
4. Throw on non-OK responses so TanStack Query surfaces the error automatically

```ts
// src/api/jobsApi.ts
export async function fetchJobDetails(jobId: string): Promise<Job> {
  const [jobRes, artifactsRes] = await Promise.all([
    fetch(`/v1/jobs/${jobId}`),
    fetch(`/v1/jobs/${jobId}/artifacts`),
  ])
  if (!jobRes.ok) throw new Error('Failed to fetch job')

  const [jobData, artifactsData]: [ApiJobResponse, ApiArtifactsResponse] = await Promise.all([
    jobRes.json(),
    artifactsRes.json(),
  ])

  return mapJobResponseToUiJob(jobData, artifactsData)
}
```

### Mock data

Keep development mock data in `src/mocks/`. Shape it as **API types** — not UI types. This ensures mock data passes through the mapper, so the mapper is exercised during development without a live backend and any divergence from the real API spec surfaces earlier.

```
src/mocks/
├── apiMockData.ts   # Mock objects shaped as ApiJobResponse, ApiArtifactsResponse, etc.
└── uiMockData.ts    # Pre-mapped UI shapes for components that don't go through the API layer
```

---

## Performance Patterns

### Route-level code splitting

All routes must be lazy-loaded via `React.lazy`. See [Routing](#routing). This is the highest-impact performance measure for SPAs with multiple pages.

### Dynamic imports for heavy libraries

Import Three.js, Prism.js, and other large libraries dynamically inside `useEffect` or async handlers — never at the top of the file. See [Imports & Exports](#imports--exports).

### IndexedDB for large asset caching

When fetching or generating large binary assets (3D scenes, GLB models), cache them in IndexedDB to avoid redundant network requests. Encapsulate all IndexedDB logic in a utility module in `src/utils/`.

### Framer Motion viewport animations

Always set `viewport={{ once: true }}` on scroll-triggered animations so they do not re-trigger when the user scrolls back up.

### Bundle analysis

Run a bundle analysis before shipping any significant feature that adds new dependencies:

```bash
npx vite-bundle-visualizer
```

Flag any chunk exceeding 200KB uncompressed for review.

---

## Tooling & Configuration

### Required config files

Every project must include:

| File | Purpose |
|---|---|
| `vite.config.js` | Vite build configuration |
| `tailwind.config.js` | Tailwind theme extensions |
| `postcss.config.js` | Tailwind + Autoprefixer |
| `vercel.json` | Vercel deployment settings |
| `.env.example` | Environment variable documentation |
| `eslint.config.js` | ESLint rules (required on all new projects) |
| `.prettierrc` | Prettier formatting rules (required on all new projects) |
| `.gitignore` | Standard ignore rules |

### ESLint

Required on all new projects. Use the **flat config format** (`eslint.config.js`) — this is the default in ESLint 9+. Do not use the legacy `.eslintrc.js` format.

```bash
npm install -D eslint @eslint/js eslint-plugin-react eslint-plugin-react-hooks globals eslint-config-prettier
```

```js
// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import prettierConfig from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2022 },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'no-console': 'warn',
    },
  },
  prettierConfig,
]
```

`eslint-config-prettier` must be the last entry in the array — it disables all ESLint rules that could conflict with Prettier's formatting decisions.

Add `"lint": "eslint src"` to `package.json` scripts.

### Prettier

Required on all new projects. Standard config:

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2
}
```

Add `"format": "prettier --write src"` to `package.json` scripts.

### VS Code settings

Commit a `.vscode/settings.json` to the repository so all contributors get format-on-save behaviour automatically. This requires the **Prettier** (`esbenp.prettier-vscode`) and **ESLint** (`dbaeumer.vscode-eslint`) VS Code extensions.

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### .gitignore minimums

```
node_modules/
dist/
.env
.env.local
.vercel/
```

---

## Testing

### Required for SaaS applications

SaaS projects must have a test suite. Use **Vitest** (integrates with Vite natively, no additional config overhead) with **React Testing Library**.

```bash
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
```

```js
// vite.config.js
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
```

### What to test

- **Always test:** utility functions, data transformation logic, form validation
- **Test where valuable:** components with non-trivial conditional rendering or user interaction flows
- **Do not test:** static content pages, presentational-only components with no logic

### Testing is not required for marketing sites

Content-only marketing sites without complex interaction logic do not require a test suite. Apply judgement — if a component has meaningful conditional behaviour, test it regardless of project type.

---

## Code Quality Standards

### General rules

- Write code for the reader, not the writer. Prioritise clarity.
- Do not add comments that restate what the code does. Comment only where the *why* is non-obvious.
- Do not leave `console.log` statements in committed code. ESLint will warn on these.
- Do not add error handling for scenarios that cannot occur. Validate at system boundaries (user input, API responses) only.
- Do not build abstractions for one-off patterns. Three similar blocks of JSX is better than a premature generic component.

### Avoid

- Inline `style` props unless the value is genuinely dynamic and cannot be expressed in Tailwind.
- Deeply nested ternaries in JSX — extract to a variable or early return instead.
- Anonymous default exports (`export default () => ...`).
- Mutations of state directly — always use the setter from `useState`.
- `any` in TypeScript projects — redesign the type instead.

### Page component checklist

Before marking a page component as complete, verify:

- [ ] Route registered in `App.jsx` with `React.lazy`
- [ ] Page scrolls to top on navigation (ScrollToTop handles this automatically)
- [ ] All text content is accessible (sufficient colour contrast against dark background)
- [ ] Keyboard navigable (interactive elements reachable and operable via keyboard)
- [ ] Responsive at `sm`, `md`, and `lg` breakpoints
- [ ] All `useEffect` hooks have a dependency array and return a cleanup function if applicable
- [ ] No hardcoded colour values — uses Tailwind custom tokens from `tailwind.config.js`
- [ ] All API calls handle loading, success, and error states
- [ ] Images loaded from `src/assets/` (or `public/` only if a stable URL is required)

---

*Last updated: 2026-05-01*
*Derived from: spatial-intelligence-site and spintel-app (main branch)*

---

## Appendix: Project Scaffolding Guide

This appendix is for coding agents bootstrapping a new project. Complete the project brief first, then follow the steps in order.

---

### Step 0 — Complete the project brief

Before writing any code, confirm the following. Every answer changes what gets scaffolded.

```
Project name:        ___________________________
Project type:        [ ] Marketing / content site
                     [ ] SaaS / application
Language:            [ ] JavaScript (JSX)   — marketing sites, simple content
                     [ ] TypeScript (TSX)   — SaaS apps, complex data flow
Brand primary colour (hex):  ___________
Brand accent colour (hex):   ___________
Font family (Google Fonts):  ___________
Top-level routes needed:     ___________________________
Needs authentication:        [ ] Yes  [ ] No
Needs database / API:        [ ] Yes  [ ] No
```

---

### Step 1 — Bootstrap with Vite

**JavaScript project:**
```bash
npm create vite@latest <project-name> -- --template react
```

**TypeScript project:**
```bash
npm create vite@latest <project-name> -- --template react-ts
```

---

### Step 2 — Install standard dependencies

**All projects:**
```bash
npm install react-router-dom framer-motion lucide-react @vercel/analytics
npm install -D tailwindcss@3 postcss autoprefixer
npm install -D eslint @eslint/js eslint-plugin-react eslint-plugin-react-hooks globals eslint-config-prettier
npm install prettier --save-dev
npx tailwindcss init -p
```

**SaaS projects, add:**
```bash
npm install @tanstack/react-query
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
```

**TypeScript projects, add:**
```bash
npm install -D @types/react @types/react-dom
```

---

### Step 3 — Write config files

**`vite.config.js` (JavaScript, no testing):**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**`vite.config.js` (SaaS — includes Vitest):**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
```

**`tailwind.config.js`** — replace placeholder values with project brief answers:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#000000',     // REPLACE with brand primary colour
        background: '#0a0a0a',  // REPLACE with background colour
        accent: '#000000',      // REPLACE with accent colour
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // REPLACE with project font
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(...)', // REPLACE
        'hero-gradient': 'linear-gradient(...)',     // REPLACE
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.12)',
        glow: '0 0 20px rgba(0,0,0,0.3)', // REPLACE colour
      },
    },
  },
  plugins: [],
}
```

**`eslint.config.js`:**
```js
import js from '@eslint/js'
import globals from 'globals'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import prettierConfig from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2022 },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'no-console': 'warn',
    },
  },
  prettierConfig,
]
```

**`.prettierrc`:**
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2
}
```

**`.vscode/settings.json`:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

**`vercel.json`** — required for client-side routing to work on Vercel:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

**`.gitignore`:**
```
node_modules/
dist/
.env
.env.local
.vercel/
```

**`.env.example`** — add one entry per variable the project will use:
```bash
# Backend API base URL
VITE_API_BASE_URL=https://api.example.com
```

---

### Step 4 — Create the directory structure

**Marketing site:**
```bash
mkdir -p src/components src/pages src/utils src/assets api public
```

**SaaS project:**
```bash
mkdir -p src/components src/pages src/utils src/assets src/api src/types src/mocks src/test public
echo "import '@testing-library/jest-dom'" > src/test/setup.ts
```

The `src/api/` directory will contain the API layer modules and `mapper.ts`. The `src/types/` directory will contain `api.ts` and `ui.ts`. The `src/mocks/` directory will contain API-shaped mock data used behind the `VITE_USE_MOCKS` flag.

---

### Step 5 — Write the entry files

**`src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**`index.html`** — add the dark class and Google Font link:
```html
<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <!-- REPLACE: add Google Fonts link for project font -->
    <title><!-- REPLACE: project name --></title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**`src/main.jsx`:**
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import ScrollToTop from './components/ScrollToTop'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

**`src/components/ScrollToTop.jsx`:**
```jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
```

**`src/App.jsx`** — add one lazy import and Route per page in the project brief:
```jsx
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

const Home = lazy(() => import('./pages/Home'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
```

**`package.json` scripts** — ensure these are present:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src",
    "format": "prettier --write src"
  }
}
```

---

### Step 6 — Verify the scaffold

Before writing any page content, confirm:

- [ ] `npm run dev` starts without errors
- [ ] `npm run lint` runs without config errors
- [ ] Tailwind classes apply (test with a `className="text-primary"` in Home)
- [ ] Dark mode active (`<html class="dark">` present in browser dev tools)
- [ ] Routing works — navigating to `/anything` renders NotFound, not a Vite 404
- [ ] `vercel.json` is committed
- [ ] `.env.example` documents all variables the project will need
