import { NextRequest, NextResponse } from "next/server";

const PASSWORD = process.env.LOGIN_PASSWORD ?? "biologielabor168";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password === PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("auth", "1", {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 Tage
    });
    return res;
  }

  return NextResponse.json({ error: "wrong" }, { status: 401 });
}
