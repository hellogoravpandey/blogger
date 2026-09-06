import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogEditor from "../components/BlogEditor";
import { getBlogById, updateBlog } from "../blogs.api";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(null);
  const [draftId] = useState(() => crypto.randomUUID());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadBlog = async () => {
      try {
        const data = await getBlogById(id);
        if (!active) return;
        setBlog(data.blog);
        setTitle(data.blog.title || "");
        setContent(data.blog.content);
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadBlog();
    return () => { active = false; };
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      await updateBlog(id, { title, content, draftId });
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="mx-auto max-w-7xl px-3 py-8 sm:px-6 lg:px-8">Loading blog...</main>;
  if (error && !blog) return <main className="mx-auto max-w-7xl px-3 py-8 text-red-600">{error}</main>;

  return (
    <main className="mx-auto max-w-7xl px-3 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Edit blog</h1>
      {error && <p className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="edit-title" className="mb-2 block text-sm font-medium">Title</label>
        <input id="edit-title" value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-xl outline-none focus:border-gray-900" />
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">Content</label>
          <BlogEditor onChange={setContent} draftId={draftId} initialContent={content} />
        </div>
        <button type="submit" disabled={saving} className="mt-6 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </main>
  );
}

export default EditBlog;