const Comment = require('../Model/comment.model');

const addComment = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { gameId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    const newComment = await Comment.create({ user:userId, gameId, text });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment',details: error.message });
  }
};

const getCommentsByGame = async (req, res) => {
  try {
    const  {gameId}  = req.params;

    const comments = await Comment.find({gameId})
      .populate('user', 'name profilePicture') // adjust fields you want from User
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments' ,error:error.message});
  }
};

const deleteAll = async(req,res)=>{
  await Comment.deleteMany({})
  res.status(200).json({message:"deleted"})
}

module.exports = {addComment,getCommentsByGame,deleteAll}
