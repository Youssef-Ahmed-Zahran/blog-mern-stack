import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useMutation } from "@tanstack/react-query";
import { makeRequest } from "../requestMethod";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Upload from "../components/Upload";

const Write = () => {
  const [value, setValue] = useState("");
  const [cover, setCover] = useState("");
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);

  // Helper function to get proper video URL
  const getVideoUrl = (videoData) => {
    if (!videoData || !videoData.url) return "";

    let videoUrl = videoData.url;

    // If it's an ImageKit URL, ensure it has proper video transformations
    if (videoUrl.includes("ik.imagekit.io")) {
      // Remove existing transformations and add our own
      const baseUrl = videoUrl.split("?")[0];
      videoUrl = `${baseUrl}?tr=f-mp4,q-80`;
    }

    return videoUrl;
  };

  // Helper function to check if video format is supported
  const isSupportedVideoFormat = (url) => {
    const supportedFormats = [".mp4", ".webm", ".ogg"];
    return supportedFormats.some(
      (format) =>
        url.toLowerCase().includes(format) || url.toLowerCase().endsWith(format)
    );
  };

  useEffect(() => {
    if (img && img.url) {
      setValue(
        (prev) =>
          prev +
          `<p><img src="${img.url}" alt="Uploaded image" style="max-width: 100%; height: auto;"/></p>`
      );
    }
  }, [img]);

  useEffect(() => {
    if (video && video.url) {
      const videoUrl = getVideoUrl(video);

      if (isSupportedVideoFormat(videoUrl)) {
        // Use HTML5 video element instead of iframe for better compatibility
        setValue(
          (prev) =>
            prev +
            `<p><video controls style="max-width: 100%; height: auto;" preload="metadata">
            <source src="${videoUrl}" type="video/mp4">
            <source src="${videoUrl.replace(
              /\.[^.]+$/,
              ".webm"
            )}" type="video/webm">
            Your browser does not support the video tag.
          </video></p>`
        );
      } else {
        // Fallback for unsupported formats or external links
        setValue(
          (prev) =>
            prev +
            `<p><a href="${videoUrl}" target="_blank" rel="noopener noreferrer" style="color: #1e40af; text-decoration: underline;">
            📹 Video Link: ${video.name || "Click to view video"}
          </a></p>`
        );
      }
    }
  }, [video]);

  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    onSuccess: (res) => {
      toast.success("Post has been created");
      navigate(`/post/${res.data.slug}`);
    },
    onError: (error) => {
      toast.error(
        "Failed to create post: " + (error.message || "Unknown error")
      );
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      img: cover.filePath || "",
      title: formData.get("title"),
      category: formData.get("category"),
      desc: formData.get("desc"),
      content: value,
      user: currentUser?._id,
    };

    mutation.mutate(data);
  };

  const handleRemoveCover = () => {
    setCover("");
  };

  // Custom ReactQuill modules with video support
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-xl font-light">Create a New Post</h1>

      <form className="flex flex-col gap-6 flex-1 mb-6" onSubmit={handleSubmit}>
        {/* Cover Image Upload and Preview */}
        <div className="flex flex-col gap-3">
          <Upload type="image" setProgress={setProgress} setData={setCover}>
            <button
              type="button"
              className="w-max text-gray-500 bg-white p-3 shadow-md text-sm rounded-xl hover:bg-gray-50 transition-colors"
            >
              {cover ? "Change cover image" : "Add a cover Image"}
            </button>
          </Upload>

          {cover && cover.url && (
            <div className="relative w-full max-w-md">
              <img
                src={cover.url}
                alt="Cover preview"
                className="w-full h-48 object-cover rounded-xl shadow-md"
                onError={(e) => {
                  e.target.style.display = "none";
                  toast.error("Failed to load cover image");
                }}
              />
              <button
                type="button"
                onClick={handleRemoveCover}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                title="Remove cover image"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder="My Awesome Story"
          className="bg-transparent outline-none text-4xl font-semibold"
          name="title"
          required
        />

        {/* Category */}
        <div className="flex items-center gap-4">
          <label htmlFor="category" className="text-sm">
            Choose a Category:
          </label>
          <select
            id="category"
            name="category"
            className="p-2 rounded-xl outline-none shadow-md bg-white"
          >
            <option value="general">General</option>
            <option value="web-design">Web Design</option>
            <option value="development">Development</option>
            <option value="databases">Databases</option>
            <option value="seo">Search Engines</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>

        {/* Description */}
        <textarea
          name="desc"
          placeholder="A Short Description..."
          className="p-4 rounded-xl outline-none shadow-md bg-white resize-vertical min-h-[80px]"
        />

        {/* Content Editor */}
        <div className="flex flex-1 min-h-[400px]">
          <div className="flex flex-col gap-2 mr-2">
            <Upload type="image" setProgress={setProgress} setData={setImg}>
              <button
                type="button"
                className="p-2 text-xl hover:bg-gray-100 rounded transition-colors"
                title="Add Image"
              >
                🌆
              </button>
            </Upload>
            <Upload type="video" setProgress={setProgress} setData={setVideo}>
              <button
                type="button"
                className="p-2 text-xl hover:bg-gray-100 rounded transition-colors"
                title="Add Video"
              >
                ▶️
              </button>
            </Upload>
          </div>

          <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            modules={modules}
            formats={formats}
            className="flex-1 rounded-xl outline-none shadow-md bg-white"
            readOnly={progress > 0 && progress < 100}
            placeholder="Write your story here..."
          />
        </div>

        {/* Progress Indicator */}
        {progress > 0 && progress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="self-start bg-blue-800 text-white p-3 px-6 rounded-xl font-medium mt-4 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-blue-900 transition-colors"
          disabled={mutation.isPending || (progress > 0 && progress < 100)}
        >
          {mutation.isPending ? "Creating Post..." : "Create Post"}
        </button>

        {/* Error Display */}
        {mutation.isError && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
            An error occurred: {mutation.error.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default Write;
