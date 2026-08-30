# Mastermind — Bootstrap Implementation Plan

## Goals

Bootstrap the new Mastermind application with a minimal, clean foundation that allows the existing VanillaJS implementation to be ported incrementally to Svelte 5.

The initial goal is **not** to redesign the game or introduce a complex architecture.

The priority is to:

1. Create a minimal SvelteKit + Svelte 5 project.
2. Configure it for static deployment on GitHub Pages.
3. Establish a small and predictable project structure.
4. Port the existing game logic incrementally.
5. Keep the UI intentionally minimal during the initial phases.
6. Leave room to evolve the visual design gradually.
7. Avoid introducing abstractions until they are actually needed.

---

## Core Principles

### DRY — Don't Repeat Yourself

Avoid duplicating logic, configuration, constants, types, or UI behavior.

Prefer a single source of truth whenever something is shared.

### Don't edit or delete unless explicitly asked for

Do not modify or remove existing implementation details unless the current task explicitly requires it.

When porting functionality, preserve the behavior of the existing implementation unless a change is explicitly requested.

If something appears obsolete or incorrect, flag it rather than silently changing or deleting it.

### Don't over-engineer

Prefer the simplest implementation that solves the current problem.

Do not introduce:

- unnecessary abstractions
- state-management libraries
- dependency-heavy UI libraries
- premature design systems
- unnecessary utility layers
- complex folder structures
- backend infrastructure before it is required

The architecture should evolve together with the application.

### English source code and file content

All source-code comments and file content must be written in English.

This includes:

- comments
- TODOs
- documentation files
- component text intended as technical/content source
- configuration comments

User-facing Italian text can be introduced where required by the application itself.

---

## Collaborative Decision Making

The implementation is a **collaborative process between the user and the agent**.

The agent must not make non-obvious architectural, technical, tooling, UX, or implementation decisions silently.

When a choice is not clearly determined by the existing plan or project requirements:

1. Identify that a decision is required.
2. Proactively present the relevant alternatives.
3. Clearly explain the **pros and cons** of each meaningful option.
4. Recommend an option when there is a reasonable preference.
5. Wait for the user's decision before proceeding when the choice has meaningful consequences.

Do not overwhelm the user with alternatives that have no practical relevance.

The purpose is to make important decisions **together**, while allowing the agent to handle straightforward implementation details autonomously.

For example, if there are multiple reasonable approaches to a problem:

    Option A

    Pros:
    - ...

    Cons:
    - ...

    Option B

    Pros:
    - ...

    Cons:
    - ...

    Recommendation:
    Option A, because ...

The agent should be proactive about surfacing such decisions rather than discovering them after implementation.

### Avoid unnecessary decision points

Not every implementation detail requires discussion.

The agent may proceed autonomously when:

- the choice is conventional and low-impact;
- there is effectively one sensible solution;
- the choice is easily reversible;
- the decision is already established by this document;
- discussing it would add unnecessary friction.

The goal is **collaborative decision making where it matters, not micromanagement**.

---

# Technology

Use:

- **Svelte 5**
- **SvelteKit**
- **TypeScript**
- **Bun**
- **Biome**
- **GitHub Pages**
- **Static SvelteKit adapter**

Fallbacks:

- Use **pnpm** if Bun causes compatibility or tooling problems.
- Use **Prettier + ESLint** if Biome causes compatibility or tooling problems.

Do not introduce alternative tools unless there is a concrete reason to do so.

---

# Available Resources and References

The following resources are known options and should be considered during bootstrap.

They are **not mandatory dependencies or mandatory starting points**.

The agent should evaluate whether using one of them is actually beneficial for the current project.

### Official SvelteKit project

The official SvelteKit repository and project scaffolding should be considered the default reference for creating a new SvelteKit application.

Repository:

https://github.com/sveltejs/kit

Use this approach when the cleanest solution is to start from the official minimal SvelteKit setup and configure only the required tooling.

