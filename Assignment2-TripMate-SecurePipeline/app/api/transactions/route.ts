import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/authorization";
import { resend } from "@/lib/resend";
import { TransactionNotification } from "@/emails/TransactionNotification";

const schema = z.object({
  type: z.enum(["TRIP_BOOKING", "REFUND", "PAYMENT"]),
  amount: z.number().positive(),
  status: z
    .enum(["SUCCESS", "PENDING", "FAILED"])
    .default("SUCCESS"),
});

export async function GET() {
  try {
    const { session } = await requireSession(["admin", "member"]);

    const rows = await prisma.transaction.findMany({
      where:
        session.user.role === "admin"
          ? {}
          : { userId: session.user.id },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(rows);
  } catch (e) {
    const m = e instanceof Error ? e.message : "Unauthorized";

    return NextResponse.json(
      { error: m },
      {
        status: m === "FORBIDDEN" ? 403 : 401,
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { session, role } = await requireSession([
      "admin",
      "member",
    ]);

    const body = schema.parse(await req.json());

    const tx = await prisma.$transaction(async (t) => {
      const created = await t.transaction.create({
        data: {
          id: crypto.randomUUID(),
          userId: session.user.id,
          type: body.type,
          amount: body.amount,
          status: body.status,
          reference: `TXN-${crypto
            .randomUUID()
            .slice(0, 8)
            .toUpperCase()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      await t.auditLog.create({
        data: {
          id: crypto.randomUUID(),
          userId: session.user.id,
          transactionId: created.id,
          action: "TRANSACTION_CREATED",
          details: {
            role,
          },
          createdAt: new Date(),
        },
      });

      return created;
    });

    // Email notification is optional.
    // If RESEND_API_KEY is not configured,
    // the transaction still succeeds.
    let emailStatus = "skipped";

    if (resend && process.env.RESEND_API_KEY && session.user.email) {
      const result = await resend.emails.send({
        from:
          process.env.RESEND_FROM ||
          "TripMate <onboarding@resend.dev>",
        to: [session.user.email],
        subject: `TripMate transaction ${tx.status}`,
        react: TransactionNotification({
          name: session.user.name,
          type: tx.type,
          amount: tx.amount.toString(),
          reference: tx.reference,
          status: tx.status,
        }),
      });

      emailStatus = result.error ? "failed" : "sent";
    }

    return NextResponse.json(
      {
        transaction: tx,
        emailStatus,
      },
      {
        status: 201,
      }
    );
  } catch (e) {
    const m =
      e instanceof z.ZodError
        ? "Invalid transaction payload"
        : e instanceof Error
          ? e.message
          : "Request failed";

    return NextResponse.json(
      { error: m },
      {
        status:
          m === "UNAUTHENTICATED"
            ? 401
            : m === "FORBIDDEN"
              ? 403
              : 400,
      }
    );
  }
}