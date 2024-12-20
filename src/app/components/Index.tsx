"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const Index: React.FC = () => {
  const [pdfLink, setPdfLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // State to track loading

  const supabase = createClient();

  useEffect(() => {
    const fetchAndExtractPdf = async () => {
      try {
        const folder = "Index";

        const { data: files, error: listError } = await supabase.storage
          .from("pdf")
          .list(folder);

        if (listError) {
          throw new Error(`Error listing files: ${listError.message}`);
        }

        if (!files || files.length === 0) {
          setPdfLink(null); // No PDF files available
          setIsLoading(false);
          return;
        }

        const pdfFileName = files[0].name;

        const { data: pdfBlob } = await supabase.storage
          .from("pdf")
          .getPublicUrl(`${folder}/${pdfFileName}`);

        if (!pdfBlob?.publicUrl) {
          throw new Error("Failed to generate public URL for the PDF.");
        }

        setPdfLink(pdfBlob.publicUrl); // Set the public URL for the PDF
      } catch (err) {
        console.error("Error fetching or parsing PDF:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchAndExtractPdf();
  }, [supabase]);

  return (
    <main className="flex-1 p-2 min-h-screen ml-[0px] lg:ml-[400px] xl:ml-[515px]">
      <header className="bg-gray-800 text-white p-4 rounded-md shadow-md mb-2">
        <h1 className="text-3xl font-bold text-center">
          Alternative Constitution
        </h1>
      </header>
      <div className="bg-white w-full h-full flex items-center justify-center">
        {isLoading ? (
          <p className="text-lg text-center">Loading Index...</p>
        ) : error ? (
          <p className="text-red-600 text-lg text-center">{error}</p>
        ) : pdfLink ? (
          <iframe
            src={`${pdfLink}#toolbar=0`}
            width="100%"
            height="100%"
            title="PDF Viewer"
            className="index border-0 h-full"
          />
        ) : (
          <p className="text-lg text-center">No Index Content Available.</p>
        )}
      </div>
    </main>
  );
};

export default Index;
