import { apiFetch } from "../../services/api";


export const getAllBlogs = (currentPage)=>{
    return apiFetch(`/blogs?page=${currentPage}`);
} 

export const getBlogById = (id)=>{
    return apiFetch (`/blogs/${id}`);
}


export const createBlog = (formData)=>{
    return apiFetch('/blogs', {
        method: "POST",
        body: JSON.stringify(formData)
    });
       
}
