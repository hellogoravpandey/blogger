import AuthorInfo from "./AuthorInfo";
import BlogActions from "./BlogActions";

// why need of dummy prop ?? 
function BlogHeader({blog={}}) {
  const {title, createdBy} = blog;
    //dummy prop 
  return (
    <header className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-800 md:text-5xl ">
        {title}
        </h1>
        <AuthorInfo author={createdBy || {}}  blogData={{createdAt: blog.createdAt, readTime: blog.readTime }} />
    </header>
  )
}

export default BlogHeader