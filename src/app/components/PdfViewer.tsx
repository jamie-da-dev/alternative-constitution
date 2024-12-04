import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client"; // Adjust the import according to your project structure
import { SupabaseClient } from "@supabase/supabase-js";

interface PdfViewerProps {
  folder: string;
  fileName: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ folder, fileName }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state

  useEffect(() => {
    const supabase: SupabaseClient = createClient();

    const fetchPdf = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state before fetching new file

        const filePath = `${folder}/${fileName}`;

        // Get public URL for the file
        const { data } = supabase.storage.from("pdf").getPublicUrl(filePath);

        if (data?.publicUrl) {
          setPdfUrl(data.publicUrl); // Set the public URL
        } else {
          setError("No valid public URL found.");
        }
      } catch (error) {
        setError(
          "Error fetching PDF: " + (error instanceof Error ? error.message : "")
        );
      } finally {
        setLoading(false);
      }
    };

    // Fetch PDF whenever the folder or fileName changes
    fetchPdf();
  }, [folder, fileName]); // This hook depends on both folder and fileName

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-white">
        <div className="text-xl font-semibold text-black">Loading...</div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!pdfUrl) {
    return <div>No PDF available</div>;
  }

  return (
    <div className="bg-white">
      <iframe
        src={pdfUrl}
        width="100%"
        height="3000px"
        title="PDF Viewer"
        className="border-0"
      />
    </div>
  );
};

export default PdfViewer;
