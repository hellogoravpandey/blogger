import BlogActions from "../components/BlogActions";
import BlogHeader from "../components/BlogHeader"
import scenary from "../../../assets/scenary.jpg"
import BlogContent from "../components/BlogContent";
import { useParams } from "react-router-dom";;
import { useQuery } from "@tanstack/react-query";
import { getBlogById } from "../blogs.api";

function BlogDetails() {

  const {id} = useParams();
  const {data, isLoding, isError, error} = useQuery({
    queryKey: ["blog", id],
    queryFn: ()=>(getBlogById(id)),
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000
  }) 
  // api call
//   useEffect( ()=>{
//           const fetchBlogs = async ()=>{
//               try {
//                   setLoading(true);
//                   setError("");
//                   const data = await apiFetch (`/blogs/${id}`);
//                   setBlog(data.blog);
//               } catch (error) {
//                   console.log("error", error);
//                   setError(error.message);
//               }
//               finally{
//                   setLoading(false);
//               }
//       }
//       fetchBlogs();
//    }
      
//    ,[])

console.log("blog id", data);
  return (
    <main className="px-4 py-12 mx-auto max-w-3xl">
        <BlogHeader blog={data?.blog}/>
        <BlogActions blog={data?.blog} />
        <div className="mx-auto mt-10 max-w-5xl">
            <img src={ (data?.blog?.coverImageURL && data?.blog.coverImageURL[0]) === "/"?`http://localhost:8004${data?.blog.coverImageURL}`: (data?.blog?.coverImageURL || scenary ) } alt={data?.blog?.title} className="w-full object-cover" />
            <BlogContent  description={data?.blog?.body}/>
        </div>
    </main>
  )
}

export default BlogDetails