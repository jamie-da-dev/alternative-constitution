"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client"; // Adjust the import path as needed
import { useRouter } from "next/navigation";

const AdminPage: React.FC = () => {
  const [pdfFiles, setPdfFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [folder, setFolder] = useState<string>("Alternative Constitution");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setIsAuthenticated(false);
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    };

    checkUser();
  }, [router, supabase.auth]);

  useEffect(() => {
    if (isAuthenticated === null) return;

    const fetchFiles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch file order from Supabase
        const { data: orderData, error: orderError } = await supabase
          .from("pdf_order")
          .select("file_order")
          .eq("category", folder)
          .single();

        if (orderError) throw orderError;

        // Fetch the current files from Supabase storage
        const { data: storageData, error: fetchError } = await supabase.storage
          .from("pdf")
          .list(folder);

        if (fetchError) throw fetchError;

        const currentFiles = storageData.map((file) => file.name);

        // Update order based on current files, adding missing files and removing deleted ones
        let updatedOrder = currentFiles;

        if (orderData?.file_order) {
          const orderedFiles = orderData.file_order.filter((file: string) =>
            currentFiles.includes(file)
          );
          const newFiles = currentFiles.filter(
            (file) => !orderData.file_order.includes(file)
          );
          updatedOrder = [...orderedFiles, ...newFiles];
        }

        setPdfFiles(updatedOrder);
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
  }, [folder, isAuthenticated]);

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
      const updatedFiles = [...pdfFiles, fileToUpload.name];
      setPdfFiles(updatedFiles);
      handleSaveOrder(updatedFiles);
      setFileToUpload(null);

      const inputElement = document.querySelector('input[type="file"]');
      if (inputElement) {
        (inputElement as HTMLInputElement).value = "";
      }

      alert("File Uploaded Successfully!");
    }
  };

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
        const updatedFiles = pdfFiles.filter((file) => file !== fileName);
        setPdfFiles(updatedFiles);
        handleSaveOrder(updatedFiles);
      }
    }
  };

  const handleGoBack = () => {
    router.push("/");
  };

  const handleDragStart =
    (index: number) => (event: React.DragEvent<HTMLLIElement>) => {
      event.dataTransfer.setData("text/plain", index.toString());
    };

  const handleDragOver = (event: React.DragEvent<HTMLLIElement>) => {
    event.preventDefault();
  };

  const handleDrop =
    (index: number) => (event: React.DragEvent<HTMLLIElement>) => {
      event.preventDefault();
      const draggedIndex = parseInt(
        event.dataTransfer.getData("text/plain"),
        10
      );

      if (draggedIndex !== index) {
        const updatedFiles = [...pdfFiles];
        const [movedFile] = updatedFiles.splice(draggedIndex, 1);
        updatedFiles.splice(index, 0, movedFile);
        setPdfFiles(updatedFiles);
      }
    };

  const handleSaveOrder = async (updatedFiles: string[] = pdfFiles) => {
    try {
      // Update the file order in Supabase for the selected category
      const { error } = await supabase
        .from("pdf_order")
        .update({ file_order: updatedFiles })
        .eq("category", folder);

      if (error) throw error;

      alert("File order saved successfully!");
    } catch (error) {
      setError(
        "Error saving file order: " +
          (error instanceof Error ? error.message : "")
      );
    }
  };

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
    return null;
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

      <div className="file-list">
        {loading ? (
          <p className="text-center text-gray-600">Loading files...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : pdfFiles.length > 0 ? (
          <>
            <ul className="space-y-4">
              {pdfFiles.map((file, index) => (
                <li
                  key={file}
                  className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200"
                  draggable
                  onDragStart={handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop(index)}
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
            <button
              onClick={() => handleSaveOrder()}
              className="mt-6 px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
            >
              Save Order
            </button>
          </>
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
