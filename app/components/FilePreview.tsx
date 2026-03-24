import { useEffect } from "react";
import AudioMessage from "./AudioMessage";

interface FilePreviewProps {
  fileType: string;
  fileUrl: string;
  fileName?: string;
  onImageClick?: (url: string) => void;
  text: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  fileType,
  fileUrl,
  fileName,
  onImageClick,
  text,
}) => {
  const normalizeUrl = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return "https://" + url;
    }
    return url;
  };

  const safeUrl = normalizeUrl(fileUrl);
  const fullUrl = encodeURI(safeUrl);

 const isZip =
  fileName?.toLowerCase().endsWith(".zip") ||
  fileType === "application/zip" ||
  fileType === "application/x-zip-compressed" ||
  fileType === "application/octet-stream";

  if (!fileType || !fileUrl) return null;

  return (
    <div className="file-preview-wrapper">
      {/* IMAGE */}
      {fileType.startsWith("image") && (
        <img
          src={fullUrl}
          alt={fileName || "image"}
          className="file-preview-image"
          onClick={() => onImageClick?.(fullUrl)}
          style={{ cursor: "pointer" }}
        />
      )}

      {/* VIDEO */}
      {fileType.startsWith("video") && (
        <video src={fullUrl} controls className="file-preview-video" />
      )}

      {/* AUDIO */}
      {fileType.startsWith("audio") && <AudioMessage src={fullUrl} />}

      {/* PDF */}
      {fileType === "application/pdf" && (
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="file-preview-pdf"
        >
          <embed
            src={fullUrl}
            type="application/pdf"
            className="w-full h-full"
            style={{ pointerEvents: "none" }}
          />
          <div>
            <i className="fa-solid fa-file-pdf text-danger me-2"></i>
            <span>{fileName}</span>
          </div>
        </a>
      )}

      {/* ZIP PREVIEW */}
      {isZip && (
        <a
          href={fullUrl}
          download={fileName}
          className="file-preview-download d-flex align-items-center"
        >
          <i className="fa-solid fa-file-zipper text-warning fs-3 me-2"></i>
          <span>{fileName || "ZIP file"}</span>
        </a>
      )}

      {/* DEFAULT DOWNLOAD */}
      {!fileType.startsWith("image") &&
        !fileType.startsWith("video") &&
        !fileType.startsWith("audio") &&
        fileType !== "application/pdf" &&
        !isZip && (
          <a
            href={fullUrl}
            download={fileName}
            className="file-preview-download"
          >
            Download {fileName || "file"}
          </a>
        )}

      {/* TEXT (if provided) */}
      {text.trim() && <p className="file-preview-text mb-2">{text}</p>}
    </div>
  );
};

export default FilePreview;
