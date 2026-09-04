import { useEffect, useState } from 'react'
import BlogCard from '../components/BlogCard';
import { getAllBlogs } from '../blogs.api';
import { useQuery } from '@tanstack/react-query';

function BlogList() {
    const [currentPage, setCurrentPage] = useState(1);
    //tanstack context 
    const {data, isLoading, isError, error} = useQuery({
        queryKey: ["blogs", currentPage],
        queryFn: ()=>(getAllBlogs(currentPage)),
        gcTime: 5 * 60 * 1000
    });
    // api call
//     useEffect( ()=>{
//         const fetchBlogs = async ()=>{
//             try {
//                 setLoading(true);
//                 setError("");
//                 const data = await getAllBlogs(currentPage, 6);
//                 setBlogs(data.blogs);
//                 setTotalPages(data.pagination.totalPages)
//             } catch (error) {
//                 console.log("error", error);
//                 setError(error.message);
//             }
//             finally{
//                 setLoading(false);
//             }

//     }
//     fetchBlogs();
//  }
    
//  ,[currentPage])


  return (
    <section className='mx-auto max-w-7xl px-3 py-8 sm:px-6 lg:px-8 '>

        <h2 className='mb-8 text-2xl font-bold text-gray-900'>
            Latest
        </h2>

        <div className='grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3'>
            {isError? (
                <p>{error}</p>
            ):null}

             { isLoading && <p> Loading....</ p>}

             {
                !isLoading && 
            data.blogs.map((blog)=>(
                <BlogCard 
                key={blog.id}
                blog={blog}
                />
            ))
           }

           
       </div>

        <div className='flex justify-center items-center gap-1 mx-auto mt-10'>
            <button  disabled={currentPage === 1} className='cursor-pointer bg-primary font-medium text-white hover:opacity-70 px-4 py-2 border rounded-lg disabled:opacity-60 disabled:cursor-not-allowed'
            onClick={()=>{
                if(currentPage == 1) return;
                setCurrentPage(prev=>prev-1);
            }}
            >prev</button>
            {
                Array.from({ length: data?.pagination?.totalPages }, (_, index) =>(
                    <div key={index}
                    className={`border border-gray-400 ${currentPage === index+1 ? "bg-gray-400":""} px-4 py-2 border rounded-lg` }
                    >{index+1}</div>
                )
            )
            }
            <button disabled={currentPage === data?.pagination?.totalPages} className='cursor-pointer bg-primary font-medium text-white hover:opacity-70 px-4 py-2 border rounded-lg disabled:opacity-60 disabled:cursor-not-allowed'
            onClick={()=>{
                if(currentPage === data?.pagination?.totalPages) return;
                setCurrentPage(prev=>prev+1);
            }}
            >front</button>


        </div>
       
    </section>
  )
}

export default BlogList