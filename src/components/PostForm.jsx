import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "../components";
import BlogGenerator from "../components/BlogGenerator";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/config";
import { ID } from "appwrite";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const submit = async (data) => {
        try {
            // Ensure content is a string
            if (typeof data.content !== "string") {
                data.content = JSON.stringify(data.content);
            }
    
            // Truncate content if it exceeds 255 characters
            if (data.content.length > 255) {
                data.content = data.content.substring(0, 255);
            }
    
            console.log(data);
            if (post) {
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;
    
                if (file) {
                    await appwriteService.deleteFile(post.featuredimage);
                }
    
                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredimage: file ? file.$id : undefined,
                });
    
                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                const file = await appwriteService.uploadFile(data.image[0]);
                if (file && file.$id) {
                    console.log("File uploaded successfully:", file); // Debugging step
    
                    const fileId = file.$id;
    
                    const newData = { 
                        ...data, 
                        featuredimage: fileId 
                    };
    
                    if (!userData || !userData.$id) {
                        throw new Error("User data is not available");
                    }
    
                    try {
                        console.log("Sending newData to Appwrite:", newData); // Debugging step
    
                        const dbPost = await appwriteService.createPost({ 
                            ...newData, 
                            userid: userData.$id,
                            $id: ID.unique()
                        });
    
                        if (dbPost) {
                            console.log("Post created successfully:", dbPost); // Debugging step
                            navigate(`/post/${dbPost.$id}`);
                        } else {
                            throw new Error("Post creation failed");
                        }
                    } catch (error) {
                        console.error("Error creating post:", error);
                        throw new Error("Post creation failed");
                    }
                } else {
                    console.error("File upload failed");
                    throw new Error("File upload failed");
                }
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            // Optionally, display an error message to the user
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post?.featuredimage && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post?.featuredimage)}
                            alt={post?.title || "Post Image"}
                            className="rounded-lg"
                        />
                    </div>
                )}

                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <div className="App">
                    <h1>AI-Powered Blog Creator</h1>
                    <BlogGenerator />
                </div>

                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}