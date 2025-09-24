import Comment from "./Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../requestMethod";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const fetchComments = async (postId) => {
  const res = await makeRequest.get(`/comments/${postId}`);
  return res.data;
};

const Comments = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);

  const { isPending, data, error } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      return makeRequest.post(`/comments/${postId}`, newComment);
    },
    onSuccess: () => {
      // refresh data
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
      desc: formData.get("desc"),
      user: currentUser?._id,
      post: postId,
    };

    mutation.mutate(data);

    // Clear the form after submission
    e.target.reset();
  };

  return (
    <div className="flex flex-col gap-6 lg:w-3/5 mb-12">
      <h1 className="underline text-xl text-gray-500">Comments</h1>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between gap-8 w-full"
      >
        <textarea
          name="desc"
          placeholder="Write a comment..."
          className="outline-none w-full p-4 rounded-xl mb-4"
        />
        <button
          type="submit"
          className="bg-blue-800 text-white px-4 py-3 rounded-xl font-medium"
        >
          Send
        </button>
      </form>
      {isPending ? (
        "Loading..."
      ) : error ? (
        "Error loading comment"
      ) : (
        <>
          {mutation.isPending && (
            <Comment
              comment={{
                desc: `${mutation.variables.desc} (Sending...)`,
                createdAt: new Date(),
                user: { img: currentUser.img, username: currentUser.username },
              }}
            />
          )}

          {data.map((comment) => (
            <Comment key={comment._id} comment={comment} postId={postId} />
          ))}
        </>
      )}
    </div>
  );
};

export default Comments;
