import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userid === userData.$id : false;
    const hasLiked = post && userData ? post.likes?.includes(userData.$id) : false;
    const hasDisliked = post && userData ? post.dislikes?.includes(userData.$id) : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
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
            // Remove like
            updatedLikes = updatedLikes.filter((id) => id !== userData.$id);
        } else {
            // Add like and remove dislike if exists
            updatedLikes.push(userData.$id);
            updatedDislikes = updatedDislikes.filter((id) => id !== userData.$id);
        }
    
        const updatedPost = {
            likes: updatedLikes,
            dislikes: updatedDislikes,
        };
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
            // Remove dislike
            updatedDislikes = updatedDislikes.filter((id) => id !== userData.$id);
        } else {
            // Add dislike and remove like if exists
            updatedDislikes.push(userData.$id);
            updatedLikes = updatedLikes.filter((id) => id !== userData.$id);
        }
    
        const updatedPost = {
            likes: updatedLikes,
            dislikes: updatedDislikes,
        };
        await appwriteService.updatePostLikeDislike(post.$id, updatedPost);
        setPost({ ...post, ...updatedPost });
    };

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
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
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="browser-css">{parse(post.content)}</div>

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
