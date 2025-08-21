// app/api/login/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { email, password } = await req.json();

  const users = [
    {
      email: process.env.USER1_EMAIL,
      password: process.env.USER1_PASSWORD,
      name: process.env.USER1_NAME,
    },
    {
      email: process.env.USER2_EMAIL,
      password: process.env.USER2_PASSWORD,
      name: process.env.USER2_NAME,
    },
    {
      email: process.env.USER3_EMAIL,
      password: process.env.USER3_PASSWORD,
      name: process.env.USER3_NAME,
    },
  ];

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // ✅ Sign JWT
  const token = jwt.sign(
    { email: user.email, name: user.name },
    process.env.AUTH_SECRET,
    { expiresIn: "1h" }
  );

  // ✅ Set cookie
  const res = NextResponse.json({ success: true, email: user.email, name: user.name });
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/", // must cover all routes
    maxAge: 60 * 60, // 1 hour
  });

  return res;
}
