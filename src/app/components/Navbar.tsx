// Adjusted code to implement responsive Navbar visibility on mobile
"use client";

import React, { useState, useEffect } from "react";
import PdfViewer from "./PdfViewer";
import { createClient } from "@/utils/supabase/client"; // Adjust the import as needed
import { SupabaseClient } from "@supabase/supabase-js";

const Navbar: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<string>(""); // Store the selected file name
  const [selectedIndex, setSelectedIndex] = useState<number>(-1); // Start with -1 to indicate no item is selected
  const [alternativeConstitutionFiles, setAlternativeConstitutionFiles] =
    useState<string[]>([]);
  const [explanationFiles, setExplanationFiles] = useState<string[]>([]);
  const [listenUpFiles, setListenUpFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state
  const [showPdf, setShowPdf] = useState<boolean>(false); // Track whether to show the PDF viewer
  const [isNavbarVisible, setIsNavbarVisible] = useState<boolean>(false); // Track Navbar visibility

  const supabase: SupabaseClient = createClient();

  useEffect(() => {
    const fetchFolderFiles = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state before fetching

        // Fetch file orders from Supabase
        const { data: orderData, error: orderError } = await supabase
          .from("pdf_order")
          .select("category, file_order");

        if (orderError) {
          setError(orderError.message);
          return;
        }

        // Fetch files from 'Alternative Constitution', 'Explanation', and 'Listen Up' folders
        const alternativeConstitution = supabase.storage
          .from("pdf")
          .list("Alternative Constitution");
        const explanation = supabase.storage.from("pdf").list("Explanation");
        const listenUp = supabase.storage.from("pdf").list("Listen Up");

        const [altData, expData, listenUpData] = await Promise.all([
          alternativeConstitution,
          explanation,
          listenUp,
        ]);

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

        if (altData.data && expData.data && listenUpData.data && orderData) {
          const getOrderForCategory = (category: string) =>
            orderData.find((item) => item.category === category)?.file_order ||
            [];

          // Sort and set files based on order data from the Supabase table
          setAlternativeConstitutionFiles(
            getOrderForCategory("Alternative Constitution").length
              ? getOrderForCategory("Alternative Constitution")
              : altData.data.map((file) => file.name)
          );

          setExplanationFiles(
            getOrderForCategory("Explanation").length
              ? getOrderForCategory("Explanation")
              : expData.data.map((file) => file.name)
          );

          setListenUpFiles(
            getOrderForCategory("Listen Up").length
              ? getOrderForCategory("Listen Up")
              : listenUpData.data.map((file) => file.name)
          );
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

  const handleButtonClick = async (
    category: string,
    index: number,
    fileName: string
  ) => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Kindle|Silk|PlayBook|BB10|Mobile|Tablet|Touch|Macintosh/i.test(
        navigator.userAgent
      ) && "ontouchend" in document;

    const { data: publicUrlData } = supabase.storage
      .from("pdf")
      .getPublicUrl(`${category}/${fileName}`);

    const fileUrl = publicUrlData.publicUrl;

    if (isMobile) {
      // Trigger download on mobile
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName; // Suggested filename for download
      link.target = "_blank"; // Open in a new tab as a fallback
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsNavbarVisible(false);
    } else {
      // Show PDF in viewer for non-mobile
      setSelectedCategory(category);
      setSelectedIndex(index);
      setSelectedFile(fileName); // Set the selected file name
      setShowPdf(true); // Show PDF viewer when a file is selected
      setIsNavbarVisible(false); // Close Navbar when PDF is opened
      document.querySelector("aside")?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleClosePdf = () => {
    setShowPdf(false); // Hide PDF viewer when the X button is clicked
    setSelectedIndex(-1); // Reset selected index when PDF is closed
    setSelectedFile(""); // Reset selected file
  };

  // Helper function to get button class for both text and indicator
  const getButtonClass = (category: string, index: number) => {
    if (selectedCategory === category && selectedIndex === index) {
      return "text-blue-400"; // Highlight color when selected
    }
    return "text-white"; // Default color
  };

  // Helper function to get indicator class for the selection state
  const getIndicatorClass = (category: string, index: number) => {
    if (selectedCategory === category && selectedIndex === index) {
      return "bg-red-500"; // Change to red when selected
    }
    return "bg-blue-500 group-hover:bg-blue-700 transition-colors"; // Default blue color with hover
  };

  return (
    <div className="fixed flex h-screen">
      {/* Menu Icon for Mobile */}
      <div
        className={`absolute top-[18px] left-0 h-12 w-6 bg-blue-600 flex items-center justify-center cursor-pointer ${
          isNavbarVisible ? "invisible" : "visible"
        }`}
        onClick={() => setIsNavbarVisible(!isNavbarVisible)}
      >
        <span className="text-white text-xl font-bold">{">"}</span>
      </div>

      {/* Left Navbar */}
      <aside
        className={`bg-gray-800 text-white p-4 overflow-y-auto transition-transform duration-300 transform lg:translate-x-0 ${
          isNavbarVisible
            ? "w-[100vw] h-[100vh] translate-x-0"
            : "-translate-x-full"
        } lg:max-h-screen lg:w-[320px] lg:w-[400px] xl:w-[500px] lg:static fixed z-40`}
        style={{
          maxWidth: "100vw",
          maxHeight: "100vh",
        }}
      >
        <nav className="space-y-12 p-4">
          {/* Home Button */}
          <div className="mt-4">
            <button
              className="flex items-center space-x-2 group"
              onClick={() => {
                handleClosePdf();
                setShowPdf(false); // Ensure the PDF is closed
                window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
                setIsNavbarVisible(false); // Close Navbar after selection
              }}
            >
              {/* Indicator */}
              <div
                className="w-4 h-4 rounded-full bg-blue-500 group-hover:bg-blue-700 transition-colors"
                aria-label="Home Indicator"
              />
              {/* Home Text */}
              <span className="font-semibold text-xl lg:text-2xl text-white group-hover:text-blue-400 transition-colors">
                Home
              </span>
            </button>
          </div>

          {/* Alternative Constitution Section */}
          <div>
            <h3 className="font-semibold text-xl lg:text-2xl mb-4">
              Alternative Constitution
            </h3>
            <ul className="pl-6 space-y-4">
              {loading ? (
                <li>Loading...</li>
              ) : error ? (
                <li>Error: {error}</li>
              ) : (
                alternativeConstitutionFiles.map((file, index) => {
                  const fileNameWithoutPdf = file.replace(/\.pdf$/, "");

                  return (
                    <li key={index} className="flex items-center group">
                      {/* Indicator/Button to the left of the PDF name */}
                      <button
                        className={`pr-4 w-4 h-4 rounded-full ${getIndicatorClass(
                          "Alternative Constitution",
                          index
                        )}`}
                        aria-label={`Select ${fileNameWithoutPdf}`}
                        onClick={() =>
                          handleButtonClick(
                            "Alternative Constitution",
                            index,
                            file
                          )
                        }
                      />
                      <button
                        className={`pl-4 text-left text-lg xl:text-xl group-hover:text-blue-400 transition-colors ${getButtonClass(
                          "Alternative Constitution",
                          index
                        )}`}
                        onClick={() =>
                          handleButtonClick(
                            "Alternative Constitution",
                            index,
                            file
                          )
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

          {/* Explanation Section */}
          <div>
            <h3 className="font-semibold text-xl lg:text-2xl mb-4">
              Explanation
            </h3>
            <ul className="pl-6 space-y-4">
              {loading ? (
                <li>Loading...</li>
              ) : error ? (
                <li>Error: {error}</li>
              ) : (
                explanationFiles.map((file, index) => {
                  const fileNameWithoutPdf = file.replace(/\.pdf$/, "");

                  return (
                    <li key={index} className="flex items-center group">
                      {/* Indicator/Button to the left of the PDF name */}
                      <button
                        className={`pr-4 w-4 h-4 rounded-full ${getIndicatorClass(
                          "Explanation",
                          index
                        )}`}
                        aria-label={`Select ${fileNameWithoutPdf}`}
                        onClick={() =>
                          handleButtonClick("Explanation", index, file)
                        }
                      />
                      <button
                        className={`pl-4 text-left text-lg xl:text-xl group-hover:text-blue-400 transition-colors ${getButtonClass(
                          "Explanation",
                          index
                        )}`}
                        onClick={() =>
                          handleButtonClick("Explanation", index, file)
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

          {/* Listen Up Section */}
          <div>
            <h3 className="font-semibold text-xl lg:text-2xl mb-4">
              Listen Up
            </h3>
            <ul className="pl-6 space-y-4">
              {loading ? (
                <li>Loading...</li>
              ) : error ? (
                <li>Error: {error}</li>
              ) : (
                listenUpFiles.map((file, index) => {
                  const fileNameWithoutPdf = file.replace(/\.pdf$/, "");

                  return (
                    <li key={index} className="flex items-center group">
                      {/* Indicator/Button to the left of the PDF name */}
                      <button
                        className={`pr-4 w-4 h-4 rounded-full ${getIndicatorClass(
                          "Listen Up",
                          index
                        )}`}
                        aria-label={`Select ${fileNameWithoutPdf}`}
                        onClick={() =>
                          handleButtonClick("Listen Up", index, file)
                        }
                      />
                      <button
                        className={`pl-4 text-left text-lg xl:text-xl group-hover:text-blue-400 transition-colors ${getButtonClass(
                          "Listen Up",
                          index
                        )}`}
                        onClick={() =>
                          handleButtonClick("Listen Up", index, file)
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
        </nav>
      </aside>

      {/* Main Content Area */}
      {showPdf && selectedCategory && (
        <main className="flex-1 h-[100vh] w-[100vw] lg:w-[calc(100vw-400px)] xl:w-[calc(100vw-500px)]">
          <div>
            <button
              className="absolute top-2 right-8 text-red-500 hover:text-red-700 text-lg transition-colors"
              onClick={handleClosePdf}
            >
              X (Close)
            </button>
            <PdfViewer folder={selectedCategory} fileName={selectedFile} />
          </div>
        </main>
      )}
    </div>
  );
};

export default Navbar;
