import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { IoIosArrowRoundBack } from "react-icons/io";

// Correct Blog interface
interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  createdAt: string;
}

const BlogDetailsPage = () => {
  const { _id } = useParams<{ _id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://pharma-door-backend.vercel.app/api/v1/blog/${_id}`
        );
        setBlog(response.data.data);
      } catch (error) {
        console.error(error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-500">Loading blog...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-500">Blog not found.</p>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-4 text-black">{blog.title}</h1>
      <time
        dateTime={blog.createdAt}
        className="block mb-8 text-gray-400 italic"
      >
        Published on{" "}
        {new Date(blog.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long", // change to "short" for Aug instead of August
          day: "numeric",
        })}
      </time>

      <img
        src={blog.thumbnail}
        alt={blog.title}
        className="w-full h-auto object-cover rounded-lg mb-8 shadow-md"
        loading="lazy"
      />

      <article className="prose prose-lg max-w-none text-gray-800 mb-6">
        {blog.excerpt}
      </article>

      <article className="prose prose-lg max-w-none text-gray-800">
        {blog.content}
      </article>

      <div className="mt-6">
        <Link to="/">
          <button className="flex items-center gap-2 text-blue-500 hover:underline">
            <IoIosArrowRoundBack className="text-2xl" /> Back To Blog
          </button>
        </Link>
      </div>
    </main>
  );
};

export default BlogDetailsPage;
