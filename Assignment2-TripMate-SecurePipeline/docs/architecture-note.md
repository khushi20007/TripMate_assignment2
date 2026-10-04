# Assignment 2 – 2-Page System Architecture Note

## 1. Data relationships
User 1—* Transaction; User 1—* AuditLog; Transaction 1—* AuditLog; Transaction 1—* EmailEvent. Role definitions are Admin, Member and Guest. Prisma provides the normalized MySQL data layer.

## 2. Authorization flow
Browser request → `proxy.ts` → Better Auth session validation → role gate → protected page/API → server-side `requireSession()` → Prisma query/mutation. The proxy is an early gate; protected handlers and Server Actions validate the session again before database access.

## 3. Transaction and email flow
Authenticated POST `/api/transactions` → Zod validation → Better Auth session check → Prisma `$transaction` → Transaction + AuditLog → React Email → Resend → email event → `/api/resend/webhook` → EmailEvent persistence.

## 4. Assignment evidence
Include screenshots of migration, seed execution, phpMyAdmin persisted records, protected dashboard, denied admin route, transaction API response, transactional email, webhook payload/event row, and the final architecture diagrams.

## 5. Security note
Keep database credentials and API keys in `.env`. Do not commit them. For production Resend webhooks, verify the provider webhook signature before accepting events.
