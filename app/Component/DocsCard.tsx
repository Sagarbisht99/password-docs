"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../Contexts/ThemeContext";
import { FiTrash2, FiEdit2, FiEye, FiMoreVertical, FiShare2 } from "react-icons/fi";
import ShareModal from "./ShareModal";

interface DocsCardProps {
  file: {
    _id: string;
    title: string;
    createdAt: string;
    url: string;
  };
  openDeleteModal: (fileId: string) => void;
  openRenameModal: (fileId: string, currentTitle: string) => void;
}

const DocsCard: React.FC<DocsCardProps> = ({
  file,
  openDeleteModal,
  openRenameModal,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  function getTimeAgo(dateString: string): string {
    const now = new Date();
    const past = new Date(dateString);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000);
    if (diff < 5) return "Just now";
    if (diff < 60) return `${diff} second(s) ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minute(s) ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
    if (diff < 172800) return "Yesterday";
    return `${Math.floor(diff / 86400)} day(s) ago`;
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cardBg = theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-gray-50 border-gray-200";
  const textColor = theme === "dark" ? "text-white" : "text-gray-900";
  const subTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <>
      <div className={`rounded-xl p-4 flex items-center justify-between shadow-md transition-all duration-300 border ${cardBg}`}>
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 ${theme === "dark" ? "bg-zinc-700" : "bg-gray-100"} rounded-md flex items-center justify-center text-xl`}>
            📄
          </div>
          <div>
            <h3 className={`font-medium text-sm sm:text-base ${textColor}`}>{file.title}</h3>
            <p className={`text-xs md:hidden mt-1 ${subTextColor}`}>
              {getTimeAgo(file.createdAt)}
            </p>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <p className={`text-sm ${subTextColor}`}>{getTimeAgo(file.createdAt)}</p>

          <button
            onClick={() => setShareModalOpen(true)}
            className="p-2 rounded-full bg-green-100 dark:bg-green-800 dark:text-white text-green-700 hover:bg-green-200 dark:hover:bg-green-700 transition"
            title="Share"
          >
            <FiShare2 size={20} />
          </button>

          <button
            onClick={() => openRenameModal(file._id, file.title)}
            className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-800 dark:text-white text-indigo-700 hover:bg-indigo-200 dark:hover:bg-indigo-700 transition"
            title="Rename"
          >
            <FiEdit2 size={20} />
          </button>

          <Link
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-white hover:bg-blue-200 dark:hover:bg-blue-700 transition"
            title="View"
          >
            <FiEye size={20} />
          </Link>

          <button
            onClick={() => openDeleteModal(file._id)}
            className="p-2 rounded-full bg-red-100 dark:bg-red-800 text-red-700 dark:text-white hover:bg-red-200 dark:hover:bg-red-700 transition"
            title="Delete"
          >
            <FiTrash2 size={20} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`p-2 rounded-full ${theme === "dark" ? "bg-zinc-700 text-white hover:bg-zinc-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} transition`}
            title="Menu"
          >
            <FiMoreVertical size={20} />
          </button>

          {menuOpen && (
            <div className={`absolute right-0 mt-2 w-36 shadow-lg rounded-md py-1 z-50 ${theme === "dark" ? "bg-zinc-800" : "bg-white"}`}>
              <button
                onClick={() => {
                  setShareModalOpen(true);
                  setMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${theme === "dark" ? "text-gray-100 hover:bg-zinc-700" : "text-gray-800 hover:bg-gray-100"}`}
              >
                Share
              </button>
              <button
                onClick={() => {
                  openRenameModal(file._id, file.title);
                  setMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${theme === "dark" ? "text-gray-100 hover:bg-zinc-700" : "text-gray-800 hover:bg-gray-100"}`}
              >
                Rename
              </button>
              <Link
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block px-4 py-2 text-sm ${theme === "dark" ? "text-gray-100 hover:bg-zinc-700" : "text-gray-800 hover:bg-gray-100"}`}
              >
                View
              </Link>
              <button
                onClick={() => {
                  openDeleteModal(file._id);
                  setMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${theme === "dark" ? "text-red-400 hover:bg-zinc-700" : "text-red-600 hover:bg-red-50"}`}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        fileUrl={file.url}
        fileName={file.title}
      />
    </>
  );
};

export default DocsCard;
