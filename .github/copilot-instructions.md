## Project Vision

Mamba is an intelligent assistant designed to empower and streamline the daily workflow of your team. The goal is to create a highly usable, visually stunning, and customizable desktop application that leverages shadcn/ui for a modern, accessible UI. Mamba will provide smart, context-aware features to make everyday tasks on your PC easier and more efficient.

- The UI will be crafted with shadcn/ui and Radix UI primitives for a beautiful, consistent, and accessible experience.
- All features are tailored to enhance productivity and adapt to the unique needs of your team.
- Mamba acts as a smart companion, integrating seamlessly into your desktop environment to assist with routine and complex tasks.

# Copilot Instructions for Mamba

## Language and Style
- **All code, comments, and documentation must be written in English**, regardless of the language used in the prompt or communication.

## Architecture Principles
- The project follows **Domain-Driven Design (DDD)** and a **modular, layered architecture**.
- The main layers are:
  - `domain`: Core business logic, domain models, value objects, and errors. No infrastructure or UI logic here.
  - `application`: Application-specific use cases and orchestration. No UI or infrastructure logic.
  - `infrastructure`: Adapters for external systems (local storage, commands, etc). No business logic here.
  - `presentation`: UI components, routes, assets, and user interaction logic. No business logic here.


## Directory Structure
- `src/domain/`: Domain models, value objects, errors, use cases interfaces, and repository interfaces for each entity.
- `src/application/`: Use cases and application services implementations.
- `src/infrastructure/`: Adapters for persistence, and other integrations.
- `src/presentation/`: UI components, routes, assets, and utilities.
- `public/`: Static assets.

## Best Practices
- **Separation of concerns**: Keep domain, application, infrastructure, and presentation logic separated.
- **No business logic in infrastructure or presentation**.
- **No direct backend or storage access in domain or presentation**; always use repositories/adapters.
- **Validation**: Validate all external input in the presentation or application layer before passing to domain logic.
- **Error handling**: Use domain-specific errors in business, and map them to appropriate UI messages or codes.
- **Testing**: Write unit tests for business logic and integration tests for adapters and UI.
- **TypeScript only**: Use modern TypeScript features and strict typing.
- **Formatting and linting**: Use ESLint and Prettier as configured in the project.
- **Environment variables**: Use `.env` files for configuration, never hardcode secrets.

## Naming and Structure
- Use **camelCase** for variables and functions, **PascalCase** for classes and types.
- File and folder names in **kebab-case** or **lowercase**.
- Place each entity in its own folder under `domain`.
- Use `model.ts`, `repository.ts`, `value-objects.ts`, `errors.ts` for each domain entity.
- Use `usecases/` folder for use case files.

## Communication
- Even if the user communicates in Spanish, always generate code, comments, and documentation in English.
- If unsure about a requirement, prefer to ask for clarification before making assumptions.

## Example Structure
```
src/
  domain/
    user/
      model.ts
      repository.ts
      value-objects.ts
      errors.ts
  application/
    usecases/
      get-user.ts
      save-user.ts
  infrastructure/
    repositories/
      user-repository.ts
  presentation/
    components/
      UserForm.tsx
    routes/
      user.tsx
    assets/
      ...
    lib/
      ...
public/
  logo.svg
  ...
```

## Tooling
- Use the scripts in `package.json` for build, dev, lint, and format.
- Use the configured ESLint and Prettier rules for code quality.
- Use the provided VSCode settings for consistent development experience.
- Use shadcn/ui components for UI consistency and accessibility.
- Tanstack Router for routing and navigation (src/presentation/routes).

## Additional Guidelines

### Documentation
- All new features, modules, or significant changes must be documented in the code and, if needed, in the project’s main README or relevant sub-README.
- Public APIs and use cases and business logic should be documented.

### Error Logging
- Use the configured logger or error boundary for all error and info logging.
- Avoid using `console.log` in production code.

### Testing
- All business logic must have unit tests.
- New code should not decrease overall test coverage.


### Internationalization (i18n)
- All user-facing messages (errors, UI texts) must use i18n keys defined in `src/presentation/lib/locales/`.
- Use `i18next`, `react-i18next`, and `i18n-js` for all translations and message formatting.
- Never use hardcoded human-readable strings in the UI or logic. Always use i18n keys and translation functions.
- Add new keys to both `en.json` and `es.json` and ensure all flows are covered in both languages.

