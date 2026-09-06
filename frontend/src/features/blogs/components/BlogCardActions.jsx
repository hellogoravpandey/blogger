import { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { Link } from "react-router-dom";
import Modal from "../../../components/ui/Modal";
import { deleteBlog } from "../blogs.api";

function BlogCardActions({ blog, onDeleted }) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError("");
      await deleteBlog(blog._id);
      setConfirming(false);
      setOpen(false);
      onDeleted(blog._id);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="relative">
        <button
          type="button"
          title="Blog actions"
          onClick={() => setOpen((current) => !current)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        >
          <FaEllipsisV />
        </button>
        {open && (
          <div className="absolute right-0 top-full z-10 mt-1 w-32 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            <Link
              to={`/blogs/${blog._id}/edit`}
              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Edit
            </Link>
            <button
              type="button"
              className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              onClick={() => {
                setOpen(false);
                setError("");
                setConfirming(true);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={confirming} onClose={() => !deleting && setConfirming(false)} title="Delete blog">
        <p className="text-gray-600">This will remove the blog and schedule its attached images for cleanup.</p>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" disabled={deleting} onClick={() => setConfirming(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
          <button type="button" disabled={deleting} onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </>
  );
}

export default BlogCardActions;