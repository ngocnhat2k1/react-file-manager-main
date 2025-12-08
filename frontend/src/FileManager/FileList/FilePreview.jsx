import React, { useState } from "react";
import { FaRegFile } from "react-icons/fa6";
import { useFileIcons } from "../../hooks/useFileIcons";

const FilePreview = ({ file, iconSize = 64, filePreviewPath }) => {
  const [imgError, setImgError] = useState(false);
  const fileIcons = useFileIcons(iconSize);
  if (!file) return null;

  const ext = file.name?.split(".").pop()?.toLowerCase();
  const isImage = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(
    ext
  );

  // Xử lý đúng filePath
  let filePath = "";
  if (isImage && file.path && !imgError) {
    // Đảm bảo rằng filePreviewPath không có dấu / cuối và file.path có/dẫn đầu. Nếu cần, chèn dấu /
    if (filePreviewPath) {
      // Remove trailing slash from filePreviewPath if present
      const previewBase = filePreviewPath.endsWith("/")
        ? filePreviewPath.slice(0, -1)
        : filePreviewPath;
      // Ensure file.path has leading slash
      filePath = file.path.startsWith("/")
        ? `${previewBase}${file.path}`
        : `${previewBase}/${file.path}`;
    } else {
      // fallback nếu không có filePreviewPath
      filePath = file.path;
    }

    return (
      <img
        src={filePath}
        alt={file.name}
        style={{
          width: iconSize,
          height: iconSize,
          objectFit: "cover",
          borderRadius: 4,
          display: "block",
        }}
        onError={() => setImgError(true)}
      />
    );
  }

  return fileIcons[ext] ?? <FaRegFile size={iconSize} />;
};

export default FilePreview;
