import clientPromise from "@/lib/dbConnection";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// GET all items
export async function GET() {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = db.collection("zahidcollection");

  const data = await collection.find({}).toArray();
  return NextResponse.json(data);
}

// POST a new item
export async function POST(req) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = db.collection("zahidcollection");

  const { name, age } = await req.json();
  const result = await collection.insertOne({ name, age });

  return NextResponse.json({ _id: result.insertedId });
}

// DELETE an item
export async function DELETE(req) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = db.collection("zahidcollection");

  const { id } = await req.json();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ success: result.deletedCount === 1 });
}
