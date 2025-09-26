import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";
import toast from "react-hot-toast";
import { makeRequest } from "../requestMethod";

const authenticator = async () => {
  try {
    const response = await makeRequest.get(`/posts/upload-auth`);
    const { signature, expire, token, publicKey } = response.data;
    return { signature, expire, token, publicKey };
  } catch (error) {
    console.error("Authentication error:", error);
    throw new Error("Authentication request failed");
  }
};

const Upload = ({ children, type, setData, setProgress }) => {
  const ref = useRef(null);

  const onError = (error) => {
    console.log("Upload error:", error);

    // Handle specific error cases
    if (
      error.message?.includes("transformations limit exceeded") ||
      error.status === 403
    ) {
      toast.error(
        "Upload limit exceeded. Please upgrade your plan or try again next month."
      );
    } else if (error.message?.includes("file size")) {
      toast.error("File too large. Please choose a smaller file.");
    } else if (error.message?.includes("file type")) {
      toast.error("File type not supported. Please choose a different file.");
    } else {
      toast.error("Upload failed! Please try again.");
    }

    // Reset progress if needed
    if (setProgress) {
      setProgress(0);
    }
  };

  const onSuccess = (res) => {
    console.log("Upload success:", res);
    toast.success("Upload successful!");
    setData(res);

    // Reset progress
    if (setProgress) {
      setProgress(100);
    }
  };

  const onUploadProgress = (progress) => {
    console.log("Upload progress:", progress);
    if (setProgress) {
      setProgress(Math.round((progress.loaded / progress.total) * 100));
    }
  };

  const handleClick = () => {
    // Reset progress when starting new upload
    if (setProgress) {
      setProgress(0);
    }
    ref.current.click();
  };

  return (
    <IKContext authenticator={authenticator}>
      <IKUpload
        ref={ref}
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        style={{ display: "none" }}
        accept={type === "video" ? "video/*" : "image/*"}
        isPrivateFile={false}
        useUniqueFileName={true}
        responseFields={["tags"]}
        validateFile={(file) => {
          // Add file validation
          const maxSize =
            type === "video" ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB for video, 10MB for image

          if (file.size > maxSize) {
            toast.error(
              `File too large. Maximum size: ${
                type === "video" ? "100MB" : "10MB"
              }`
            );
            return false;
          }

          return true;
        }}
      />
      <div onClick={handleClick} style={{ cursor: "pointer" }}>
        {children}
      </div>
    </IKContext>
  );
};

export default Upload;
