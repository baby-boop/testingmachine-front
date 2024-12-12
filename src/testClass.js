import React, { useEffect, useState } from "react";
import axios from "axios";

const FolderManager = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/list-folders");
        setFolders(response.data);
      } catch (error) {
        console.error("Error fetching folder list:", error);
      }
    };

    fetchFolders();
  }, []);

  const deleteJsonFiles = async () => {
    if (!selectedFolder) {
      alert("Please select a folder!");
      return;
    }

    try {
      const response = await axios.delete("http://localhost:8080/delete-json-files", {
        params: { folderName: selectedFolder },
      });
      alert(response.data);
    } catch (error) {
      console.error("Error deleting JSON files:", error);
      alert("Failed to delete JSON files.");
    }
  };

  return (
    <div className="min-h-[500px] flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">JSON файлуудыг удирдах</h1>

        <label
          htmlFor="folderSelect"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Фолдер сонгоно уу:
        </label>
        <select
          id="folderSelect"
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-6"
        >
          <option value="">--Фолдер сонгоно уу--</option>
          {folders.map((folder, index) => (
            <option key={index} value={folder}>
              {folder}
            </option>
          ))}
        </select>

        <button
          onClick={deleteJsonFiles}
          disabled={!selectedFolder}
          className={`w-full py-3 px-4 rounded-lg text-white font-bold text-lg shadow-md transition-all duration-200 ${
            !selectedFolder
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          JSON файлуудыг устгах
        </button>
      </div>
    </div>
  );
};

export default FolderManager;