import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Note from "@/models/Note";

export async function PUT(req, { params }) {
  await dbConnect();
  const { done, doneBy } = await req.json();

  const updated = await Note.findByIdAndUpdate(
    params.id,
    { done, doneBy: done ? doneBy : "" }, // if undone, clear it
    { new: true }
  );

  return NextResponse.json(updated);
}


export async function DELETE(req, { params }) {
  await dbConnect();
  await Note.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Note deleted" });
}
