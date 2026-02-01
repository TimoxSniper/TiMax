"use client";

import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Konto erstellen</h1>
          <p className="text-gray-600">Starte jetzt mit TiMax durch</p>
        </div>
        
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl">
          <SignUp 
            routing="hash"
            appearance={{
              elements: {
                card: "bg-transparent shadow-none",
                headerTitle: "text-gray-900",
                headerSubtitle: "text-gray-600",
                socialButtonsBlockButton: "bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200",
                socialButtonsBlockButtonText: "text-gray-900",
                formFieldLabel: "text-gray-700",
                formFieldInput: "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400",
                formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white",
                footerActionText: "text-gray-600",
                footerActionLink: "text-blue-600 hover:text-blue-700",
              },
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
