import React, { useState, useEffect } from 'react';
import { Container, PostCard } from '../components';
import appwriteService from '../appwrite/config';
import  authService  from '../appwrite/auth';

function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch authenticated user
        authService.getCurrentUser().then((userData) => {
            if (userData) {
                setUser(userData);
                // Fetch posts only for the authenticated user
                appwriteService.getPosts().then((posts) => {
                    if (posts) {
                        const userPosts = posts.documents.filter(post => post.userid === userData.$id);
                        setPosts(userPosts);
                    }
                });
            }
        });
    }, []);

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.$id} className='p-2 w-1/4'>
                                <PostCard {...post} />
                            </div>
                        ))
                    ) : (
                        <p className='text-center w-full'>No posts found.</p>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;
