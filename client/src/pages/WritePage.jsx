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

  useEffect(() => {
    img && setValue((prev) => prev + `<p><image src="${img.url}"/></p>`);
  }, [img]);

  useEffect(() => {
    video &&
      setValue(
        (prev) => prev + `<p><iframe class="ql-video" src="${video.url}"/></p>`
      );
  }, [video]);

  const { currentUser } = useContext(AuthContext);
  const navegate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    onSuccess: (res) => {
      toast.success("Post has been created");
      navegate(`/post/${res.data.slug}`);
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

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-xl font-light">Create a New Post</h1>
      {/* form */}
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

          {/* Cover Image Preview */}
          {cover && cover.url && (
            <div className="relative w-full max-w-md">
              <img
                src={cover.url}
                alt="Cover preview"
                className="w-full h-48 object-cover rounded-xl shadow-md"
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

        {/* title */}
        <input
          type="text"
          placeholder="My Awesome Story"
          className="bg-transparent outline-none text-4xl font-semibold"
          name="title"
          required
        />

        {/* category */}
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

        {/* desc */}
        <textarea
          name="desc"
          placeholder="A Short Description..."
          className="p-4 rounded-xl outline-none shadow-md bg-white"
        />

        {/* content */}
        <div className="flex flex-1">
          <div className="flex flex-col gap-2 mr-2 cursor-pointer">
            <Upload type="image" setProgress={setProgress} setData={setImg}>
              🌆
            </Upload>
            <Upload type="video" setProgress={setProgress} setData={setVideo}>
              ▶️
            </Upload>
          </div>
          <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            className="flex-1 rounded-xl outline-none shadow-md bg-white"
            readOnly={0 < progress && progress < 100}
          />
        </div>

        {/* btn send */}
        <button
          type="submit"
          className="self-start bg-blue-800 text-white p-2 w-36 rounded-xl font-medium mt-4 disabled:cursor-not-allowed mb-2"
          disabled={mutation.isPending || (progress > 0 && progress < 100)}
        >
          {mutation.isPending ? "Sending..." : "Send"}
        </button>
        {"Progress" + progress}
        {mutation.isError ? (
          <div>An error occurred: {mutation.error.message}</div>
        ) : null}
      </form>
    </div>
  );
};

export default Write;
