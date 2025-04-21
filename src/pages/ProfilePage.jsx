import { useEffect, useState } from "react";
import authService from "../appwrite/auth"; // Import your Appwrite instance
import appwriteService from "../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from "../store/authSlice";
import toast from "react-hot-toast";
import parse from "html-react-parser";
import { PostCard, Container } from "../components";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [DislikedPosts, setDislikedPosts] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
          fetchLikedPosts(userData.$id);
          fetchDisLikedPosts(userData.$id);
          console.log("userid sent to fetchLikedPosts");
        }
      } catch (error) {
        if (error.message.includes("missing scope")) {
          console.error("User not authorized:", error);
          navigate("/login"); // Redirect if not logged in
        } else {
          console.error("Error fetching user:", error);
        }
      }
    };

    const fetchLikedPosts = async (userId) => {
      try {
        const posts = await appwriteService.getLikedPosts(userId);
        console.log("liked post fetched");
        setLikedPosts(posts);
      } catch (error) {
        console.error("Error fetching liked posts:", error);
      }
    };

    const fetchDisLikedPosts = async (userId) => {
      try {
        const posts = await appwriteService.getDislikedPosts(userId);
        console.log("disliked post fetched");
        setDislikedPosts(posts);
      } catch (error) {
        console.error("Error fetching disliked posts:", error);
      }
    };

    getUser();
  }, [navigate,authService, appwriteService]);

  const handleLogout = () => {
    authService.logout().then(() => {
      dispatch(logout());
      toast.success("Logged out successfully");
    }).catch((error) => {
      toast.error("Logout failed");
      console.error("Error during logout:", error);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
  <div className="bg-white shadow-lg rounded-lg mt-4 p-6 w-full max-w-md text-center">
    <h1 className="text-2xl font-bold mb-4">Profile</h1>

    {user ? (
      <div>
        <img
          src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto"
        />
        <h2 className="text-xl mt-2">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Logout
        </button>
      </div>
    ) : (
      <p>Loading...</p>
    )}
  </div>

  <div className="w-full  py-8">
  <Container>
    <h2 className="text-xl font-bold mb-6 text-center border text-white backdrop-blur-md">Liked Posts</h2>
    <div className="flex flex-wrap">
      {likedPosts.length > 0 ? (
        likedPosts.map((post) => (
          <div key={post.$id} className="p-2 w-1/4">
            <PostCard {...post} />
          </div>
        ))
      ) : (
        <p className="text-center w-full text-white backdrop-blur-md">No liked posts yet.</p>
      )}
    </div>
  </Container>

  <Container>
    <h2 className="text-xl font-bold mb-6 text-center border text-white backdrop-blur-md">Disliked Posts</h2>
    <div className="flex flex-wrap">
      {DislikedPosts.length > 0 ? (
        DislikedPosts.map((post) => (
          <div key={post.$id} className="p-2 w-1/4">
            <PostCard {...post} />
          </div>
        ))
      ) : (
        <p className="text-center w-full text-white backdrop-blur-md">No Disliked posts yet.</p>
      )}
    </div>
  </Container>
  
</div>


</div>

  );
};

export default ProfilePage;
