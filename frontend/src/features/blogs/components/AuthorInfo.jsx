import logo from "../../../assets/profile.webp"
import { formatDate } from "../../../utils/formatData";
function AuthorInfo({author, blogData}) {
    const {createdAt, readTime = 0} = blogData
    const {username, profileImageURL, isVerified} = author;
  return (
        <div className="mt-8 flex items-center gap-3">
            <img src={ profileImageURL && profileImageURL[0] === "/"? `http://localhost:8004${profileImageURL}`: (profileImageURL || logo) } alt={username} className="h-10 w-10 rounded-full object-cover"/>
            <div>
                <p className="font-medium  text-gray-900">
                    {username}
                </p>

                <div className="flex gap-2">
                    <span>{formatDate(createdAt)}</span>
                    <span>.</span>
                    <span>{readTime} min read</span>
                </div>
            </div>
        </div>
  )
}

export default AuthorInfo