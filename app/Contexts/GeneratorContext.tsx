"use client";
import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface PasswordContextType {
  password: string;
  length: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
  setLength: (length: number) => void;
  setIncludeNumbers: (include: boolean) => void;
  setIncludeSymbols: (include: boolean) => void;
  generatePassword: (length?: number) => void;
}

const PasswordContext = createContext<PasswordContextType | undefined>(
  undefined
);

export const PasswordProvider = ({ children }: { children: ReactNode }) => {
  const [password, setPassword] = useState<string>("");
  const [length, setLength] = useState<number>(8);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);

  const generatePassword = useCallback((customLength?: number) => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
      (includeNumbers ? "0123456789" : "") +
      (includeSymbols ? "!@#$%^&*()_+" : "");

    let newPassword = "";
    const finalLength = customLength || length;

    for (let i = 0; i < finalLength; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      newPassword += chars[randomIndex];
    }
    setPassword(newPassword);
  }, [length, includeNumbers, includeSymbols]);

  return (
    <PasswordContext.Provider
      value={{
        password,
        length,
        includeNumbers,
        includeSymbols,
        setLength,
        setIncludeNumbers,
        setIncludeSymbols,
        generatePassword,
      }}
    >
      {children}
    </PasswordContext.Provider>
  );
};

export const usePassword = (): PasswordContextType => {
  const context = useContext(PasswordContext);
  if (!context) {
    throw new Error("usePassword must be used within a PasswordProvider");
  }
  return context;
};