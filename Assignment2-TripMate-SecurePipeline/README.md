# TripMate – Fullstack Development with NextJS Assignment 2

**Assignment title:** Automated Relational Data Seeding, Transactional Event Notification & Secure Full-Stack Endpoints

## What is implemented
- Part A: Prisma MySQL relational schema; Users, Roles, Transactions, AuditLogs, EmailEvents; Faker.js seed; `npm run db:setup` pipeline.
- Part B: Better Auth + Prisma adapter; auth API route; protected Route Handler and Server Action; Next.js 16 `proxy.ts`; Admin/Member/Guest role checks.
- Part C: React Email template; Resend transactional notification after a Prisma mutation; Resend webhook endpoint; persisted email events.

## Prerequisites
Node.js 20+, XAMPP/MySQL on port 3306. MongoDB is optional for the object-database extension.

## Install
```bash
npm install
copy .env.example .env
```
Create the MySQL database:
```sql
CREATE DATABASE tripmate_assignment2;
```
Fill `.env`.

## Run database pipeline
```bash
npm run db:setup
```
This runs Prisma Client generation, migration and Faker seeding.

## Start
```bash
npm run dev
```
Open `http://localhost:3000`.

## Important setup note for Better Auth
If you change `lib/auth.ts` or the Better Auth plugins/fields, regenerate the Prisma auth schema with:
```bash
npm run auth:generate
```
then run a Prisma migration. The included schema already contains the standard Better Auth tables plus the assignment's domain tables.

## Resend
Set `RESEND_API_KEY` and `RESEND_FROM` in `.env`. The transaction endpoint attempts a React Email notification after the database transaction succeeds.
Webhook endpoint: `POST /api/resend/webhook`.

## Evidence to capture
1. `npm run db:setup` terminal output.
2. phpMyAdmin showing persisted Users/Roles/Transactions/AuditLogs.
3. Authenticated dashboard.
4. Non-admin access to `/admin` resulting in 403/redirect.
5. Protected `/api/transactions` request.
6. Resend email or Resend dashboard event.
7. Webhook request and EmailEvent database row.
8. Architecture diagrams for the 2-page note.
