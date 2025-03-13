// src/app/api/send-notification/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const sendNotificationRequestSchema = z.object({
  notificationId: z.string().max(128),
  title: z.string().max(32),
  body: z.string().max(128),
  targetUrl: z.string().max(256),
  tokens: z.array(z.string()).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const requestJson = await request.json();
    const parsed = sendNotificationRequestSchema.safeParse(requestJson);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.errors }, { status: 400 });
    }
    const payload = parsed.data;
    console.log("Enviando notificación con payload:", payload);

    
    return NextResponse.json({
      result: {
        successTokens: payload.tokens, // o tokens procesados
        invalidTokens: [],
        rateLimitedTokens: [],
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error enviando notificación:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
