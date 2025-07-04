"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaExternalLinkAlt } from "react-icons/fa";
import { FiCopy, FiCheck } from "react-icons/fi";
import { useForm } from "../Contexts/FormContext";
import { toast } from "react-toastify";

interface PasswordData {
  _id: string;
  url: string;
  username: string;
  userId: string;
  password: string;
}

interface PasswordCardProps {
  item: PasswordData;
}

const PasswordCard: React.FC<PasswordCardProps> = ({ item }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { deleteHandler, isDeleting } = useForm();

  useEffect(() => {
    document.body.style.overflow = showConfirm ? "hidden" : "";
  }, [showConfirm]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleUrlClick = () => {
    let url = item.url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    window.open(url, "_blank", "noopener,noreferrer");
    toast.info("🔗 Opening URL in new tab", {
      position: "top-right",
      autoClose: 3000,
      style: {
        background: "#1f1f1f",
        color: "#fff",
        border: "1px solid #333",
        borderRadius: "0.75rem",
      },
    });
  };

  const handleCopy = (field: string) => {
    try {
      if (field === "password") {
        navigator.clipboard.writeText(item.password);
      } else if (field === "username") {
        navigator.clipboard.writeText(item.username);
      }
      setCopiedField(field);
      setTimeout(() => {
        setCopiedField(null);
      }, 800);
    } catch {
      toast.error("Failed to copy to clipboard", {
        position: "top-right",
        autoClose: 3000,
        style: {
          background: "#1f1f1f",
          color: "#fff",
          border: "1px solid #333",
          borderRadius: "0.75rem",
        },
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHandler(id);
      toast.error("🗑️ Password deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        style: {
          background: "#1f1f1f",
          color: "#fff",
          border: "1px solid #333",
          borderRadius: "0.75rem",
        },
      });
    } catch (err) {
      toast.error("❌ Failed to delete password", {
        position: "top-right",
        autoClose: 3000,
        style: {
          background: "#1f1f1f",
          color: "#fff",
          border: "1px solid #333",
          borderRadius: "0.75rem",
        },
      });
      console.error(err);
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-6 flex flex-col justify-between h-full">
        <div className="space-y-4">
          {/* URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">🔗 URL</label>
            <div className="relative">
              <input
                type="text"
                value={item.url}
                disabled
                className="w-full border border-[#444] rounded-md px-3 py-2 pr-10"
              />
              <button
                type="button"
                onClick={handleUrlClick}
                className="absolute inset-y-0 right-3 flex items-center hover:text-white"
                title="Open URL in new tab"
              >
                <FaExternalLinkAlt size={14} />
              </button>
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold ">👤 Username</label>
            <div className="relative">
              <input
                type="text"
                value={item.username}
                disabled
                className="w-full text-sm border border-[#444] rounded-md px-3 py-2 pr-10"
              />
              <button
                type="button"
                onClick={() => handleCopy("username")}
                className="absolute inset-y-0 right-3 flex items-center "
                title="Copy username to clipboard"
              >
                {copiedField === "username" ? (
                  <FiCheck size={16} className="text-green-500" />
                ) : (
                  <FiCopy size={16} />
                )}
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">🔒 Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={showPassword ? item.password : "••••••••"}
                disabled
                className="w-full text-sm  border border-[#444] rounded-md px-3 py-2 pr-20"
              />
              <div className="absolute inset-y-0 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy("password")}
                  className=""
                  title="Copy password to clipboard"
                >
                  {copiedField === "password" ? (
                    <FiCheck size={16} className="text-green-500" />
                  ) : (
                    <FiCopy size={16} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className=""
                >
                  {showPassword ? (
                    <FaEyeSlash size={16} />
                  ) : (
                    <FaEye size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#333]">
          <Link href={`/form?id=${item._id}`}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-md transition-all">
              ✏️ Edit
            </button>
          </Link>
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-md transition-all disabled:opacity-50"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1f1f1f] text-white rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-300 mb-6 text-center">
              This action will permanently delete this password.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 rounded-md disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
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
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordCard;
