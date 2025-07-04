"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useForm } from "../Contexts/FormContext";
import PasswordCard from "../Component/PasswordCard";
import Loader from "../Component/Loader";

const Page = () => {
  const { fetchPasswords, passwords, isLoading } = useForm();

  useEffect(() => {
    fetchPasswords();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {passwords.map((item) => (
            <PasswordCard key={item._id} item={item} />
          ))}

          <div className="flex justify-center items-center mt-4">
            <Link href="/form">
              <button className="bg-red-600 hover:bg-red-700 font-semibold text-white p-3  flex items-center justify-center rounded-full h-10 w-10 text-sm sm:text-base shadow-md transition text-xl duration-300">
                +
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
