import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import databaseService from '../appwrite/database';

export default function Post() {
    const [post, setPost] = useState(null);
    const [author, setAuthor] = useState(null); // State to store author data
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userid === userData.$id : false;
    const hasLiked = post && userData ? post.likes?.includes(userData.$id) : false;
    const hasDisliked = post && userData ? post.dislikes?.includes(userData.$id) : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then(async (post) => {
                if (post) {
                    setPost(post);
                    console.log(post.userid)
                    // Fetch user data using post.userid
                    const user = await databaseService.getUserData(post.userid);
                    setAuthor(user);
                } else {
                    navigate("/");
                }
            });
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredimage);
                navigate("/");
            }
        });
    };

    const handleLike = async () => {
        if (!userData) {
            alert("You must be logged in to like a post.");
            return;
        }

        let updatedLikes = [...post.likes];
        let updatedDislikes = [...post.dislikes];

        if (hasLiked) {
            updatedLikes = updatedLikes.filter((id) => id !== userData.$id);
        } else {
            updatedLikes.push(userData.$id);
            updatedDislikes = updatedDislikes.filter((id) => id !== userData.$id);
        }

        const updatedPost = { likes: updatedLikes, dislikes: updatedDislikes };
        await appwriteService.updatePostLikeDislike(post.$id, updatedPost);
        setPost({ ...post, ...updatedPost });
    };

    const handleDislike = async () => {
        if (!userData) {
            alert("You must be logged in to dislike a post.");
            return;
        }

        let updatedLikes = [...post.likes];
        let updatedDislikes = [...post.dislikes];

        if (hasDisliked) {
            updatedDislikes = updatedDislikes.filter((id) => id !== userData.$id);
        } else {
            updatedDislikes.push(userData.$id);
            updatedLikes = updatedLikes.filter((id) => id !== userData.$id);
        }

        const updatedPost = { likes: updatedLikes, dislikes: updatedDislikes };
        await appwriteService.updatePostLikeDislike(post.$id, updatedPost);
        setPost({ ...post, ...updatedPost });
    };

    return post ? (
        <div className="py-8 text-white">
            {/* Display Author Profile */}
            {author && (
                <div className="text-center mb-4">
                    <Link to={`/profile/${author.$id}`}>
                        <img
                            src={`https://ui-avatars.com/api/?name=${author.name}&background=random`}
                            alt="Profile"
                            className="w-24 h-24 rounded-full mx-auto"
                        />
                        <h3 className="text-lg font-bold mt-2">{author.name}</h3>
                    </Link>
                </div>
            )}

            <Container>
                <div className="w-full flex justify-center mb-4 relative  rounded-xl p-2">
                    <img
                        src={appwriteService.getFilePreview(post.featuredimage)}
                        alt={post.title}
                        className="rounded-xl"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>

                <div className="bg-white text-black">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                    <div className="browser-css mt-6">{parse(post.content)}</div>
                </div>

                {/* Like and Dislike Buttons */}
                <div className="flex items-center space-x-4 mt-4">
                    <button
                        onClick={handleLike}
                        className={`px-4 py-2 rounded-md flex items-center ${
                            hasLiked ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        👍 {post.likes?.length || 0}
                    </button>

                    <button
                        onClick={handleDislike}
                        className={`px-4 py-2 rounded-md flex items-center ${
                            hasDisliked ? "bg-red-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        👎 {post.dislikes?.length || 0}
                    </button>
                </div>
            </Container>
        </div>
    ) : null;
}
