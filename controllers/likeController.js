const Post = require("../models/postModel");
const Like = require("../models/likeModel");

// 👍 LIKE POST
exports.likePost = async (req, res) => {
  try {
    const { post, user } = req.body;

    // 🔍 Check if post exists
    const existingPost = await Post.findById(post);
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // 🔍 Optional: prevent duplicate likes
    const alreadyLiked = await Like.findOne({ post, user });
    if (alreadyLiked) {
      return res.status(400).json({
        success: false,
        message: "Post already liked by this user",
      });
    }

    // ✅ Create Like
    const like = await Like.create({
      post,
      user,
    });

    // ✅ Update Post
    const updatedPost = await Post.findByIdAndUpdate(
      post,
      { $push: { likes: like._id } },
      { returnDocument: "after" } // ✅ new: true replaced
    );

    res.status(200).json({
      success: true,
      message: "Post liked successfully",
      post: updatedPost,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// 👎 UNLIKE POST
exports.unlikePost = async (req, res) => {
  try {
    const { post, like } = req.body;

    // 🔍 Delete like
    const deletedLike = await Like.findOneAndDelete({
      _id: like,
      post: post,
    });

    if (!deletedLike) {
      return res.status(404).json({
        success: false,
        message: "Like not found",
      });
    }

    // ❌ FIXED: was findByIdAndDelete (WRONG)
    const updatedPost = await Post.findByIdAndUpdate(
      post,
      { $pull: { likes: deletedLike._id } },
      { returnDocument: "after" }
    );

    res.status(200).json({
      success: true,
      message: "Post unliked successfully",
      post: updatedPost,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