### SvelteKit GitHub Pages starter

`metonym/sveltekit-gh-pages` is a minimal SvelteKit setup specifically targeting GitHub Pages and can be evaluated as a starting point or as a reference for the static deployment configuration.

Repository:

https://github.com/metonym/sveltekit-gh-pages

It may be useful if it significantly reduces the amount of GitHub Pages configuration required.

Do not use it automatically. Compare it against starting from the official SvelteKit scaffolding.

### Svelte dashboard starter

`dazacode/svelte-dashboard-starter` is another available Svelte 5/SvelteKit starter using a more opinionated stack, including UI-related tooling.

Repository:

https://github.com/dazacode/svelte-dashboard-starter

This is primarily a reference/example and is **not the preferred starting point** for this project because it may introduce considerably more tooling and UI infrastructure than Mastermind requires.

The agent may evaluate it or similar starters if a concrete requirement emerges, but should avoid inheriting unnecessary dependencies.

### Resource evaluation rule

Before adopting a boilerplate, starter, template, or third-party configuration:

- understand what it provides;
- identify what dependencies and conventions it introduces;
- compare it with the minimal official SvelteKit setup;
- explain relevant trade-offs to the user;
- avoid adopting it merely because it saves a few initial commands.

A resource should be adopted only if its benefits outweigh the additional complexity it introduces.

The agent is explicitly encouraged to propose **better alternatives**, including a completely manual setup, if that results in a simpler or more maintainable project.

---

# Phase 1 — Project Bootstrap

Create the minimal SvelteKit project using Bun.

Prefer the official SvelteKit scaffolding unless an evaluated starter provides a clear advantage.

A possible baseline is:

    SvelteKit
    Svelte 5
    TypeScript
    minimal template
    Bun

The exact bootstrap command should follow the current official SvelteKit recommendations.

The initial setup should contain only what is necessary to:

- install dependencies;
- run the development server;
- build the application;
- type-check the project;
- format/lint the project;
- generate a static build.

Verify:

    bun install
    bun run dev
    bun run check
    bun run build

The project should start successfully before any game-specific implementation is added.

If the chosen bootstrap approach differs from the baseline above, explain why before proceeding.

---

# Phase 2 — Static GitHub Pages Configuration

Configure SvelteKit for static output using the official static adapter.

The application must be deployable to GitHub Pages without requiring a server runtime.

Account for the repository base path from the beginning, but keep the configuration as simple as possible.

Verify locally that the production build produces a fully static application.

Do not introduce SSR, server routes, or backend infrastructure.

If a GitHub Pages starter is being considered, compare it against configuring `adapter-static` manually before choosing.

---

# Phase 3 — Formatting and Code Quality

Configure Biome as the default formatter/linter.

The goal is a small, predictable configuration rather than an exhaustive ruleset.

At minimum, provide commands for:

- formatting;
- linting;
- type checking.

Prefer one consistent toolchain over multiple overlapping tools.

If Biome proves problematic, evaluate Prettier + ESLint as the fallback.

Do not install both toolchains unless there is a concrete requirement.

---

# Phase 4 — Minimal Project Structure

Start with a deliberately small structure.

A possible initial structure is:

    src/
    ├── lib/
    │   └── mastermind/
    │       ├── game.ts
    │       ├── types.ts
    │       └── ...
    │
    └── routes/
        ├── +page.svelte
        └── rules/
            └── +page.svelte

The exact structure should follow the actual needs discovered during implementation.

Do not create directories simply because they might be useful later.

Introduce additional structure only when the codebase actually needs it.

For example, do not create:

    stores/
    services/
    repositories/
    utils/
    hooks/
    adapters/
    design-system/

unless an actual requirement emerges.

---

# Phase 5 — Isolate Existing Game Logic

Before rewriting the game in Svelte, identify the logic already present in the VanillaJS implementation.

