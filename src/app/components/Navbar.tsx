"use client";

import React, { useState, useEffect } from "react";
import PdfViewer from "./PdfViewer";
import { createClient } from "@/utils/supabase/client"; // Adjust the import as needed
import { SupabaseClient } from "@supabase/supabase-js";

const Navbar: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(-1); // Start with -1 to indicate no item is selected
  const [alternativeConstitutionFiles, setAlternativeConstitutionFiles] =
    useState<string[]>([]);
  const [explanationFiles, setExplanationFiles] = useState<string[]>([]);
  const [listenUpFiles, setListenUpFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state
  const [showPdf, setShowPdf] = useState<boolean>(false); // Track whether to show the PDF viewer

  const supabase: SupabaseClient = createClient();

  useEffect(() => {
    // Fetch the list of files from the 'listen-up' folder in Supabase storage
    const fetchFolderFiles = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state before fetching

        // Fetch files from 'Alternative Constitution', 'Explanation', and 'Listen Up' folders
        const alternativeConstitution = supabase.storage
          .from("pdf")
          .list("Alternative Constitution");
        const explanation = supabase.storage.from("pdf").list("Explanation");
        const listenUp = supabase.storage.from("pdf").list("Listen Up");
        // Wait for all the file fetches to complete
        const [altData, expData, listenUpData] = await Promise.all([
          alternativeConstitution,
          explanation,
          listenUp,
        ]);

        // Handle the responses
        if (altData.error) {
          setError(altData.error.message);
          return;
        }

        if (expData.error) {
          setError(expData.error.message);
          return;
        }

        if (listenUpData.error) {
          setError(listenUpData.error.message);
          return;
        }

        if (altData.data && expData.data && listenUpData.data) {
          // Set the file names to the corresponding state variables
          setAlternativeConstitutionFiles(
            altData.data.map((file) => file.name)
          );
          setExplanationFiles(expData.data.map((file) => file.name));
          setListenUpFiles(listenUpData.data.map((file) => file.name));
        } else {
          setError("No files found in the specified folders.");
        }
      } catch (error) {
        setError(
          "Error fetching files: " +
            (error instanceof Error ? error.message : "")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFolderFiles();
  }, []); // Only run once when component mounts

  const handleButtonClick = (category: string, index: number) => {
    setSelectedCategory(category);
    setSelectedIndex(index);
    setShowPdf(true); // Show PDF viewer when a file is selected
  };

  const handleClosePdf = () => {
    setShowPdf(false); // Hide PDF viewer when the X button is clicked
    setSelectedIndex(-1); // Reset selected index when PDF is closed
  };

  // Helper function to add conditional class for highlighting selected item
  const getButtonClass = (category: string, index: number) => {
    if (selectedCategory === category && selectedIndex === index) {
      return "text-blue-400"; // Highlight color when selected
    }
    return "text-white"; // Default color
  };

  return (
    <div className="fixed flex h-screen">
      {/* Left Navbar */}
      <aside className="w-[500px] bg-gray-800 text-white p-4">
        <nav className="space-y-12 p-4">
          <div>
            <h3 className="font-semibold text-2xl mb-4">
              Alternative Constitution
            </h3>
            <ul className="pl-6 space-y-4">
              {loading ? (
                <li>Loading...</li>
              ) : error ? (
                <li>Error: {error}</li>
              ) : (
                alternativeConstitutionFiles.map((file, index) => {
                  // Remove .pdf from the file name
                  const fileNameWithoutPdf = file.replace(/\.pdf$/, "");

                  return (
                    <li key={index}>
                      <button
                        className={`text-left ${getButtonClass(
                          "Alternative Constitution",
                          index
                        )}`}
                        onClick={() =>
                          handleButtonClick("Alternative Constitution", index)
                        }
                      >
                        {fileNameWithoutPdf}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-2xl mb-4">Explanation</h3>
            <ul className="pl-6 space-y-4">
              {loading ? (
                <li>Loading...</li>
              ) : error ? (
                <li>Error: {error}</li>
              ) : (
                explanationFiles.map((file, index) => {
                  // Remove .pdf from the file name
                  const fileNameWithoutPdf = file.replace(/\.pdf$/, "");

                  return (
                    <li key={index}>
                      <button
                        className={`text-left ${getButtonClass(
                          "Explanation",
                          index
                        )}`}
                        onClick={() => handleButtonClick("Explanation", index)}
                      >
                        {fileNameWithoutPdf}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-2xl mb-4">Listen Up</h3>
            <ul className="pl-6 space-y-4">
              {loading ? (
                <li>Loading...</li>
              ) : error ? (
                <li>Error: {error}</li>
              ) : (
                listenUpFiles.map((file, index) => {
                  // Remove .pdf from the file name
                  const fileNameWithoutPdf = file.replace(/\.pdf$/, "");

                  return (
                    <li key={index}>
                      <button
                        className={`text-left ${getButtonClass(
                          "Listen Up",
                          index
                        )}`}
                        onClick={() => handleButtonClick("Listen Up", index)}
                      >
                        {fileNameWithoutPdf}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </nav>
      </aside>
      {/* Main Content Area */}
      {showPdf && selectedCategory && (
        <main className="flex-1 w-[calc(100vw-500px)] h-[100vh]">
          <div>
            <button
              className="absolute top-2 right-8 text-black text-lg"
              onClick={handleClosePdf}
            >
              X (Close)
            </button>
            <PdfViewer folder={selectedCategory} index={selectedIndex} />
          </div>
        </main>
      )}
    </div>
  );
};

export default Navbar;
