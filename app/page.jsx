import NotesPageClient from "./NotesPageClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default function NotesPage() {
  const token = cookies().get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    jwt.verify(token, process.env.AUTH_SECRET);
  } catch (err) {
    redirect("/login");
  }

  return <NotesPageClient />;
}
