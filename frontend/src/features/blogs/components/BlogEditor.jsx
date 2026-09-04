import React from 'react'
import {useEditor, EditorContent} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

function BlogEditor({onChange}) {

    const editor = useEditor({
    extensions: [
        StarterKit,
    ],
    content: "",
    onUpdate: ({editor}) =>{
        onChange(editor.getHTML());
    }
  })


  return (
    <div className='overflow-hidden rounded-xl border bordre-gray-300'>
    {/* toolbar */}
    <div className='flex  gap-1 bordre-b bg-gray-50 p-2'>
        <button type='button' onClick={()=>editor.chain().focus().toggleBold().run()}
        className={`rounded px-3 py-1.5 text-sm ${editor.isActive("bold")? "bg-gray-200": "hover:bg-gray-200"}`}
            >
            B
        </button>

        <button type='button' onClick={()=>editor.chain().focus().toggleItalic().run()}
        className={`rounded px-3 py-1.5 text-sm ${editor.isActive("italic")? "bg-gray-200":"hover:bg-gray-200"}`}
            >
            I
        </button>

        <button type='button' onClick={()=>editor.chain().focus().toggleHeading({level: 2}).run()}
        className={`rounded px-3 py-1.5 text-sm ${editor.isActive("heading", {level: 2})? "bg-gray-200": "hover:bg-gray-200"}`}
            >
            H2
        </button>

        <button type='button' onClick={()=>editor.chain().focus().toggleBulletList().run()}
        className="rounded px-3 py-1.5 text-sm hover:bg-gray-200"
            >
            . List 
        </button>

         <button type='button' onClick={()=>editor.chain().focus().toggleOrderedList().run()}
        className="rounded px-3 py-1.5 text-sm hover:bg-gray-200"
            >
            1. List 
        </button>

    </div>
        {/* editor */}

        <EditorContent editor={editor} className='min-h-[400px] px-5 py-4 '/>
    </div>
  )
}

export default BlogEditor