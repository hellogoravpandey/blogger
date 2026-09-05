import { useEffect } from 'react'
import { EditorContent, useEditor } from "@tiptap/react";
import { blogEditorExtensions } from "./tiptapExtensions";

function BlogContent({content}) {
  const editor = useEditor({
    extensions: blogEditorExtensions,
    content: content || { type: "doc", content: [] },
    editable: false,
  });

  useEffect(() => {
    if (editor && content) editor.commands.setContent(content);
  }, [editor, content]);

  return (
    <EditorContent editor={editor} className="prose mt-5 max-w-none" />
  )
}

export default BlogContent