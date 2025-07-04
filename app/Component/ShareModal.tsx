import React, { useState } from "react";
import { FiCopy, FiX, FiCheck, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fileUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: <FiCheck className="text-green-500" />,
        style: {
          background: "white",
          color: "#1f2937",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          borderRadius: "0.5rem",
          padding: "1rem",
        },
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.log(error);

      toast.error("Failed to copy link", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: <FiAlertCircle className="text-red-500" />,
        style: {
          background: "white",
          color: "#1f2937",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          borderRadius: "0.5rem",
          padding: "1rem",
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Share Document
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Share this document:
          </p>
          <p className="font-medium text-gray-900 dark:text-white mb-1">
            {fileName}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            value={fileUrl}
            readOnly
            className="flex-1 p-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-white text-sm"
          />
          <button
            onClick={handleCopy}
            className={`p-2 rounded-md transition-colors ${
              copied
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
            }`}
            title="Copy link"
          >
            <FiCopy size={20} />
          </button>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Anyone with the link can view this document.</p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
