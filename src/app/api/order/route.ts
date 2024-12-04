import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client"; // Adjust the import path based on your folder structure

const supabase = createClient();

// GET method for fetching the current order data from Supabase
export async function GET() {
  try {
    const { data, error } = await supabase.from("pdf_order").select("*");

    if (error) {
      console.error("Error retrieving data from Supabase:", error); // Log the error
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error occurred:", error); // Log the error
    return NextResponse.json(
      { error: "Failed to retrieve the order from Supabase." },
      { status: 500 }
    );
  }
}

// POST method for updating the order data in Supabase
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Loop through each category in the request body to update the Supabase table
    for (const category of Object.keys(body)) {
      const fileOrder = body[category];

      const { error } = await supabase
        .from("pdf_order")
        .update({ file_order: fileOrder })
        .eq("category", category);

      if (error) {
        console.error("Error updating Supabase:", error); // Log the error
        throw error;
      }
    }

    return NextResponse.json({ message: "Order updated successfully." });
  } catch (error) {
    console.error("Unexpected error occurred:", error); // Log the error
    return NextResponse.json(
      { error: "Failed to update the order in Supabase." },
      { status: 500 }
    );
  }
}
