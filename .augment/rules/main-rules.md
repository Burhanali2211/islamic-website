---
type: "always_apply"
---

# Augment AI — Supercharged Full-Stack Agent Rules

## Objective
Transform Augment AI into a next-generation full-stack developer assistant with 1000x productivity. These rules enforce structure, prevent inefficiencies, and automate critical backend-to-frontend workflows with zero compromise on code quality, security, or scalability.

---

## 🧠 CORE DEVELOPMENT BEHAVIOR

### 1. Development Loop: Understand → Plan → Execute → Optimize
- Begin each task with full context awareness and technical planning.
- Avoid premature coding. Design component relationships, database schema, and API flows first.
- Refactor for maintainability, DRYness, and modularity before finalizing code.

### 2. Self-Debugging System
- Auto-run linting and logic validation on every output.
- Ensure:
  - No syntax issues
  - No circular imports or naming collisions
  - No unhandled errors
  - No client-breaking responses

### 3. No Redundancy Enforcement
- Eliminate duplicate imports, styles, components, or logic blocks.
- Consolidate shared elements into atomic or shared folders.
- Flag redundant code and auto-suggest refactor patches.

### 4. Enforced Componentization
- Always use scalable architecture (e.g. Atomic Design, MVC, MVVM).
- Every UI block must be reusable, encapsulated, and documented.
- Never inline functional logic unless the function is single-use and scoped.

### 5. Functional First, Fancy Later
- Deliver raw functionality fast.
- Layer UX enhancements incrementally after logic is verified and database-connected.

---

## 🧰 AUTOMATION WORKFLOWS

### 6. Auto Database Integration
- Detect backend type (Supabase, Firebase, MongoDB, PostgreSQL).
- Auto-generate:
  - Schema
  - Migration scripts
  - Relationships (1:1, 1:N, N:M)
  - Environment configuration (`.env.local`, `.env.production`)
  - Role-based permission policies

### 7. API Scaffolding System
- Auto-build REST or GraphQL endpoints per model.
- Include:
  - CRUD + search
  - Input schema validation (Zod, Joi, Yup)
  - Authentication guard (JWT, session, etc.)
  - Response standardization
  - Swagger/OpenAPI docs

### 8. UI Automation Layer
- UI must be generated using:
  - TailwindCSS + ShadCN (default)
  - Chakra UI (optional)
  - Headless UI or Radix Primitives for logic
- No raw CSS or inlined style objects unless scoped utility classes are exhausted.

### 9. Deployment Pipeline Awareness
- Generate deploy-ready structure:
  - `.env` for all environments
  - `Dockerfile` (if full-stack)
  - `vercel.json`, `netlify.toml`, or `render.yaml`
  - Health check endpoints
  - Auto backup scripts (DB + static assets)

---

## 🔄 PRODUCTIVITY ENHANCEMENTS

### 10. Auto TODO System
- Extract actionable tasks from instructions.
- Maintain checklist format throughout execution.
- Example:
