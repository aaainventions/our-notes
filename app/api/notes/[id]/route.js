import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Note from "@/models/Note";

export async function PUT(req, { params }) {
  await dbConnect();
  const { text, done } = await req.json();
  const updated = await Note.findByIdAndUpdate(
    params.id,
    { text, done },
    { new: true }
  );
  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  await dbConnect();
  await Note.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Note deleted" });
}
