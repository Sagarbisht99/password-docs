"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface UploadedFile {
  _id: string;
  url: string;
  title: string;
  fileId: string;
  createdAt: string;
}

interface FileUploadContextType {
  uploadedFiles: UploadedFile[];
  uploadFile: (
    file: File
  ) => Promise<{ success: boolean; file?: UploadedFile; error?: string }>;
  deleteFile: (fileId: string) => Promise<{ success: boolean; error?: string }>;
  renameFile: (
    fileId: string,
    newTitle: string
  ) => Promise<{ success: boolean; error?: string }>;
  fetchFiles: () => Promise<void>;
  clearError: () => void;
  clearContext: () => void;
  uploadLoading: boolean;
  deleteLoading: boolean;
  fetchLoading: boolean;
  renameLoading: boolean;
  error: string | null;
}

const FileUploadContext = createContext<FileUploadContextType | null>(null);

interface FileUploadProviderProps {
  children: ReactNode;
}

export const FileUploadProvider: React.FC<FileUploadProviderProps> = ({
  children,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const clearContext = () => {
    setUploadedFiles([]);
    setError(null);
    setUploadLoading(false);
    setDeleteLoading(false);
    setFetchLoading(false);
    setRenameLoading(false);
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadLoading(true);
      setError(null);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "Upload failed",
        }));
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();
      if (result.success) {
        setUploadedFiles((prev) => [...prev, result.data]);
        return { success: true, file: result.data };
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setError(errorMessage);
      console.error("Error uploading file:", error);
      return { success: false, error: errorMessage };
    } finally {
      setUploadLoading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      setDeleteLoading(true);
      setError(null);

      const response = await fetch(`/api/upload?id=${fileId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUploadedFiles((prev) => prev.filter((file) => file._id !== fileId));
        return { success: true };
      } else {
        throw new Error(result.error || "Delete failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Delete failed";
      setError(errorMessage);
      console.error("Error deleting file:", error);
      return { success: false, error: errorMessage };
    } finally {
      setDeleteLoading(false);
    }
  };

  const fetchFiles = useCallback(async () => {
    try {
      setFetchLoading(true);
      setError(null);

      const response = await fetch("/api/upload");

      const result = await response.json();

      if (response.ok && result.success) {
        setUploadedFiles(result.data);
      } else {
        throw new Error(result.error || "Fetch failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Fetch failed";
      setError(errorMessage);
      console.error("Error fetching files:", error);
    } finally {
      setFetchLoading(false);
    }
  }, []);

  const renameFile = async (
    fileId: string,
    newTitle: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setRenameLoading(true);
      setError(null);

      const response = await fetch("/api/upload", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileId, newTitle }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file._id === fileId ? { ...file, title: newTitle } : file
          )
        );
        return { success: true };
      } else {
        throw new Error(result.error || "Rename failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Rename failed";
      setError(errorMessage);
      console.error("Error renaming file:", error);
      return { success: false, error: errorMessage };
    } finally {
      setRenameLoading(false);
    }
  };

  return (
    <FileUploadContext.Provider
      value={{
        uploadedFiles,
        uploadFile,
        deleteFile,
        renameFile,
        fetchFiles,
        clearError,
        clearContext,
        uploadLoading,
        deleteLoading,
        fetchLoading,
        renameLoading,
        error,
      }}
    >
      {children}
    </FileUploadContext.Provider>
  );
};

export const useFileUpload = (): FileUploadContextType => {
  const context = useContext(FileUploadContext);
  if (!context) {
    throw new Error("useFileUpload must be used within a FileUploadProvider");
  }
  return context;
};