Separate the domain logic from DOM manipulation where possible.

Typical responsibilities may include:

- generating the secret code;
- validating guesses;
- comparing guesses with the secret code;
- calculating feedback;
- tracking attempts;
- determining win/loss state;
- calculating score.

The exact functions and names should follow the existing implementation rather than being invented prematurely.

The objective is to preserve existing behavior while making the game logic usable independently from the UI.

---

# Phase 6 — Port the Game Logic Incrementally

Move the existing game logic into the new project without changing its behavior unnecessarily.

Prefer small, pure functions where the existing code naturally allows it.

Keep the game logic independent from Svelte components whenever possible.

The intended dependency direction is:

    Svelte component
           │
           ▼
       Game state
           │
           ▼
    Mastermind domain logic

Avoid putting all game rules directly inside `.svelte` components.

Do not introduce a state-management library.

Use Svelte 5's built-in reactivity/state primitives where application state is actually required.

### Preserve existing behavior

The existing VanillaJS implementation is the behavioral reference for the port.

During the initial migration:

- preserve game rules;
- preserve scoring behavior;
- preserve edge-case behavior;
- preserve user-visible behavior unless a change is explicitly requested;
- do not perform unrelated refactoring.

If the old implementation contains behavior that appears questionable, do not silently "fix" it.

Report it to the user and let the user decide whether it should remain or change.

---

# Phase 7 — Minimal Game UI

Create the first playable version with intentionally minimal UI.

The initial UI should prioritize:

- correctness;
- usability;
- clear game state;
- easy iteration.

Do not attempt to reproduce the final visual design at this stage.

Avoid introducing:

- component libraries;
- CSS frameworks;
- animation libraries;
- design systems;
- elaborate responsive layouts;
- unnecessary visual abstractions.

The UI should be simple enough that its visual structure can be changed later without having to rewrite the game logic.

### Gradual UI development

The user wants to decide the visual direction progressively.

Therefore:

- do not make significant visual/design decisions without discussion;
- keep initial markup simple;
- use semantic HTML where practical;
- prefer plain CSS;
- avoid locking the project into a visual system prematurely;
- make visual changes incrementally as requested.

The initial implementation should be intentionally **unstyled or minimally styled** where possible.

---

# Phase 8 — CSS Strategy

Use plain CSS by default.

CSS can live close to the component that owns the styling when that is the simplest solution.

Do not introduce a CSS framework unless a concrete requirement appears.

Keep styling deliberately sparse during the initial implementation.

The visual language, spacing, colors, typography, animations, and component styling should be decided incrementally rather than being defined upfront.

The implementation must remain compatible with adding custom CSS later.

If a CSS architecture decision becomes non-obvious, present the alternatives and trade-offs to the user before committing to it.

Do not introduce CSS variables, design tokens, utility classes, global conventions, or a styling architecture solely for hypothetical future needs.

Introduce them when there is an actual need.

---

# Phase 9 — Rules Page

Add a minimal `/rules` page.

Initially, keep it as simple content rather than building a documentation system.

Do not create a CMS, markdown pipeline, content collection, or other abstraction unless it becomes necessary.

The rules page should share existing application layout/styling only when doing so is genuinely useful.

Avoid duplicating shared UI or content unnecessarily.

---

# Phase 10 — First Deployment

Set up GitHub Actions to build and deploy the static application to GitHub Pages.

The deployment should:

1. Install dependencies.
2. Run checks.
3. Build the application.
4. Deploy the generated static output.

Keep the workflow minimal.

Do not add unrelated CI/CD infrastructure.

If there are multiple reasonable GitHub Pages deployment approaches, present the alternatives before choosing one.

### GitHub Pages constraints

The application must work correctly when deployed:

- as a static site;
- under the repository base path when applicable;
- without requiring a server runtime.

Do not introduce server-side functionality solely to solve deployment concerns.

---

# Phase 11 — Verification

