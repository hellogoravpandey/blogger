function Main() {
  return (
            <div id="hero-container" className="max-w-4xl mx-auto px-6 pb-32 flex flex-col sm:items-center sm:text-center sm:pt-12" >
                <div id="version-text" className="flex items-center gap-2 border border-yellow-300 rounded-lg bg-yellow-50 px-3 py-1 my-6 w-fit shadow-md hover:shadow-lg hover:-translate-y-1 transition group ">
                    <div className="bg-yellow-400 h-2 w-2 border border-yellow-600 rounded-full">
                    </div>
                    <p className="font-display font-medium text-yellow-600"><span className="text-yellow-800"> Blogger's choice</span></p>
                     <i className="fa-solid fa-arrow-right text-yellow-600 group-hover:translate-x-1 transition duration-300"></i>
                </div>

                
                <h1 className="text-4xl sm:text-5xl font-semibold leading-snug ">Publish your passions, your way</h1>
                <p className="text-xl lg:text-2xl mt-4 lg:mt-8 ">Fresh ideas, honest stories, and daily inspiration to fuel your curious mind</p>
                <div id="button-container " className="mt-12 flex gap-4 flex-col sm:flex-row">
                    <button className="px-8 py-3 rounded-lg bg-primary text-white font-semibold shadow-sm hover:bg-opacity-90">create blog</button>
                    <button className="px-8 py-3 rounded-lg font-semibold border border-gray-400 hover:border-gray-800 ">explore</button>
                </div>
            </div> )
          
  
}
export default Main