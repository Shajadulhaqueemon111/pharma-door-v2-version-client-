import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BlogPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const blogData = {
      title,
      content,
      author,
      tags: tags.split(",").map((tag) => tag.trim()),
      category,
      thumbnail,
      published,
      createdAt: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("does not token local storage");
        return;
      }
      const response = await axios.post(
        "https://pharma-door-backend.vercel.app/api/v1/blog/create-blog",
        blogData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("blog created successfully");
        setMessage("✅ Blog posted successfully!");
        setTitle("");
        setContent("");
        setAuthor("");
        setTags("");
        setCategory("");
        setThumbnail("");
        setPublished(true);
      }
    } catch (error) {
      console.error("Blog post failed", error);
      setMessage("❌ Failed to post blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Post a New Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 h-32"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="health, fitness, awareness"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Thumbnail URL</label>
          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            id="published"
          />
          <label htmlFor="published" className="font-medium">
            Publish Now
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded"
        >
          {loading ? "Posting..." : "Post Blog"}
        </button>
        {message && <p className="mt-3 text-sm">{message}</p>}
      </form>
    </div>
  );
};

export default BlogPostForm;
