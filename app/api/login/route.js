import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { email, password } = await req.json();

  if (
    email === process.env.LOGIN_EMAIL &&
    password === process.env.LOGIN_PASSWORD
  ) {
    // Create JWT
    const token = jwt.sign({ email }, process.env.AUTH_SECRET, {
      expiresIn: "1h",
    });

    const res = NextResponse.json({ message: "Login success" });

    // Set cookie
    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    return res;
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
