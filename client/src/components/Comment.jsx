import { useContext } from "react";
import Imagee from "./Imagee";
import { format } from "timeago.js";
import { AuthContext } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../requestMethod";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

const Comment = ({ comment, postId }) => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Delete Post
  const deleteMutation = useMutation({
    mutationFn: () => {
      return makeRequest.delete(`/comments/${comment._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment deleted successfully!");
      Navigate("/");
    },
    onError: (error) => {
      console.log(error.response?.message || "Failed to delete comment");
    },
  });

  const isAdmin = currentUser.isAdmin || false;

  return (
    <div className="bg-slate-50 p-4 rounded-xl mb-8">
      {/* info */}
      <div className="flex items-center gap-4">
        {comment.user?.img && (
          <Imagee
            src={comment.user?.img}
            className="rounded-full object-cover w-10 h-10"
            w="40"
          />
        )}
        <span className="font-semibold">{comment.user?.username}</span>
        <span className="text-sm text-gray-400">
          {format(comment.createdAt)}
        </span>
        {currentUser && (comment.user?._id === currentUser._id || isAdmin) && (
          <span
            className="text-xs text-red-300 hover:text-red-500 cursor-pointer"
            onClick={() => deleteMutation.mutate()}
          >
            delete
            {deleteMutation.isPending && <span>(in progress)</span>}
          </span>
        )}
      </div>
      {/* text */}
      <div className="mt-4">
        <p>{comment.desc}</p>
      </div>
    </div>
  );
};

export default Comment;
