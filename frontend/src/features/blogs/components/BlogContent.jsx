import React from 'react'

function BlogContent({description=""}) {
  return (
    <p className="mt-5 text-xl leading-relaxed text-gray-600">
        {description}
    </p>
  )
}

export default BlogContent