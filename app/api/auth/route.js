import { NextResponse } from "next/server";

export async function POST(req) {
  const { username, password } = await req.json();

  if (
    username === process.env.AUTH_USER &&
    password === process.env.AUTH_PASS
  ) {
    // Login successful → set a simple cookie
    const res = NextResponse.json({ message: "Login successful" });
    res.cookies.set("loggedIn", "true", { httpOnly: true, path: "/" });
    return res;
  }

  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
}
