"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useFileUpload } from "../Contexts/UploadContext";
import Loader from "../Component/Loader";
import DocsCard from "../Component/DocsCard";

const DocsPage = () => {
  const {
    uploadedFiles,
    fetchFiles,
    deleteFile,
    renameFile,
    fetchLoading,
    deleteLoading,
    renameLoading,
  } = useFileUpload();

  // Modal state for delete confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  // Modal state for rename
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");


  useEffect(() => {
    fetchFiles();
  }, []);

  // Function to open the delete modal, passed to DocsCard
  const openDeleteModal = (fileId: string) => {
    setFileToDelete(fileId);
    setDeleteModalOpen(true);
  };

  // Function to confirm delete, calls deleteFile from context
  const confirmDelete = async () => {
    if (fileToDelete) {
      await deleteFile(fileToDelete);
    }
    setDeleteModalOpen(false);
    setFileToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setFileToDelete(null);
  };

  // Function to open the rename modal, passed to DocsCard
  const openRenameModal = (fileId: string, currentTitle: string) => {
    setFileToRename(fileId);
    setNewTitle(currentTitle);
    setRenameModalOpen(true);
  };

  // Function to confirm rename, calls renameFile from context
  const confirmRename = async () => {
    if (fileToRename && newTitle.trim() !== "") {
      await renameFile(fileToRename, newTitle.trim());
    }
    setRenameModalOpen(false);
    setFileToRename(null);
    setNewTitle("");
  };

  const cancelRename = () => {
    setRenameModalOpen(false);
    setFileToRename(null);
    setNewTitle("");
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 relative">
      <h1 className="text-center text-3xl font-semibold my-4">Documents</h1>
      <div className="max-w-5xl mx-auto">
        {fetchLoading ? (
          <Loader />
        ) : uploadedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-lg mb-4">No documents uploaded yet.</p>
            <Link href="/upload">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm">
                Upload your first file
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col mt-3 gap-4">
            {uploadedFiles.map((file) => (
              <DocsCard
                key={file._id}
                file={file}
                openDeleteModal={openDeleteModal}
                openRenameModal={openRenameModal}
              />
            ))}

            {/* Bottom "+" Add Button */}
            <Link
              className="text-center w-full flex items-center justify-center mt-6"
              href="/upload"
            >
              <button className="bg-blue-500 text-white text-3xl h-12 w-12 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                +
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed backdrop-blur-sm inset-0  bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-xl text-black font-semibold mb-4 text-center">
              Confirm Delete
            </h2>
            <p className="text-center text-black mb-6">
              Are you sure you want to delete this file?
            </p>
            <div className="flex justify-center gap-4 items-center">
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-md text-white ${
                  deleteLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {deleteLoading && (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>

              <button
                onClick={cancelDelete}
                disabled={deleteLoading}
                className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {renameModalOpen && (
        <div className="fixed backdrop-blur-sm inset-0 bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-xl text-black font-semibold mb-4 text-center">
              Rename File
            </h2>

            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="border text-black border-gray-300 rounded-md w-full px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              placeholder="Enter new file name"
              disabled={renameLoading}
            />

            <div className="flex justify-center gap-4 items-center">
              <button
                onClick={confirmRename}
                disabled={newTitle.trim() === "" || renameLoading}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-md text-white ${
                  newTitle.trim() === "" || renameLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {renameLoading && (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {renameLoading ? "Renaming..." : "Rename"}
              </button>

              <button
                onClick={cancelRename}
                disabled={renameLoading}
                className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocsPage;
