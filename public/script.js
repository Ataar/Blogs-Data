// const API_BASE = "http://localhost:3000";
const API_BASE = "";  // or you can also write "/"

const blogForm = document.getElementById("blogForm");
const blogsContainer = document.getElementById("blogs");
const titleInput = document.getElementById("title");

function focusTitle() {
  titleInput.focus({ preventScroll: false });
}

// Load blogs
async function loadBlogs() {
  const res = await fetch(`${API_BASE}/blogs`);
  const blogs = await res.json();

  blogsContainer.innerHTML = "";
  blogs.forEach(blog => {
    const div = document.createElement("div");
    div.className = "blog-card text-center";
    div.innerHTML = `
      <h3>${blog.title}</h3>
      <p><b>Category:</b>${blog.category || "N/A"}</p>
      <p>${blog.content}</p>
      <div class="blog-actions">
        <button class="like-btn" onclick="likeBlog('${blog._id}', ${blog.likes})">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                     4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 
                     14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          ${blog.likes}
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
}

// Create blog
blogForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newBlog = {
    title: document.getElementById("title").value,
    category: document.getElementById("category").value,
    content: document.getElementById("content").value,
    authorId: document.getElementById("authorId").value
  };

  await fetch(`${API_BASE}/blogs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newBlog)
  });

  blogForm.reset();
  focusTitle();
  loadBlogs();
});

// Delete blog
async function deleteBlog(id) {
  await fetch(`${API_BASE}/blogs/${id}`, { method: "DELETE" });
  loadBlogs();
}

// Like blog
async function likeBlog(id, currentLikes) {
  await fetch(`${API_BASE}/blogs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: currentLikes + 1 })
  });
  loadBlogs();
}

focusTitle();
loadBlogs();
