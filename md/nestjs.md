# NestJS Notes

NestJS is a progressive Node.js framework for building efficient and scalable server-side applications. It uses TypeScript by default and follows the **modular architecture**.

## Core Concepts

- **Modules** — organize the app into feature blocks (`@Module()`)
- **Controllers** — handle incoming requests and return responses
- **Providers** — services, repositories, and business logic (injectable)
- **Decorators** — metadata that wires routes automatically

## Quick Example

```typescript
@Controller("cats")
export class CatsController {
  @Get()
  findAll(): string {
    return "This action returns all cats";
  }
}
```

## Dependency Injection

Providers are registered in a module and injected via the constructor:

```typescript
@Injectable()
export class CatsService {
  getCats(): string[] {
    return ["cat1", "cat2"];
  }
}
```

Nest figures out the whole dependency graph at startup and creates instances for you.

## Why Use It

- Structured and opinionated — great for **large teams**
- First-class support for **GraphQL**, **WebSockets**, **microservices**
- Pairs well with **Docker** and **GitHub Actions** for CI/CD