### UI Library
- Use shadcn/ui components for all new UI, following the patterns in `src/presentation/components/ui/`.
- Compose and extend UI using Radix UI primitives and utility classes as per shadcn guidelines.
- Ensure accessibility and consistent styling by leveraging shadcn's variant and slot patterns.
- There is a Sidebar and Navbar that must be used on all application screens.These components are used in `src/presentation/components/app-layout.tsx`.

### State Management
- Use Zustand for global and feature state, with stores in `src/presentation/lib/stores/`.
- Use XState for complex flows and state machines, especially for orchestrating business and UI logic, machines can be created at `src/presentation/lib/machines/`.
- When integrating state, prefer subscribing Zustand stores to XState actors for reactivity and single source of truth.

### Error Handling in Tests
- Always test for domain errors using code-style identifiers (e.g., `truck.validation_error.license_plate_empty`).
- Avoid relying on human-readable error messages in assertions; use code-style identifiers for consistency and i18n.
- Ensure all domain errors are tested in unit tests, and UI components handle them correctly.
- Every error must be present in the locales files (`en.json`, `es.json`) with a corresponding i18n key.

### Contract-Driven Development
- All new features must start with the contract or type definition.
- Update types and interfaces before implementation or test changes.
- UI and logic must strictly follow the contract and generated types.

---

## Authentication Guidelines

- All authentication and session logic must be implemented in the domain, application, and infrastructure layers. The presentation layer should only contain UI and hooks for authentication.
- The login page (`/login`) must not display the sidebar or navbar. Only authenticated/protected routes use the main app layout.
- All protected routes must check authentication and redirect to `/login` if not authenticated.
- The logout action must clear the session and redirect to `/login`.
- Session expiration (e.g., 30 minutes of inactivity) must be enforced and surfaced to the user with an i18n error message.
- All user-facing authentication messages (errors, labels, etc.) must use i18n keys and be present in both `en.json` and `es.json`.
- Never use `console.log` for authentication errors; use the configured logger or error boundary.
- Follow DDD and contract-driven development for all authentication-related code.

# How to Work with User Stories in Mamba App

Whenever you receive a user story, follow this step-by-step process to ensure quality, traceability, and alignment with project standards:

1. **Read and Analyze the User Story**
   - Carefully review the user story and its acceptance criteria.
   - Identify all required fields, behaviors, and edge/corner cases.

2. **Locate Relevant Information**
   - Domain models: `src/domain/<entity>`
   - Use cases: `src/application/usecases/`
   - Domain errors: `src/domain/exceptions/`
   - Repositories: `src/domain/repositories/` and `src/infrastructure/repositories/`
   - UI components: `src/presentation/components/`
   - Routes: `src/presentation/routes/`
   - Assets: `src/presentation/assets/`
   - Tests: `./tests`
   - openapi.json: will be shared in the prompt if needed

3. **Contract First**
   - Update or confirm the contract (API types, etc.) before implementing new features.
   - Never implement or change a feature that depends on backend without confirming the contract.

4. **Domain & Application Layer**
   - Update or create domain models, value objects, and errors as needed.
   - Define or update use case files and implementations.
   - Ensure all business logic is in the domain or application layer, not in infrastructure or presentation.

5. **Infrastructure Layer**
   - Update or create repository adapters to support new or changed needs.
   - Ensure no business logic leaks into infrastructure.

6. **Presentation Layer**
   - Implement or update UI components and routes to match the contract and use cases.
   - Validate all input in the presentation or application layer before passing to domain logic.
   - Map domain errors to appropriate UI messages using code-style identifiers.

7. **Testing**
   - Write or update tests, mirroring the business structure.
   - Ensure all use cases, acceptance criteria, and corner cases are covered.
   - Use the AAA (Arrange, Act, Assert) pattern in all tests.
   - Run all tests to verify correctness and coverage.

8. **Manual Test Scenarios**
   - For each user story, create or update manual test scenarios in the UI to facilitate manual testing.
   - Ensure the new or updated flows accurately represent the new business scenarios or edge cases introduced by the user story.

9. **Documentation & Logging**
   - Document new features or changes in code and, if needed, in the README.
   - Use the configured logger or error boundary for all error/info logging.

10. **Internationalization**
   - Use code-style identifiers for all user-facing messages, errors, and logs.

---

**Always follow these steps for every user story to ensure consistency, quality, and maintainability in the Mamba project.**

---
