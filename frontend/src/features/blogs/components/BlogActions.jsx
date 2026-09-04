import { FaHeart, FaRegHeart, FaBookmark,  FaRegBookmark, FaRegShareSquare } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { apiFetch } from "../../../services/api";
import { useQueryClient } from "@tanstack/react-query";


function BlogActions({blog={}}) {
 // like + bookmark
  const {user, loading, updateUserBookmark} = useAuth();
  const isLiked = user? blog.likes?.includes(user._id):false;
  const queryClient = useQueryClient()

  //states
//   const [like, setLike] = useState(false);
//   const [bookmark, setBookmark] = useState(false);


  // intial state from backend
//   useEffect(()=>{
//     setLike(likes?.includes(user?._id) || false);    
//   } 
//   ,[user, likes]);

//   useEffect(()=>{
//       console.log("bookmark in userEffect", user?.bookmarks?.includes(_id))
//     setBookmark(user?.bookmarks?.includes(_id) || false);
//   }, 
//   [user, _id]);
  

// const handleLike = async ()=>{
//     const liked = !like;
//     setLike(liked);
//     try {
//         const data = await apiFetch(`/blogs/${_id}/${liked?"like":"unlike"}`, {method: "PATCH"});
//         console.log("liked data", data);
//     } catch (error) {
//         // currently not doing anything
//         console.log("error in liked", error );
//         //setback 
//         setLike(like);
//     }
//   }


  const handleLike = async ()=>{
    // save current cache fro rollback
    const previousBlog = queryClient.getQueryData(["blog", blog._id]);
     queryClient.setQueryData(["blog", blog._id], (oldData)=>(
             {
            ...oldData.blog,
            likes:  isLiked ?
             oldData.blog.likes?.filter(id=>id !== user._id)
             : [...oldData.blog.likes, user._id]
            })) 
    try {
        const data = await apiFetch(`/blogs/${blog._id}/${isLiked?"unlike":"like"}`, {method: "PATCH"});
        console.log("liked data", data);
    } catch (error) {
        // currently not doing anything
        console.log("error in liked", error );
        // rollback 
        queryClient.setQueriesData(["blog", blog._id], previousBlog);
    }
  }



  const handleBookmark = async ()=>{

    const bookmarked = !bookmark;
    // optimized ui
    setBookmark(bookmarked);
    updateUserBookmark(_id, bookmarked)
     try {
        const data = await apiFetch(`/blogs/${_id}/${bookmarked?"bookmark":"unbookmark"}`, {method:"PATCH"});
        console.log("bookmarked", data);
    } catch (error) {
        // currently not doing anything
        console.log("error in bookmarked", error );
        // seback 
        setBookmark(bookmark);
        updateUserBookmark(_id, bookmark);
    }
  }


  return (
    <div className="flex items-center justify-between border-y border-gray-200 py-4">
        <div className="flex items-center gap-6">
            <button type = "button" title="login required" disabled={user?false:true} className="cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleLike}
            >
                {!loading?(isLiked?<FaHeart/>:<FaRegHeart/>):"loading...."} 
            </button>

            <button  title="login required" disabled={user?false:true} className="cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleBookmark}
            >
                {/* {!loading?(bookmark?<FaBookmark/>:<FaRegBookmark/>):"loading...."}  */}
            </button>

            <button  title="login required" disabled={user?false:true} className="cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                <FaRegShareSquare />
            </button>
        </div>
        
    </div>
  )
}

export default BlogActions