Before considering the bootstrap complete, verify:

### Development

    bun run dev

### Type checking

    bun run check

### Formatting

    bun run format

### Linting

    bun run lint

### Production build

    bun run build

### Static deployment

Verify that the generated application works correctly when served from the GitHub Pages repository path.

Verify that:

- the game loads;
- the game can be played;
- navigation works;
- `/rules` works;
- assets resolve correctly under the GitHub Pages base path;
- refreshing a page does not expose an unexpected deployment-specific problem;
- the production build does not rely on a server runtime.

---

# Future Work — Explicitly Out of Scope

The following should **not** be implemented during the bootstrap unless explicitly requested:

- leaderboard backend;
- authentication;
- database;
- user accounts;
- analytics;
- multiplayer;
- server-side rendering;
- API routes;
- complex state management;
- UI component libraries;
- CSS frameworks;
- elaborate animations;
- sound system;
- themes;
- advanced accessibility work;
- extensive automated testing infrastructure.

These can be evaluated individually when there is an actual requirement.

Do not create infrastructure for these features merely because they may exist in the future.

---

# Future Leaderboard

The application should remain deployable as a static GitHub Pages application even after a leaderboard is introduced.

When the leaderboard becomes a real requirement, evaluate an external backend/API separately.

The frontend should not be coupled to a backend prematurely.

A possible future boundary is:

    Mastermind game
          │
          ├── local game state
          │
          └── leaderboard API

The exact backend technology should be decided when the requirement becomes concrete.

When that time comes, present the viable alternatives with clear pros and cons before implementation.

---

# Working Method

Implementation should proceed in small, verifiable steps.

For each step:

1. Make the smallest reasonable change.
2. Run the relevant checks.
3. Verify that existing behavior has not been unnecessarily changed.
4. Avoid speculative refactoring.
5. Stop and reassess before introducing a new abstraction.
6. If a non-obvious decision is encountered, involve the user before committing to it.

Prefer:

    small change
        ↓
    verify
        ↓
    small change
        ↓
    verify

over implementing the entire architecture upfront.

The project should remain **boring, readable, and easy to change** during the early stages.

The agent should optimize for:

- fast bootstrap;
- incremental migration;
- low cognitive overhead;
- minimal dependencies;
- preservation of existing behavior;
- gradual UI evolution.

The goal is not to maximize the number of technologies, abstractions, or files in the initial project.

---

# Agent Behavior Summary

When working on this project, the agent should:

- Prefer the simplest viable solution.
- Use Bun unless it causes a concrete problem.
- Fall back to pnpm only when necessary.
- Use Biome unless it causes a concrete problem.
- Fall back to Prettier + ESLint only when necessary.
- Prefer the official SvelteKit setup unless a starter provides a clear advantage.
- Consider the listed starter projects as references, not requirements.
- Evaluate available boilerplates before creating equivalent infrastructure manually.
- Propose alternative starters or a manual setup when they are more appropriate.
- Keep the project static and GitHub Pages-compatible.
- Preserve existing VanillaJS behavior during the port.
- Avoid editing or deleting existing code unless explicitly asked.
- Avoid speculative refactoring.
- Avoid premature abstractions.
- Keep UI and CSS intentionally minimal during early development.
- Prefer plain CSS and leave visual decisions open for later iteration.
- Ask the user before making non-obvious decisions.
- Proactively present meaningful alternatives with clear pros and cons.
- Recommend an option when appropriate.
- Let the user make the final decision on meaningful architectural, technical, or UX choices.
- Proceed autonomously with straightforward, low-impact, reversible implementation details.
- Validate changes incrementally rather than making large batches of changes.
- Keep comments and technical file content in English.
- Follow DRY principles.
- Do not edit or delete unless explicitly asked.
- Do not over-engineer.
- Optimize for a fast bootstrap and a straightforward port of the existing VanillaJS implementation.
