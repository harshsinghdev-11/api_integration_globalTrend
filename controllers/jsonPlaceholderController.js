// Cache object to store fetched data
const cache = {
  singlePost: {},
  allPosts: null,
  userPosts: {},
};

// Fetch a single post from JSONPlaceholder API
async function fetchPost(id) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  return await res.json();
}

// Fetch all posts (100 posts) from JSONPlaceholder API
async function hundredPost() {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts`);
  return await res.json();
}

// Create a new post on JSONPlaceholder API
async function createUser(title, body, userId) {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body, userId }),
  });

  return await res.json();
}

// Update a post on JSONPlaceholder API
async function updateUser(id, title, body, userId) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, title, body, userId }),
  });

  return await res.json();
}

// Filter posts by user ID from JSONPlaceholder API
async function filterResource(userId) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
  );
  return await res.json();
}

// Get single post by ID
export const getPostById = async (req, res) => {
  const { id } = req.params;

  // Return from cache if exists
  if (cache.singlePost[id]) {
    return res.json({
      success: true,
      cached: true,
      data: cache.singlePost[id],
    });
  }

  try {
    const data = await fetchPost(id);

    // Store in cache
    cache.singlePost[id] = data;

    res.json({ success: true, cached: false, data });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

// Get all posts (100 posts)
export const getAllPosts = async (req, res) => {
  try {
    // Return cached data
    if (cache.allPosts) {
      return res.json({
        success: true,
        cached: true,
        count: cache.allPosts.length,
        data: cache.allPosts,
      });
    }

    const data = await hundredPost();

    // Save to cache
    cache.allPosts = data;

    res.json({ success: true, cached: false, count: data.length, data });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch 100 posts" });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  const { title, body, userId } = req.body;

  try {
    const data = await createUser(title, body, userId);
    res.json({ success: true, created: data });
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, body, userId } = req.body;

  try {
    const data = await updateUser(id, title, body, userId);

    // Clear outdated cache for this ID
    cache.singlePost[id] = data;

    res.json({ success: true, updated: data });
  } catch (err) {
    res.status(500).json({ error: "Failed to update post" });
  }
};

// Get posts by user ID
export const getPostsByUserId = async (req, res) => {
  const { userId } = req.params;

  // Check cache
  if (cache.userPosts[userId]) {
    return res.json({
      success: true,
      cached: true,
      count: cache.userPosts[userId].length,
      data: cache.userPosts[userId],
    });
  }

  try {
    const data = await filterResource(userId);

    // Save to cache
    cache.userPosts[userId] = data;

    res.json({
      success: true,
      cached: false,
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to filter posts" });
  }
};

