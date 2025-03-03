import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";
import { useSelector } from "react-redux";

function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4; // Change this to adjust the number of posts per page

  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    appwriteService.getPosts().then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
    });
  }, []);

  useEffect(() => {
    setCategories(["Technology", "Health", "Travel", "Business"]);
  }, []);

  // Filter posts based on the selected category
  const filteredPosts = selectedCategory
    ? posts.filter((post) =>
        post.title.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    : posts;

  // Pagination logic - Get posts for the current page
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // Handle Next Page
  const nextPage = () => {
    if (endIndex < filteredPosts.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle Previous Page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="text-center py-10 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl">
        <h1 className="text-4xl font-bold">Welcome to Our Blog</h1>
        <p className="mt-4 text-lg">Read the latest articles</p>
      </div>

      {/* Categories Filter */}
      <div className="flex justify-center gap-4 mt-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setCurrentPage(1); // Reset to first page when category changes
            }}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === category
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {category}
          </button>
        ))}

        {/* Reset Filter Button */}
        <button
          onClick={() => {
            setSelectedCategory("");
            setCurrentPage(1); // Reset to first page
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Reset Filter
        </button>
      </div>

      {/* Posts Section */}
      <div className="w-full py-8">
        <Container>
          <div className="flex flex-wrap">
            <div className="w-full text-center">
              {!authStatus && <p className="flex justify-center mt-20">Login to see posts</p>}
            </div>

            {authStatus && paginatedPosts.length === 0 && (
              <div className="w-full text-center mt-10">
                <p className="text-gray-500">No posts yet in {selectedCategory}.</p>
              </div>
            )}

            {authStatus &&
              paginatedPosts.map((post) => (
                <div key={post.$id} className="p-2 w-1/4">
                  <PostCard {...post} />
                </div>
              ))}
          </div>

          {/* Pagination Controls */}
          {authStatus && filteredPosts.length > postsPerPage && (
            <div className="flex justify-center mt-8">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 mx-2 rounded-lg ${
                  currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
                }`}
              >
                Previous
              </button>

              <button
                onClick={nextPage}
                disabled={endIndex >= filteredPosts.length}
                className={`px-4 py-2 mx-2 rounded-lg ${
                  endIndex >= filteredPosts.length ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
                }`}
              >
                Next 
              </button>
            </div>
          )}
        </Container>
      </div>
    </>
  );
}

export default Home;
