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
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
