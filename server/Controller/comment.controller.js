  // controllers/commentController.js
  const Comment = require('../models/comment.model');

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

  const updateComment = async(req, res) => {
    try {
      
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { commentId } = req.params;
      const userId = req.user._id;
      const { text } = req.body;
      
      // Check if text exists in request body
      if (!req.body.text) {
        return res.status(400).json({ error: 'Text field is required ' });
      }

      const updatedComment = await Comment.findOneAndUpdate(
        { 
          _id: commentId,
          user: userId 
        },
        { text: text },
        { 
          new: true,
          runValidators: true 
        }
      )

      if (!updatedComment) {
        return res.status(404).json({ 
          message: "Comment not found or you don't have permission to edit" 
        });
      }

      res.status(200).json(updatedComment);

    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({
        error: 'Failed to update comment',
        details: error.message
      });
    }
  };

  const deleteComment=async(req,res)=>{
    try{
      const{commentId} = req.params;
      const userId = req.user._id

      const deleteComment= await Comment.findOneAndDelete(
        {_id:commentId,
          user:userId
        })
        
        if(!deleteComment){
          return res.status(404).json({message:"Comment not found"})
        }
      res.status(200).json({success:true,message:"Comment deleted"})
      

    }catch(error){
      console.error('Update error:', error);
      res.status(500).json({
        error: 'Failed to update comment',
        details: error.message
      });
    }
  }


  module.exports = {addComment,getCommentsByGame,updateComment,deleteComment}
