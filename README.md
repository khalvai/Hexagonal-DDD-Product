# Hexagonal DDD Product

A NestJS backend that demonstrates **Hexagonal Architecture**, **Domain-Driven Design (DDD)**, the **Transactional Outbox** pattern, **CQRS**, and **event-driven messaging** with RabbitMQ.

---

## Table of Contents

- [Hexagonal Architecture](#hexagonal-architecture)
- [Outbox and Inbox Pattern](#outbox-and-inbox-pattern)
- [CQRS Pattern](#cqrs-pattern)
- [This Project](#this-project)
  - [What Was Built](#what-was-built)
  - [Project Structure](#project-structure)
  - [How to Run](#how-to-run)
  - [Environment Variables](#environment-variables)
  - [API Endpoints](#api-endpoints)
  - [Key Flows in This Codebase](#key-flows-in-this-codebase)
  - [Useful Commands](#useful-commands)

---

## Hexagonal Architecture

**Hexagonal Architecture** . The goal is simple:

> Keep the application core independent from databases, HTTP, message brokers, and other external technologies — so the same business logic can be driven by a REST API, a CLI, a test, or a batch job.

![Hexagonal Architecture — Ports and Adapters](./hexagonal-architecture-external.svg)

At the center sits your **domain + application logic**. Around it, **ports** are the contracts the app defines — what it needs or offers, like `UserRepository` or `CreateUser`. **Adapters** are the concrete implementations that plug into those ports, such as `PostgresqlUserRepository` or `UserController`. **Driving adapters** call into the app from the outside (HTTP controllers, RabbitMQ consumers, cron jobs). **Driven adapters** are called by the app when it talks to the outside world (databases, email, message brokers).

### Core rules

1. **Dependencies point inward** — Infrastructure depends on Application; Application depends on Domain. Never the reverse.
2. **Ports are defined by the application** — The database adapter implements `UserRepository`; the app does not know about SQL or Prisma.
3. **Adapters are interchangeable** — Swap PostgreSQL for an in-memory store in tests without changing domain code.
4. **The framework is outside** — NestJS controllers and modules are adapters; business rules live in the center.

### How this maps to folders

```
Infrastructure/Input   →  Driving adapters   (HTTP controllers, RabbitMQ listeners)
Application            →  Use cases + port interfaces
Domain                 →  Aggregates, value objects, domain events
Infrastructure/Output  →  Driven adapters    (repositories, JWT, email, publishers)
```

---

## Outbox and Inbox Pattern

These patterns solve **reliable messaging** in distributed systems. They are usually explained together because messaging is **at-least-once** — messages can be duplicated, lost, or arrive out of order unless you design for it.

### The problem: dual write

When a service must **update the database** and **publish an event**, doing those as two separate steps is unsafe:

```mermaid
sequenceDiagram
    participant S as Service
    participant DB as Database
    participant MQ as Message Broker

    S->>DB: Save user ✓
    S->>MQ: Publish event ✗ (crash / network failure)
    Note over S,MQ: User exists but event never sent — inconsistent state
```

You cannot rely on distributed two-phase commit (2PC) in most microservice stacks. The **Transactional Outbox** fixes the **send** side; the **Inbox** (or **Idempotent Consumer**) fixes the **receive** side.

---

### Transactional Outbox (reliable publish)

Instead of publishing directly to the broker, the service stores the event in an **outbox table** inside the **same database transaction** as the business write. A separate **message relay** process reads the outbox and publishes to the broker.

![Transactional Outbox Pattern](https://eventuate.io/docs/manual/eventuate/3.0.1/img/transactional-outbox.png)

```mermaid
sequenceDiagram
    participant S as Service
    participant DB as Database
    participant O as Outbox Table
    participant R as Message Relay
    participant MQ as Broker

    S->>DB: BEGIN TRANSACTION
    S->>DB: INSERT business data (User)
    S->>O: INSERT event (NewUserRegistered)
    S->>DB: COMMIT

    loop Polling / CDC
        R->>O: SELECT undispatched events
        R->>MQ: Publish event
        R->>O: Mark as dispatched
    end
```

Three pieces work together here. The **sender** saves the business data and an outbox row in one transaction. The **outbox table** holds events that still need to be published — like a durable to-do list inside the database. A **message relay** reads that table (or watches the database log) and sends events to the broker.

**Guarantees:** Event is published **if and only if** the DB transaction commits. No 2PC required.

**Relay strategies:** A **polling publisher** runs on a schedule and loads rows where `dispatched = false` — that is what this project uses. **Transaction log tailing** instead reads the database change log (Postgres WAL, MySQL binlog) and is another common option ([microservices.io](https://microservices.io/patterns/data/transaction-log-tailing.html)).

---

### Inbox pattern (reliable consume)

The **Inbox** is the mirror of the Outbox on the **consumer** side. Message brokers typically deliver **at-least-once** — the same message may arrive twice after retries or consumer crashes.

The Inbox (also called **Idempotent Consumer**) ensures each message is processed **once**:

1. Receive message with a unique `message_id`
2. In one DB transaction: insert into **inbox table** (dedup) + run business logic
3. If `message_id` already exists → skip processing and acknowledge

```mermaid
flowchart TD
    A[Message received] --> B{message_id in inbox?}
    B -->|Yes| C[Skip — already processed]
    C --> D[ACK broker]
    B -->|No| E[BEGIN TRANSACTION]
    E --> F[INSERT into inbox]
    F --> G[Execute business logic]
    G --> H{Success?}
    H -->|Yes| I[COMMIT]
    I --> D
    H -->|No| J[ROLLBACK — broker redelivers]
```

Further reading: [Every Outbox Needs an Inbox](https://newsletter.systemdesignclassroom.com/p/every-outbox-needs-an-inbox) · [Idempotent Consumer (microservices.io)](https://microservices.io/post/microservices/patterns/2020/10/16/idempotent-consumer.html)

**Outbox** sits on the producer side: it fixes the case where the database commit succeeded but the event never left the service. **Inbox** sits on the consumer side: it fixes the case where the same message gets processed twice. Used together, they give reliable **at-least-once delivery** with **idempotent processing** — a practical middle ground without exactly-once middleware.

> **In this project:** The **User** module implements the **Transactional Outbox**. The **Inbox** pattern is not implemented as a dedicated table; RabbitMQ consumers rely on try/catch and domain uniqueness constraints instead.

---

## CQRS Pattern

**CQRS** (Command Query Responsibility Segregation) separates **operations that change state** (commands) from **operations that read state** (queries).


Command change thing. Query look at thing. Not same. `RegisterCommand` mean "make user." `GetAllQuery` mean "show stuff." Easy read.
Write side use big brain domain (`User`, rules, events). Read side use flat paper (`ProductReadModel`),no heavy rock to carry.
Big tribe later: many read, few write — split path, no fight. 4-
Command check rules before save. Query just fetch, make screen happy.

### Command vs Query

```mermaid
flowchart LR
    subgraph Commands["Commands (write)"]
        C1["RegisterCommand"]
        C2["CreateManyCommand"]
        C3["DeleteAllCommand"]
    end

    subgraph Queries["Queries (read)"]
        Q1["LoginQuery"]
        Q2["GetAllQuery"]
    end

    Commands --> Domain["Domain aggregates + repositories"]
    Queries --> ReadModel["Read models / DTOs"]
```

| Type        | Returns               | Example in NestJS                              |
| ----------- | --------------------- | ---------------------------------------------- |
| **Command** | void or simple result | `CommandBus.execute(new RegisterCommand(...))` |
| **Query**   | Data for the client   | `QueryBus.execute(new GetAllQuery(userId))`    |

In this project, `@nestjs/cqrs` provides `CommandBus` and `QueryBus`. Controllers stay thin — they only translate HTTP into commands/queries and dispatch them to handlers in the application layer.

**Note:** Full CQRS often adds separate read databases (projections). Here we use a **lightweight CQRS** style: same PostgreSQL database, but commands go through domain logic while queries return `ProductReadModel` DTOs instead of aggregates.

---

## This Project

### What Was Built

This application is a skill-demonstration backend with two **bounded contexts**. The **User** context handles registration, email verification, and JWT login. The **Product** context handles CSV import, listing and deleting products, and the async RabbitMQ pipeline. **Common** holds shared pieces: domain primitives, authentication, Prisma setup, and exception handling.

**Patterns applied:** The codebase uses **Hexagonal Architecture** through ports like `UserRepository` and `Publisher`, with adapters for Prisma, HTTP, and RabbitMQ. **DDD** shows up in the `User` and `Product` aggregates, value objects such as `Email` and `Code`, and domain events. **Transactional Outbox** runs on user registration: events land in the `Outbox` table and `OutboxDispatcher` publishes them on a cron. **CQRS** splits writes and reads via `CommandBus` and `QueryBus` in controllers. **Event-driven** flow uses in-process `EventEmitter` for verification email and RabbitMQ for product CSV processing. **JWT auth** protects product routes through `AuthGuard`.

**Tech stack:** NestJS 10 · TypeScript · Prisma 5 · PostgreSQL · RabbitMQ · Argon2 · Swagger

---

### Project Structure

```
src/
├── Common/           # AggregateRoot, Result, AuthGuard, JWT, Prisma
├── User/
│   ├── Domain/       # User aggregate, Email, Password, events
│   ├── Application/  # Register, Login, ConfirmEmail — commands & queries
│   └── Infrastructure/  # UserController, PostgresqlUserRepository, OutboxDispatcher
└── Product/
    ├── Domain/       # Product aggregate, Code, Name, Value
    ├── Application/  # CreateMany, GetAll, DeleteAll
    └── Infrastructure/  # ProductController, RabbitMQ, PostgresqlProductRepository

prisma/schema.prisma  # User, Product, Outbox models
docker-compose.yml    # Postgres + migratedb + backend + RabbitMQ
```

### How to Run


#### 1. Configure environment

```bash
cp example.env .env
```

Edit `.env` if you need different credentials or ports.

#### 2. Start everything with Docker

```bash
docker compose up --build
```

| Service       | URL / Port                             |
| ------------- | -------------------------------------- |
| API           | http://localhost:3000                  |
| Swagger       | http://localhost:3000/api-docs         |
| PostgreSQL    | localhost:`5433` (default from `.env`) |
| RabbitMQ AMQP | localhost:5672                         |
| RabbitMQ UI   | http://localhost:15672                 |

#### 3. Local development (without Docker)

Requires PostgreSQL and RabbitMQ running locally.

```bash
yarn install
cp example.env .env
# Point DATABASE_URL at localhost, e.g.:
# postgresql://POSTGRES:PASSWORD@localhost:5433/assignment?schema=public

npx prisma migrate deploy
npx prisma generate
yarn dev
```

#### 4. Follow logs

```bash
docker compose logs -f backend
```

### API Endpoints

#### Authentication — `/auth`

| Method | Route            | Auth | Description                             |
| ------ | ---------------- | ---- | --------------------------------------- |
| `POST` | `/auth/register` | No   | Register user; starts verification flow |
| `GET`  | `/auth/:token`   | No   | Confirm email via verification token    |
| `POST` | `/auth/login`    | No   | Login; returns JWT                      |

**Register:**

```json
{
	"email": "user@example.com",
	"password": "secret123",
	"confirmPassword": "secret123",
	"name": "John Doe"
}
```

**Login response:**

```json
{ "token": "<JWT>" }
```

#### Products — `/product` (Bearer token required)

| Method   | Route                      | Description                           |
| -------- | -------------------------- | ------------------------------------- |
| `POST`   | `/product`                 | Upload CSV — synchronous import       |
| `GET`    | `/product/getAll`          | List products for current user        |
| `DELETE` | `/product/deleteAll`       | Delete all products for current user  |
| `POST`   | `/product/publishToQueue1` | Upload CSV → RabbitMQ Queue1          |
| `POST`   | `/product/publishToQueue2` | Upload CSV → RabbitMQ Queue2 → Queue3 |

**CSV format** (column names are case-sensitive):

```csv
Code,Name,Value
P001,Widget,100
P002,Gadget,250
```

---
