import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FolderIcon,
  DocumentIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  HomeIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import api from "../component/apiurl";

// base URL: dev vs prod
const origin = window.location.origin;
const baseUrl = origin.includes("localhost") ? "http://127.0.0.1:8787" : origin;

// Helper functions
const isFolder = (path) => typeof path === "string" && path.endsWith("/");

export const DriveManager = () => {
  const navigate = useNavigate();
  const params = useParams();
  const currentPath = params["*"] || "";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedFile, setSelectedFile] = useState(null); // { id, filepath, name }
  const [fileUrl, setFileUrl] = useState(null);

  // Fetch storage items
  const fetchStorageItems = async (path) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/api/storage?p=${encodeURIComponent(path)}`);
      if (res.data && res.data.success) {
        setItems(res.data.items || []);
      } else {
        setItems([]);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "ফাইল বা ফোল্ডার লোড করতে সমস্যা হয়েছে।");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorageItems(currentPath);
  }, [currentPath]);

  // File click → secure URL
  const handleFileClick = async (item) => {
    if (!item || !item.id) return;
    setSelectedFile(item);
    setFileUrl(null);
    setError("");

    try {
      const res = await api.post(`/api/storage/get/${item.id}`, { userId: 1 });
      if (res.data && res.data.success && res.data.urlkey) {
        const absolute = `${baseUrl}${res.data.urlkey}`;
        setFileUrl(absolute);
      } else {
        setError("ফাইলের URL পাওয়া যায়নি।");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "ফাইলের URL লোড করতে সমস্যা হয়েছে।");
    }
  };

  // Folder click
  const handleFolderClick = (folderPath) => {
    if (!isFolder(folderPath)) folderPath += "/";
    navigate(`/storage/${folderPath}`);
  };

  // Breadcrumb
  const handleBreadcrumbClick = (index) => {
    if (index === -1) {
      navigate("/storage");
      return;
    }
    const pathParts = currentPath.split("/").filter(Boolean);
    const targetPath = pathParts.slice(0, index + 1).join("/") + "/";
    navigate(`/storage/${targetPath}`);
  };

  // Back
  const handleBackClick = () => {
    const pathParts = currentPath.split("/").filter(Boolean);
    if (pathParts.length <= 1) {
      navigate("/storage");
    } else {
      const parentPath = pathParts.slice(0, -1).join("/") + "/";
      navigate(`/storage/${parentPath}`);
    }
  };

  // Format bytes
  const formatBytes = (bytesStr) => {
    const bytes = parseInt(bytesStr, 10);
    if (!bytes || isNaN(bytes) || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const pathParts = currentPath.split("/").filter(Boolean);

  return (
    <div className="p-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <HomeIcon className="w-5 h-5 cursor-pointer" onClick={() => handleBreadcrumbClick(-1)} />
        {pathParts.map((part, index) => (
          <div key={index} className="flex items-center gap-1">
            <ChevronRightIcon className="w-4 h-4" />
            <span
              className="cursor-pointer text-blue-600"
              onClick={() => handleBreadcrumbClick(index)}
            >
              {part}
            </span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={handleBackClick} className="flex items-center gap-1 text-sm text-gray-700">
          <ArrowLeftIcon className="w-4 h-4" /> Back
        </button>
        <div className="flex gap-2">
          <Squares2X2Icon
            className={`w-5 h-5 cursor-pointer ${viewMode === "grid" ? "text-blue-600" : ""}`}
            onClick={() => setViewMode("grid")}
          />
          <ListBulletIcon
            className={`w-5 h-5 cursor-pointer ${viewMode === "list" ? "text-blue-600" : ""}`}
            onClick={() => setViewMode("list")}
          />
        </div>
      </div>

      {/* Loader / Error */}
      {loading && <p>লোড হচ্ছে...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Items */}
      <div className={viewMode === "grid" ? "grid grid-cols-3 gap-4" : "flex flex-col gap-2"}>
        {items.map((item) => (
          <div
            key={item.id || item.filepath}
            className="p-3 border rounded cursor-pointer hover:bg-gray-50 flex items-center gap-2"
            onClick={() => isFolder(item.filepath)
              ? handleFolderClick(item.filepath)
              : handleFileClick(item)}
          >
            {isFolder(item.filepath) ? (
              <FolderIcon className="w-6 h-6 text-yellow-500" />
            ) : (
              <DocumentIcon className="w-6 h-6 text-gray-500" />
            )}
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              {item.size && (
                <p className="text-xs text-gray-500">{formatBytes(item.size)}</p>
              )}
            </div>
            {!isFolder(item.filepath) && (
              <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400" />
            )}
          </div>
        ))}
      </div>

      {/* Modal Viewer */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 h-5/6 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => { setSelectedFile(null); setFileUrl(null); setError(""); }}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <div className="p-4 h-full overflow-auto flex flex-col">
              {!fileUrl && !error && (
                <div className="flex-1 flex items-center justify-center">
                  <p>URL লোড হচ্ছে…</p>
                </div>
              )}

              {fileUrl && (
                <iframe src={fileUrl} className="w-full h-full" title="File Viewer" />
              )}

              {error && (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <p className="text-red-600 mb-4">{error}</p>
                  {fileUrl ? (
                    <a href={fileUrl} className="text-blue-600 underline" download>
                      Download File
                    </a>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

