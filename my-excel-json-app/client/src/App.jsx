import { useState } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [jsonResult, setJsonResult] = useState(null);
  const [jsonData, setJsonData] = useState("");

  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      setError("Please select a file.");
      return false;
    }
    const allowedTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only .xlsx or .csv files are allowed.");
      return false;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB.");
      return false;
    }
    setError("");
    return true;
  };

  const handleUpload = async () => {
    if (!file || !validateFile(file)) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/files/upload-excel", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed. Please try again.");
      const data = await response.json();
      setJsonResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleJsonToExcel = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/files/json-to-excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonData: JSON.parse(jsonData) }),
      });
      if (!response.ok) throw new Error("Conversion failed. Please try again.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "output.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Excel & JSON Converter</h1>

      
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-gray-800">
        <input
          type="file"
          className="mb-4 w-full p-2 border rounded"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setError("");
          }}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          onClick={handleUpload}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300"
        >
          Upload & Convert Excel to JSON
        </button>
        {jsonResult && (
          <pre className="mt-4 p-2 bg-gray-200 rounded overflow-auto text-xs">
            {JSON.stringify(jsonResult, null, 2)}
          </pre>
        )}
      </div>

      
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-gray-800 mt-6">
        <textarea
          className="w-full p-2 border rounded"
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          placeholder="Paste JSON here..."
          rows="5"
        />
        <button
          onClick={handleJsonToExcel}
          className="w-full mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all duration-300"
        >
          Convert JSON to Excel
        </button>
      </div>
    </div>
  );
}
