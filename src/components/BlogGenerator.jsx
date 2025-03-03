import { useState } from "react";
import { generateBlog } from "../services/openaiService";
import CopyBtn from "./CopyBtn";

export default function BlogGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return alert("Please enter a topic!");

    setLoading(true);
    setGeneratedContent("");

    const content = await generateBlog(prompt);
    setGeneratedContent(content);

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">AI Blog Generator</h2>

        <textarea
          className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter a topic (e.g., 'The Future of AI')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Blog"}
        </button>

        {generatedContent && (
          <div className="mt-6 p-4 border border-gray-300 bg-gray-50 rounded">
            <h3 className="text-xl font-semibold mb-2">Generated Blog:</h3>
            <CopyBtn generatedContent={generatedContent} />
            <p className="text-gray-700">{generatedContent}</p>
          </div>
        )}
      </div>
    </div>
  );
}