import logo from "../../../assets/profile.webp"
import scenary from "../../../assets/scenary.jpg"
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/formatData";
function BlogCard({blog}) { 
 const {title, body, content, createdBy, createdAt, coverImageURL, readTime} = blog
 const preview = body || (content?.content || [])
     .flatMap((node) => node.content || [])
     .map((node) => node.text || "")
     .join(" ");
  return (
    <article className="group cursor-pointer">
        {/* images   */}
        <div className="group overflow-hidden aspect-[16/9]">
            <img loading="lazy" src={ (coverImageURL && coverImageURL[0]) === "/"?`http://localhost:8004${coverImageURL}`: (coverImageURL || scenary ) } alt={title.slice(0, 50)} 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"/>
        </div>

        {/* content */}
        <div className="mt-5">
           
           <Link to={`/blogs/${blog._id}`}>
            <h1 className="line-clamp-3 text-xl font-bond leading-tight text-gray-900 group-hover:underline">
                {title.slice(0, 30)}
            </h1>
           </Link>

            {/* describtion */}
            <p className="mt-3 line-clamp-2 text-base leading-relaxed text-gray-700">
                {preview.slice(0, 80)}..
            </p>

            {/* author + metadata */}
            <div className="mt-5 flex items-center gap-3 text-sm text-gray-500">
                {/* avatar */}
                <img src={ createdBy?.profileImageURL && createdBy.profileImageURL[0] === "/"? `http://localhost:8004${createdBy.profileImageURL}`: ( createdBy?.profileImageURL || logo) } alt={createdBy?.name || "anonymous_user"} className="h-8 w-8 shrink-0  rounded-full object-cover" />

                {/* metadeta */}

                <div className="min-w-0">
                    <p className="truncate font-medium text-gray-700">
                        {/* {blog?.createdBy} */}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                        <span>{formatDate(createdAt)}</span>
                        <span>.</span>
                        <span> {readTime || "0"}  min</span>
                    </div>
                </div>

            </div>
        </div>
    </article>
  )
}

export default BlogCard

