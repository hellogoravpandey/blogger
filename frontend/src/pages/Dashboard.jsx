import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getMyBlogs } from "../features/blogs/blogs.api";
import scenary from "../assets/scenary.jpg";

const sidebarItems = [
  { label: "My blogs", to: "/dashboard" },
  { label: "Create blog", to: "/create-blog" },
  { label: "Profile", to: "#" },
  { label: "Settings", to: "#" },
];

function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadBlogs = async () => {
      try {
        const data = await getMyBlogs();
        if (active) setBlogs(data.blogs || []);
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadBlogs();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-3 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl gap-6">
        <aside className="sticky top-0 hidden min-h-screen w-56 shrink-0 rounded-xl border border-gray-200 bg-white p-3 shadow-sm md:block">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Workspace
          </p>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 flex-1">
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-500">Dashboard</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">My blogs</h1>
            <p className="mt-2 text-gray-600">All drafts and published blogs owned by you.</p>
          </div>

          {loading && <p className="text-gray-600">Loading your blogs...</p>}
          {error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}
          {!loading && !error && blogs.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <h2 className="text-lg font-semibold text-gray-900">No blogs yet</h2>
              <p className="mt-2 text-gray-500">Start writing your first blog.</p>
              <NavLink to="/create-blog" className="mt-5 inline-block rounded-lg bg-gray-900 px-5 py-2.5 font-medium text-white hover:bg-gray-700">
                Create blog
              </NavLink>
            </div>
          )}

          {!loading && !error && blogs.length > 0 && (
            <div className="space-y-5">
              {blogs.map((blog) => (
                <article key={blog._id} className="group flex min-h-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <div className="w-40 shrink-0 overflow-hidden sm:w-56">
                    <img
                      src={blog.coverImageURL || scenary}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{blog.status}</span>
                      <span className="text-xs text-gray-400">{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <h2 className="mt-3 line-clamp-2 text-xl font-semibold leading-tight text-gray-900 group-hover:underline">{blog.title}</h2>
                      <p className="mt-3 line-clamp-2 text-base leading-relaxed text-gray-700">
                        {blog.content?.content?.find((node) => node.type === "paragraph")?.content?.map((node) => node.text || "").join(" ") || "No description available."}
                      </p>
                    </div>
                    <NavLink to={`/blogs/${blog._id}`} className="mt-5 inline-block w-fit self-start rounded-lg border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-blue-700 hover:bg-blue-700">
                      View blog →
                    </NavLink>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Dashboard;