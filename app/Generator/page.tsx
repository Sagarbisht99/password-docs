// pages/PasswordPage.tsx
"use client";
import React, { useEffect, useState } from "react";
import { usePassword } from "../Contexts/GeneratorContext";
import { FiCopy, FiCheck } from "react-icons/fi";


const PasswordPage: React.FC = () => {
  const {
    password,
    length,
    includeNumbers,
    includeSymbols,
    setLength,
    setIncludeNumbers,
    setIncludeSymbols,
    generatePassword,
  } = usePassword();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generatePassword();
  }, [length, includeNumbers, includeSymbols]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-8">
     
      <div className="w-full max-w-md space-y-6 bg-white/5 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/10">
        <h1 className="text-2xl font-bold text-center">
          🔐 Password Generator
        </h1>

        <div className="flex items-center bg-zinc-700 justify-between bg-accent p-2 rounded-md">
          <input
            type="text"
            value={password}
            readOnly
            className=" text-orange-400 font-mono flex-1 px-2 outline-none"
          />
          <button
            onClick={handleCopy}
            className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {copied ? (
              <>
                <FiCheck size={16} className="text-green-400" />
              </>
            ) : (
              <>
                <FiCopy size={16} />
              </>
            )}
          </button>
        </div>

        <div className="mt-6">
          <label htmlFor="length" className="text-left block mb-1">
            Length: {length}
          </label>
          <input
            id="length"
            type="range"
            min={4}
            max={32}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>

        <div className="mt-4 space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
            />
            Numbers
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
            />
            Special Chars
          </label>
        </div>
      </div>
    </div>
  );
};

export default PasswordPage;
