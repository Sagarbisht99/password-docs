"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "../Contexts/FormContext";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "../Contexts/ThemeContext";
import { toast } from "react-toastify";

const Page: React.FC = () => {
  const searchParams = useSearchParams();
  const {
    formData,
    handleChange,
    error,
    submitHandler,
    isEditMode,
    editPassword,
    updateHandler,
    passwords,
    isSubmitting,
    isUpdating,
  } = useForm(); 
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const password = passwords.find((p) => p._id === id);
      if (password) {
        editPassword(password);
      }
    }
  }, [searchParams, passwords, editPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateHandler();
        toast.info("✏️ Password updated successfully!");
      } else {
        await submitHandler();
        toast.success("✅ Password added successfully!");
      }
    } catch (error) {
      console.log(error);

      toast.error("❌ Operation failed. Please try again.");
    }
  };

  const toggleVisibility = (field: "password" | "confirmPassword") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-8">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-full max-w-md p-6 rounded-xl shadow-lg border transition-all duration-300 ${
          theme === "dark"
            ? "bg-zinc-900 border-zinc-700 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isEditMode ? "Edit Password" : "Add Password"}
        </h2>

        {(["url", "username", "password", "confirmPassword"] as const).map(
          (field) => (
            <div key={field} className="mb-4">
              <label className="block mb-1 font-medium capitalize">
                {field === "confirmPassword" ? "Confirm Password" : field}
              </label>
              <div className="relative">
                <input
                  type={
                    field === "password" || field === "confirmPassword"
                      ? showPassword[field]
                        ? "text"
                        : "password"
                      : field === "url"
                      ? "url"
                      : "text"
                  }
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting || isUpdating}
                  className="w-full p-2 pr-10 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {(field === "password" || field === "confirmPassword") && (
                  <div
                    className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                    onClick={() => toggleVisibility(field)}
                  >
                    {showPassword[field] ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mb-4 text-center"
          >
            {error}
          </motion.p>
        )}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={isSubmitting || isUpdating}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting || isUpdating ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
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
              {isEditMode ? "Updating..." : "Submitting..."}
            </>
          ) : isEditMode ? (
            "Update"
          ) : (
            "Submit"
          )}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default Page;
