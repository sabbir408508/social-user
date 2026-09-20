import { useEffect, useState } from 'react';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // New Post State
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Comment State
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState({});

  const API_URL = 'http://localhost:5000/api/posts';

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle Post Submit
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert('Title and Content are required!');

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: author.trim() || 'Anonymous',
          title,
          content,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTitle('');
        setContent('');
        setAuthor('');
        fetchPosts();
      }
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Like
  const handleLike = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}/like`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        setPosts(
          posts.map((post) =>
            post._id === id ? { ...post, likes: data.data.likes } : post
          )
        );
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.filter((post) => post._id !== id));
      }
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  // Handle Add Comment
  const handleAddComment = async (postId) => {
    const text = commentText[postId];
    if (!text) return alert('Write a comment first!');

    try {
      const res = await fetch(`${API_URL}/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: commentAuthor.trim() || 'Anonymous',
          text,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCommentText({ ...commentText, [postId]: '' });
        fetchPosts();
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="text-center py-4 bg-white rounded-xl shadow-sm border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-800">Public Anonymous Feed</h1>
          <p className="text-slate-500 text-sm">No Registration or Login Required</p>
        </header>

        {/* Create Post Form */}
        <form onSubmit={handleCreatePost} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">Create a Post</h2>
          
          <input
            type="text"
            placeholder="Your Name (Optional - defaults to Anonymous)"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />

          <input
            type="text"
            placeholder="Post Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            required
          />

          <textarea
            placeholder="What's on your mind? *"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Publish Post'}
          </button>
        </form>

        {/* Feed / Posts List */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-8 text-slate-500 bg-white rounded-xl border">
              No posts yet. Be the first to publish!
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                
                {/* Post Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800">{post.author}</span>
                    <span className="text-xs text-slate-400 block">
                      {new Date(post.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>

                {/* Post Body */}
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{post.title}</h3>
                  <p className="text-slate-700 text-sm mt-1 whitespace-pre-line">{post.content}</p>
                </div>

                {/* Action Bar */}
                <div className="flex items-center gap-4 pt-2 border-t">
                  <button
                    onClick={() => handleLike(post._id)}
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    👍 {post.likes} Likes
                  </button>
                </div>

                {/* Comment Section */}
                <div className="pt-3 border-t space-y-3 bg-slate-50 p-3 rounded-lg">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase">Comments</h4>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Comment text..."
                      value={commentText[post._id] || ''}
                      onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                      className="flex-1 p-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    />
                    <button
                      onClick={() => handleAddComment(post._id)}
                      className="bg-slate-800 text-white text-xs px-3 py-2 rounded-lg hover:bg-slate-900 transition"
                    >
                      Comment
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}