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
  const note = await Note.create({
    text,
    date: new Date(), // 👈 full datetime, not just the date
    done: false,
  });
  return NextResponse.json(note);
}
