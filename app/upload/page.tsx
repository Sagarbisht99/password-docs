"use client";

import { useState, useEffect } from "react";
import { useFileUpload } from "../Contexts/UploadContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { UploadCloud } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../Contexts/ThemeContext";

const UploadPage = () => {
  const { uploadFile, uploadLoading, error, clearError } = useFileUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string>("");
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setValidationError("");
    clearError();

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const maxSize = 5 * 1024 * 1024;

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setValidationError(
          "Invalid file type. Allowed types: JPEG, PNG, GIF, PDF, DOC, DOCX"
        );
        setSelectedFile(null);
        return;
      }

      if (file.size > maxSize) {
        setValidationError("File size too large. Maximum size is 5MB");
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadFile(selectedFile);

      if (result.success) {
        toast.success(`File uploaded: ${result.file?.title}`);
        router.push("/Docs");
      } else {
        router.push("/sign-up");
        toast.error(result.error || "Upload failed");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }

    setSelectedFile(null);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-full max-w-md p-8 shadow-2xl rounded-2xl border transition-all duration-300 ${
          theme === "dark"
            ? "bg-zinc-900 border-zinc-700 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          Upload Your File ✨
        </h1>

        <motion.label
          htmlFor="fileUpload"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-sm border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:border-blue-400 transition duration-200"
        >
          <UploadCloud size={36} />
          <span>Drag & Drop or Choose File</span>
          {selectedFile && (
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-300">
              <span className="font-medium">Selected:</span> {selectedFile.name}
            </div>
          )}
          <input
            type="file"
            id="fileUpload"
            onChange={handleFileChange}
            className="hidden"
          />
        </motion.label>

        {validationError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-sm text-red-500 bg-red-100 px-3 py-2 rounded"
          >
            {validationError}
          </motion.p>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-sm text-red-500 bg-red-100 px-3 py-2 rounded"
          >
            {error}
          </motion.p>
        )}

        <motion.button
          whileHover={{ scale: !uploadLoading && selectedFile ? 1.03 : 1 }}
          whileTap={{ scale: !uploadLoading && selectedFile ? 0.97 : 1 }}
          onClick={handleUpload}
          disabled={uploadLoading || !selectedFile}
          className={`w-full mt-6 py-2 rounded-lg text-white font-semibold transition duration-200 ${
            uploadLoading || !selectedFile
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploadLoading ? "Uploading..." : "Upload"}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default UploadPage;