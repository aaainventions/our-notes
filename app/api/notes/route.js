import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Note from "@/models/Note";

export async function GET() {
  await dbConnect();
  const notes = await Note.find();
  return NextResponse.json(notes);
}

export async function POST(req) {
  await dbConnect();
  const { text } = await req.json();
  const today = new Date().toLocaleDateString();
  const note = await Note.create({ text, date: today, done: false });
  return NextResponse.json(note);
}
