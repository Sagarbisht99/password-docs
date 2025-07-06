"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ChangeEvent,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

interface FormData {
  url: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface PasswordData {
  _id: string;
  url: string;
  username: string;
  userId: string;
  password: string;
}

interface FormContextType {
  formData: FormData;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  resetForm: () => void;
  error: string | null;
  setError: (msg: string) => void;
  clearError: () => void;
  submitHandler: () => Promise<void>;
  fetchPasswords: () => Promise<void>;
  passwords: PasswordData[];
  deleteHandler: (id: string) => Promise<void>;
  isEditMode: boolean;
  setEditMode: (mode: boolean) => void;
  editPassword: (password: PasswordData) => void;
  updateHandler: () => Promise<void>;
  isLoading: boolean;
  isSubmitting: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isEditMode, setEditMode] = useState(false);
  const [currentPasswordId, setCurrentPasswordId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    url: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [passwords, setPasswords] = useState<PasswordData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError();
  };

  const resetForm = (): void => {
    setFormData({
      url: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
    clearError();
  };

  const clearError = (): void => setError(null);

  const submitHandler = async (): Promise<void> => {
    try {
      setIsSubmitting(true);
      const { url, username, password, confirmPassword } = formData;

      if (!url || !username || !password || !confirmPassword) {
        setError("All fields are required.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const response = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          username,
          password,
        }),
      });

      if (!response.ok) {
        router.push("/sign-up");
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save password");
      }

      const data = await response.json();
      console.log("Password saved successfully:", data);
      resetForm();
      router.push("/password");
    } catch (err) {
      console.error("Error saving password:", err);
      setError(err instanceof Error ? err.message : "Failed to save password");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchPasswords = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/passwords`, {
        method: "GET",
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch passwords");
      }
  
      const data = await response.json();
      console.log("Fetched passwords:", data);
  
      // Optimize: Only update if data has actually changed
      setPasswords(prevPasswords => {
        if (JSON.stringify(prevPasswords) === JSON.stringify(data.data)) {
          return prevPasswords;
        }
        return data.data;
      });
    } catch (err) {
      console.error("Error fetching passwords:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch passwords");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  

  const deleteHandler = async (id: string): Promise<void> => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete password");
      }

      setPasswords((prev) => prev.filter((item) => item._id !== id));
      console.log("Deleted successfully");
    } catch (err) {
      console.error("Error deleting password:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete password"
      );
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  const editPassword = useCallback((password: PasswordData) => {
    setFormData({
      url: password.url,
      username: password.username,
      password: password.password,
      confirmPassword: password.password,
    });
    setCurrentPasswordId(password._id);
    setEditMode(true);
  }, []);

  const updateHandler = async (): Promise<void> => {
    try {
      setIsUpdating(true);
      if (!currentPasswordId) {
        throw new Error("No password selected for editing");
      }

      const { url, username, password, confirmPassword } = formData;

      if (!url || !username || !password || !confirmPassword) {
        setError("All fields are required.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const response = await fetch(`/api/update/${currentPasswordId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update password");
      }

      const data = await response.json();
      console.log("Password updated successfully:", data);
      resetForm();
      setEditMode(false);
      setCurrentPasswordId(null);
      await fetchPasswords();
      router.push("/password");
    } catch (err) {
      console.error("Error updating password:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update password"
      );
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const value = useMemo<FormContextType>(
    () => ({
      formData,
      handleChange,
      resetForm,
      error,
      setError,
      clearError,
      submitHandler,
      fetchPasswords,
      passwords,
      deleteHandler,
      isEditMode,
      setEditMode,
      editPassword,
      updateHandler,
      isLoading,
      isSubmitting,
      isUpdating,
      isDeleting,
    }),
    [
      formData,
      error,
      passwords,
      isEditMode,
      isLoading,
      isSubmitting,
      isUpdating,
      isDeleting,
      handleChange,
      resetForm,
      submitHandler,
      updateHandler
    ]
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export const useForm = (): FormContextType => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};