import Main from "../components/layout/Main";
import BlogList from "../features/blogs/pages/BlogList";
function Home() {
  return (
    <div>
      <main id="main" className="">
        <div
          id="hero"
          className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-transparent">
          <Main />
          <BlogList />
        </div>
      </main>
    </div>
  );
}

export default Home;
