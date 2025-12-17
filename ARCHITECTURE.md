# Project Architecture

## Folder Structure

```
src/app/
├── core/                    # Singleton services, guards, interceptors (app-wide)
│   ├── services/           # Business logic services
│   ├── guards/             # Route guards
│   ├── interceptors/       # HTTP interceptors
│   └── models/             # Core interfaces and types
│
├── shared/                  # Reusable components, directives, pipes
│   ├── components/         # Dumb/presentational components
│   ├── directives/         # Custom directives
│   └── pipes/              # Custom pipes
│
└── features/               # Feature modules (lazy-loaded)
    ├── dashboard/          # Analytics dashboard feature
    └── settings/           # Settings feature
```

## Design Principles

### 1. Clean Architecture
- **Core**: Contains singleton services and app-wide utilities
- **Shared**: Reusable UI components with no business logic
- **Features**: Self-contained feature modules with lazy loading

### 2. State Management
- **Angular Signals** for reactive state (primary)
- **RxJS** only for complex async operations (HTTP, WebSockets)

### 3. Performance
- All components use `ChangeDetectionStrategy.OnPush`
- Lazy loading for all feature routes
- `trackBy` functions for all `*ngFor` directives
- Optimized bundle size with tree-shaking

### 4. Code Quality
- **Strict TypeScript** (no `any` types)
- **ESLint** with Angular-specific rules
- **Jest** for unit testing with high coverage
- **Prettier** for consistent formatting

## Path Aliases

```typescript
@app/*      → src/app/*
@core/*     → src/app/core/*
@shared/*   → src/app/shared/*
@features/* → src/app/features/*
```

## Testing Strategy

- **Unit Tests**: Jest with isolated component testing
- **Coverage Target**: 80%+ for services and components
- **Mock Strategy**: Mock all external dependencies
