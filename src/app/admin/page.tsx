"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client"; // Adjust the import path as needed
import { useRouter } from "next/navigation"; // Import useRouter from 'next/navigation'

const AdminPage: React.FC = () => {
  const [pdfFiles, setPdfFiles] = useState<string[]>([]); // List of existing files
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [folder, setFolder] = useState<string>("Alternative Constitution"); // Folder to upload files to
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Track authentication status

  const supabase = createClient();
  const router = useRouter(); // Use the Next.js router for navigation

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setIsAuthenticated(false); // User is not authenticated
        router.push("/login"); // Redirect to the login page if the user is not authenticated
      } else {
        setIsAuthenticated(true); // User is authenticated
      }
    };

    checkUser();
  }, [router, supabase.auth]); // Run the effect once on mount

  // Fetch existing PDF files only if authenticated
  useEffect(() => {
    if (isAuthenticated === null) return; // Don't fetch files until authentication state is determined

    const fetchFiles = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.storage.from("pdf").list(folder);

        if (error) throw error;

        setPdfFiles(data.map((file) => file.name));
      } catch (error) {
        setError(
          "Error fetching files: " +
            (error instanceof Error ? error.message : "")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [folder, isAuthenticated]); // Runs both on mount and when folder changes

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!fileToUpload) return;

    const filePath = `${folder}/${fileToUpload.name}`;
    const { error } = await supabase.storage
      .from("pdf")
      .upload(filePath, fileToUpload);

    if (error) {
      setError(
        "Error uploading file: " + (error instanceof Error ? error.message : "")
      );
    } else {
      // Update the file list after the upload is successful
      setPdfFiles((prevFiles) => [...prevFiles, fileToUpload.name]);
      setFileToUpload(null); // Clear the selected file after upload

      // Reset the file input field
      const inputElement = document.querySelector('input[type="file"]');
      if (inputElement) {
        (inputElement as HTMLInputElement).value = "";
      }

      alert("File Uploaded Successfully!");
    }
  };

  // Handle file deletion
  const handleDelete = async (fileName: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the file: ${fileName}?`
    );

    if (confirmDelete) {
      const { error } = await supabase.storage
        .from("pdf")
        .remove([`${folder}/${fileName}`]);

      if (error) {
        setError(
          "Error deleting file: " +
            (error instanceof Error ? error.message : "")
        );
      } else {
        setPdfFiles((prevFiles) =>
          prevFiles.filter((file) => file !== fileName)
        );
      }
    }
  };

  const handleGoBack = () => {
    router.push("/"); // Redirect to home page
  };

  // Don't render the page until the authentication status is determined
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-t-4 border-indigo-600 border-solid rounded-full animate-spin"></div>
          <span className="text-lg text-gray-800 font-semibold">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null; // Or a placeholder loading state
  }

  return (
    <div className="max-w-7xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg">
      <button
        onClick={handleGoBack}
        className="text-indigo-600 hover:text-indigo-800 text-lg font-semibold mb-6"
      >
        &larr; Go Back
      </button>

      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        Admin Page
      </h1>

      {/* Folder Selection */}
      <div className="mb-6">
        <label
          htmlFor="folder-select"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Select Category:
        </label>
        <select
          id="folder-select"
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="Alternative Constitution">
            Alternative Constitution
          </option>
          <option value="Explanation">Explanation</option>
          <option value="Listen Up">Listen Up</option>
        </select>
      </div>

      {/* File Upload */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex-1 mr-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        <button
          onClick={handleUpload}
          disabled={!fileToUpload}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
        >
          Upload PDF
        </button>
      </div>

      {/* File List */}
      <div className="file-list">
        {loading ? (
          <p className="text-center text-gray-600">Loading files...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : pdfFiles.length > 0 ? (
          <ul className="space-y-4">
            {pdfFiles.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm hover:bg-gray-100"
              >
                <span className="text-lg text-gray-800">{file}</span>
                <button
                  onClick={() => handleDelete(file)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">
            No files found in the folder.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
