import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    min: 5.99,
    max: 70.99,
  });
}
