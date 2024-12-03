import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client"; // Adjust the import according to your project structure
import { SupabaseClient } from "@supabase/supabase-js";

interface PdfViewerProps {
  folder: string;
  index: number;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ folder, index }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state

  useEffect(() => {
    const supabase: SupabaseClient = createClient();

    const fetchPdf = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state before fetching new file

        // List all files in the specified folder in Supabase Storage
        const { data, error: listError } = await supabase.storage
          .from("pdf") // Bucket name
          .list(folder); // Folder path, e.g., 'alternative-constitution'

        if (listError) {
          setError(listError.message);
          return;
        }

        // If files are available in the folder
        if (data?.length > 0) {
          // Ensure the index is within the bounds of available files
          const file = data[index];
          if (file) {
            const filePath = `${folder}/${file.name}`;

            // Get public URL for the file
            const { data: publicUrlData } = supabase.storage
              .from("pdf")
              .getPublicUrl(filePath);

            if (publicUrlData?.publicUrl) {
              setPdfUrl(publicUrlData.publicUrl); // Set the public URL
            } else {
              setError("No valid public URL found.");
            }
          } else {
            setError("No file found at the selected index.");
          }
        } else {
          setError("No PDF files found in the folder.");
        }
      } catch (error) {
        setError(
          "Error fetching PDF: " + (error instanceof Error ? error.message : "")
        );
      } finally {
        setLoading(false);
      }
    };

    // Fetch PDF whenever the folder or index changes
    fetchPdf();
  }, [folder, index]); // This hook depends on both folder and index

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
