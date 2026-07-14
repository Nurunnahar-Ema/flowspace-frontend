import { useState, useRef } from "react";
import api from "../component/apiurl"; // Axios instance

function DropZone({ onFiles }) {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    onFiles(files);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    onFiles(files);
  };

  return (
    <div
      className="border-dashed border-2 border-gray-400 p-6 text-center cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />
      <p className="text-gray-600 font-medium">
        Drag & Drop files here or <span className="text-blue-500 underline">Browse</span>
      </p>
    </div>
  );
}

function ProgressBar({ progress }) {
  return (
    <div className="w-full bg-gray-200 rounded mt-2">
      <div
        className="bg-blue-500 text-xs leading-none py-1 text-center text-white rounded transition-all"
        style={{ width: `${progress}%` }}
      >
        {progress}%
      </div>
    </div>
  );
}

export const FileUploader = () => {
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file) => {
    try {
      const chunkSize = 5 * 1024 * 1024; // 5MB
      const localKey = `upload_${file.name}`;
      let uploadedParts = JSON.parse(localStorage.getItem(localKey) || "[]");

      // ১. Upload শুরু করো
      const startRes = await api.post("/api/upload/start", {
        filename: file.name,
        type: file.type,
      });
      const { uploadId, key: fileKey } = startRes.data;

      const parts = [...uploadedParts];

      for (let i = 0; i < file.size; i += chunkSize) {
        const partNumber = Math.floor(i / chunkSize) + 1;

        // যদি এই পার্ট অলরেডি আপলোড হয়ে থাকে, স্কিপ করো
        if (parts.find((p) => p.PartNumber === partNumber)) {
          const currentUploadedBytes = Math.min(i + chunkSize, file.size);
          setProgress((currentUploadedBytes / file.size) * 100);
          continue;
        }

        const chunk = file.slice(i, i + chunkSize);

        // ২. Presigned URL আনো
        // Presigned URL আনো
        // Presigned URL আনো
        const res = await api.post("/api/upload/get-part-url", {
        key: fileKey,
        uploadId,
        partNumber,
        });
        const { url, headers } = res.data;

        // Chunk আপলোড করো
        const uploadRes = await fetch(url, {
        method: "PUT",
        body: chunk,
        headers, // signed headers ব্যবহার করো
        });

        const etag = uploadRes.headers.get("ETag");

        if (!uploadRes.ok || !etag) {
          console.error(`Part ${partNumber} আপলোড ব্যর্থ হয়েছে!`);
          return;
        }

        // ETag এর ভেতরের অতিরিক্ত কোটেশন (") থাকলে তা ট্রিম করা
        etag = etag.replace(/"/g, "");

        const partInfo = { PartNumber: partNumber, ETag: etag };
        parts.push(partInfo);
        
        // লোকাল স্টোরেজে সেভ
        localStorage.setItem(localKey, JSON.stringify(parts));

        // প্রোগ্রেস বার ফিক্স (১০০% এর বেশি যেন না যায়)
        const currentUploadedBytes = Math.min(i + chunkSize, file.size);
        setProgress((currentUploadedBytes / file.size) * 100);
      }

      // ৪. সব chunk শেষ হলে S3 কমপ্লিট রিকোয়েস্ট পাঠানো
      // S3 নিয়মানুযায়ী পার্টস অ্যারেটি পার্ট নাম্বার অনুযায়ী সর্টেড (Sorted) থাকতে হবে
      parts.sort((a, b) => a.PartNumber - b.PartNumber);

      const completeRes = await api.post("/api/upload/complete", {
        key: fileKey,
        uploadId,
        parts,
      });

      if (completeRes.data.success) {
        console.log("Upload complete!");
        localStorage.removeItem(localKey); // আপলোড শেষ, লোকালস্টোরেজ ক্লিন
      }

    } catch (error) {
      console.error("Uploader Error:", error);
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <DropZone
        onFiles={(files) => {
          files.forEach((file) => uploadFile(file));
        }}
      />
      <ProgressBar progress={progress.toFixed(2)} />
    </div>
  );
};