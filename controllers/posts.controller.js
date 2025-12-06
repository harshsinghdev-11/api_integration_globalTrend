import User from "../model/User.js";

// Render posts page
export const renderPostsPage = (req, res) => {
  res.render("posts");
};

// Add multiple posts
export const addMultiplePosts = async (req, res) => {
  try {
    const { posts } = req.body;
    const userId = req.user.id;

    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return res.status(400).json({ message: "Posts array is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add posts to user's posts array
    user.posts.push(...posts);
    await user.save();

    res.json({
      message: `Successfully added ${posts.length} posts`,
      count: posts.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ posts: user.posts || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete all posts
export const deleteAllPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.posts = [];
    await user.save();

    res.json({ message: "All posts deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

