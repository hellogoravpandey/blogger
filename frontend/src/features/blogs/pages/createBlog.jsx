import { useState } from 'react'
import BlogEditor from '../components/BlogEditor';
import { createBlog } from '../blogs.api';

function CreateBlog() {
  const [title, setTitle] = useState("");
    const [content, setContent] = useState({ type: "doc", content: [{ type: "paragraph" }] });
    const [draftId] = useState(() => crypto.randomUUID());

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
        const formData = {title, content, draftId};
        await createBlog(formData);
    } catch (error) {
        // in case of error
        console.log("error in createBlog", error);
    }
  }
  return (
    <main className='mx-auto max-w-7xl px-3 py-8 sm:px-6 lg:px-8 '>
        <h1 className='mb-8 text-3xl font-bold'>
            create a new blog
        </h1>

        <form onSubmit={handleSubmit}>
            {/* title */}
            <div>
                <label htmlFor="title" className='mb-2 block text-sm font-medium'>
                    Title
                </label>
                <input id="title" type="text" 
                placeholder='Enter you blog Title'
                className="w-ful border rounded-lg border-gray-300 px-4 py-3 text-xl outline-none focus:border-gray-900"
                onChange={(e)=>setTitle(e.target.value.trim())}
                />
                
                {/* body */}

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Content
                    </label>

                    <BlogEditor onChange={setContent} draftId={draftId}/>
                </div>

                <button type='submit' className='rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800'
                >
                    Publish
                </button>
            </div>
        </form>
    </main>
  )
}

export default CreateBlog