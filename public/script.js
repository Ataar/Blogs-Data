// ✅ Vercel-ready API base
const API_BASE = ""; // blank means same server as frontend

const blogForm = document.getElementById("blogForm");
const blogsContainer = document.getElementById("blogs");
const titleInput = document.getElementById("title");

// Focus on title input
function focusTitle() {
  titleInput.focus({ preventScroll: false });
}

// Load all blogs
async function loadBlogs() {
  try {
    const res = await fetch(`${API_BASE}/blogs`);
    const blogs = await res.json();

    blogsContainer.innerHTML = "";
    blogs.forEach(blog => {
      const div = document.createElement("div");
      div.className = "blog-card text-center";
      div.innerHTML = `
        <div class="blog-header">
          <h3 class="blog-title">${blog.title}</h3>
          <span class="blog-category">${blog.category || "N/A"}</span>
        </div>
        <p class="blog-content">${blog.content}</p>
        <div class="blog-footer">
          <span class="blog-author">Author: ${blog.authorId || "Anonymous"}</span>
          <span class="blog-date">${new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
        <div class="blog-actions">
          <button class="like-btn" onclick="likeBlog('${blog._id}', ${blog.likes})">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                       4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 
                       14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            ${blog.likes || 0}
          </button>
          <button class="delete-btn" onclick="deleteBlog('${blog._id}')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M3 6h18v2H3V6zm2 3h14l-1.5 12.5a1 1 0 0 1-1 .5H7a1 
                       1 0 0 1-1-.5L4 9zm5 2v8h2v-8H9zm4 0v8h2v-8h-2z"/>
            </svg>
            Delete
          </button>
        </div>
      `;
      blogsContainer.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading blogs:", err);
    blogsContainer.innerHTML = "<p style='color:red;'>Failed to load blogs.</p>";
  }
}

// Create blog
blogForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newBlog = {
    title: titleInput.value.trim(),
    category: document.getElementById("category").value.trim(),
    content: document.getElementById("content").value.trim(),
    authorId: document.getElementById("authorId").value.trim()
  };

  if (!newBlog.title || !newBlog.content) {
    alert("Title and content are required!");
    return;
  }

  try {
    await fetch(`${API_BASE}/blogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBlog)
    });
    blogForm.reset();
    focusTitle();
    loadBlogs();
  } catch (err) {
    console.error("Error creating blog:", err);
    alert("Failed to create blog.");
  }
});

// Delete blog
async function deleteBlog(id) {
  try {
    await fetch(`${API_BASE}/blogs/${id}`, { method: "DELETE" });
    loadBlogs();
  } catch (err) {
    console.error("Error deleting blog:", err);
  }
}

// Like blog
async function likeBlog(id, currentLikes) {
  try {
    await fetch(`${API_BASE}/blogs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: currentLikes + 1 })
    });
    loadBlogs();
  } catch (err) {
    console.error("Error liking blog:", err);
  }
}

// Initial load
focusTitle();
loadBlogs();
