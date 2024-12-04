import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const orderFilePath = path.join(process.cwd(), "src", "app", "order.json");

export async function GET() {
  try {
    const data = fs.readFileSync(orderFilePath, "utf-8");
    const json = JSON.parse(data);
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read order file." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Read existing data from the JSON file
    let existingData;
    try {
      const data = fs.readFileSync(orderFilePath, "utf-8");
      existingData = JSON.parse(data);
    } catch (readError) {
      return NextResponse.json(
        { error: "Failed to read existing order file." },
        { status: 500 }
      );
    }

    // Merge the existing data with the new data from the request
    const updatedData = { ...existingData, ...body };

    // Write the merged data back to the file
    fs.writeFileSync(orderFilePath, JSON.stringify(updatedData, null, 2));

    return NextResponse.json({ message: "Order updated successfully." });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to write to order file." },
      { status: 500 }
    );
  }
}
