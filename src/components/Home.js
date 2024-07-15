import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogPost from './BlogPost';
import './Home.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostFile, setNewPostFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/blog/createblog')
      .then(response => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFileChange = (event) => {
    setNewPostFile(event.target.files[0]);
  };

  const handleCreatePost = () => {
    const formData = new FormData();
    formData.append('title', newPostTitle);
    formData.append('content', newPostContent);
    if (newPostFile) {
      formData.append('image', newPostFile);
    }

    axios.post('http://localhost:8000/api/blog/createblog', formData)
      .then(response => {
        setPosts([...posts, response.data]);
        setNewPostTitle('');
        setNewPostContent('');
        setNewPostFile(null);
      })
      .catch(error => {
        setError(error);
      });
  };

  const handleDelete = (postId) => {
    axios.delete(`http://localhost:8000/api/blog/createblog/${postId}`)
      .then(() => {
        setPosts(posts.filter(post => post.id !== postId));
      })
      .catch(error => {
        setError(error);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts.</div>;

  return (
    <div className="home">
      <div className="create-post-section">
        <h2>Create a New Post</h2>
        <div className="create-post-form">
          <input
            type="text"
            placeholder="Title"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
          />
          <textarea
            placeholder="Content"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <input
            type="file"
            onChange={handleFileChange}
          />
          <button className="btn create-btn" onClick={handleCreatePost}>Create Post</button>
        </div>
      </div>
      <div className="toolbar">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="posts">
        {posts.filter(post =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(post => (
          <div key={post.id} className="post">
            <BlogPost {...post} />
            <div className="post-actions">
              <button className="btn edit-btn">Edit</button>
              <button className="btn delete-btn" onClick={() => handleDelete(post.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
