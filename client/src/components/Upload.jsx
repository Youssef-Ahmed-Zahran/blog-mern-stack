import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";
import toast from "react-hot-toast";
import { makeRequest } from "../requestMethod";

// Cache authentication to avoid repeated requests
let authCache = null;
let authPromise = null;

const authenticator = async () => {
  // Return cached auth if still valid (expires in 10 minutes)
  if (authCache && Date.now() < authCache.expiry) {
    return authCache.data;
  }

  // Return existing promise if one is already in progress
  if (authPromise) {
    return authPromise;
  }

  authPromise = (async () => {
    try {
      const response = await makeRequest.get(`/posts/upload-auth`);
      const { signature, expire, token, publicKey } = response.data;

      // Cache the authentication for 9 minutes (to be safe)
      authCache = {
        data: { signature, expire, token, publicKey },
        expiry: Date.now() + 9 * 60 * 1000,
      };

      return authCache.data;
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    } finally {
      authPromise = null;
    }
  })();

  return authPromise;
};

const Upload = ({ children, type, setData, setProgress }) => {
  const ref = useRef(null);

  const onError = (error) => {
    console.error("Upload error:", error);
    toast.error("Upload failed!");
    setProgress(0);
  };

  const onSuccess = (res) => {
    console.log("Upload successful:", res.name);
    toast.success("Upload successful!");
    setData(res);
    setProgress(0);
  };

  const onUploadProgress = (progress) => {
    const percentage = Math.round((progress.loaded / progress.total) * 100);

    // Only log progress at 10% intervals to reduce console spam
    if (percentage % 10 === 0 || percentage === 100) {
      console.log(`Upload progress: ${percentage}%`);
    }

    setProgress(percentage);
  };

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <IKUpload
        useUniqueFileName
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        className="hidden"
        ref={ref}
        accept={`${type}/*`}
      />
      <div className="cursor-pointer" onClick={() => ref.current.click()}>
        {children}
      </div>
    </IKContext>
  );
};

export default Upload;
