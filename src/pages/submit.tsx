/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState, type FormEvent, useEffect } from "react";
import { uploadFile } from "@/utils/uploadFile";

export default function SubmitForm() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [isResetting, setIsResetting] = useState(false);
  const [lastUpdatedNumber, setLastUpdatedNumber] = useState<number | null>(
    null,
  );
  const [resetNumber, setResetNumber] = useState("");
  const [isResettingNumber, setIsResettingNumber] = useState(false);

  // Create preview URL when file changes
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Free memory when component unmounts or file changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file || !name || !number) {
      alert("Please fill in all fields");
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadFile(file, name, parseInt(number));

      if (result.success) {
        alert("File uploaded successfully!");
        // Store the last updated number
        setLastUpdatedNumber(parseInt(number));
        // Reset form
        setFile(null);
        setName("");
        setNumber("");
      } else {
        alert("Error uploading file");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = async () => {
    if (
      !confirm(
        "Are you sure you want to reset the database to its original state?",
      )
    ) {
      return;
    }

    setIsResetting(true);
    try {
      const response = await fetch("/api/reset", {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        alert("Database reset successfully!");
        setLastUpdatedNumber(null);
      } else {
        alert("Error resetting database");
      }
    } catch (error) {
      console.error("Reset error:", error);
      alert("Error resetting database");
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetNumber = async () => {
    if (!resetNumber) {
      alert("Please enter a number to reset");
      return;
    }

    setIsResettingNumber(true);
    try {
      const response = await fetch("/api/resetNumber", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number: parseInt(resetNumber) }),
      });
      const data = await response.json();

      if (data.success) {
        alert(`Successfully reset number ${resetNumber}`);
        setResetNumber("");
      } else {
        alert("Error resetting number");
      }
    } catch (error) {
      console.error("Reset number error:", error);
      alert("Error resetting number");
    } finally {
      setIsResettingNumber(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-lg bg-gray-800 p-6 shadow-xl">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">
          Upload Image
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-2 py-1 text-white shadow-sm focus-within:outline-none focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">
              Number
            </label>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-2 py-1 text-white shadow-sm focus-within:outline-none focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="rounded-lg bg-gray-700/50 p-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Last Updated Number
            </label>
            <div className="mt-1 flex items-center gap-2 rounded-md border border-gray-600/50 bg-gray-800 px-3 py-2">
              <span className="text-blue-400">#</span>
              <input
                type="text"
                value={lastUpdatedNumber ?? ""}
                className="w-full bg-transparent text-blue-300 outline-none"
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">
              Image File
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 block w-full text-sm text-gray-200 file:mr-4 file:rounded-md file:border-0 file:bg-gray-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-200 hover:file:bg-gray-500"
              required
            />
          </div>

          {preview && (
            <div className="mt-4 rounded-lg border-2 border-gray-600 p-2">
              <img
                src={preview}
                alt="Preview"
                className="mx-auto max-h-48 rounded-lg object-contain"
              />
            </div>
          )}

          <div className="mt-6 rounded-lg bg-yellow-900/20 p-3">
            <label className="flex items-center gap-2 text-sm font-medium text-yellow-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Reset Specific Number
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                value={resetNumber}
                onChange={(e) => setResetNumber(e.target.value)}
                placeholder="Enter number to reset"
                className="block flex-1 rounded-md border-gray-600 bg-gray-700 px-2 py-1 text-white placeholder-gray-400 shadow-sm focus-within:outline-none focus:border-yellow-500 focus:ring-yellow-500"
              />
              <button
                type="button"
                onClick={handleResetNumber}
                disabled={isResettingNumber}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm ${
                  isResettingNumber
                    ? "cursor-not-allowed bg-yellow-600 opacity-50"
                    : "bg-yellow-600 hover:bg-yellow-700"
                }`}
              >
                {isResettingNumber ? (
                  "Resetting..."
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Reset
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isUploading}
              className={`flex flex-1 justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm ${
                isUploading
                  ? "cursor-not-allowed bg-indigo-600 opacity-50"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isResetting}
              className={`flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm ${
                isResetting
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-red-700"
              }`}
            >
              {isResetting ? "Resetting..." : "Reset DB"}
            </button>
          </div>
        </form>

        {file && (
          <div className="mt-4">
            <p className="text-sm text-gray-400">Selected file: {file.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
