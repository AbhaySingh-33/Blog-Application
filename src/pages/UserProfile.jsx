import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";
import databaseService from '../appwrite/database';

const UserProfile = () => {
  const { userId } = useParams(); // Get userId from URL
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState(null); // State to store author data

  // Fetch user's posts
  useEffect(() => {
    const fetchPostsAndUser = async () => {
      try {
        // Fetch posts created by the user
        const response = await appwriteService.getPosts();
        if (response) {
          const userPosts = response.documents.filter((post) => post.userid === userId);
          setPosts(userPosts);
        }

        // Fetch user data
        const userData = await databaseService.getUserData(userId);
        if (userData) {
          setAuthor(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsAndUser();
  }, [userId]);

  return (
    <div className="w-full py-8">
      <Container>
       {/* Display Author Profile */}
       {author && (
            <div className="flex flex-col items-center justify-center">
                <div className="bg-white shadow-lg rounded-lg mt-4 mb-4 p-6 w-full max-w-md text-center">                
                        <img
                            src={`https://ui-avatars.com/api/?name=${author.name}&background=random`}
                            alt="Profile"
                            className="w-24 h-24 rounded-full mx-auto"
                        />
                        <h3 className="text-lg  font-bold mt-2">{author.name}</h3> 
                        <p className="text-gray-600">{author.email}</p>               
                </div>
            </div>
            )}

        <h1 className="text-3xl font-bold text-center text-white mb-6">
          {author ? `Posts created by ${author.name}` : "User Profile"}
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts from this user.</p>
        ) : (
          <div className="flex flex-wrap justify-center">
            {posts.map((post) => (
              <div key={post.$id} className="p-2 w-1/4">
                <PostCard {...post} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default UserProfile;
