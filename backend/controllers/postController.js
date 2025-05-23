import sharp from 'sharp';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/postModel.js';
import { User } from '../models/userModel.js';
import { Comment } from "../models/commentModel.js";

export const addNewPost = async (req,res) => {
   try {
      const { caption } = req.body;
      const image = req.file;
      const authorId = req.id;
      
      if (!image) return res.status(400).json({message:'Image required!'});
      
      // upload image post
      const optimizedImageBuffer = await sharp(image.buffer)
         .resize({width:800, height:800, fit:'inside'})
         .toFormat('jpeg', {quality:80})
         .toBuffer();
      
      // buffer to data uri
      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      const post = await Post.create({
         caption,
         image:cloudResponse.secure_url,
         author:authorId
      });
      
      const user = await User.findById(authorId);
      if (user) {
         user.posts.push(post._id);
         await user.save();
      }
      
      await post.populate({ path: 'author', select: '-password' });
      
      return res.status(201).json({
         message: 'New post added',
         post,
         success: true,
      })
      
   } catch (error) {
      console.log(error);
   }
};

export const getAllPost = async (req, res) => {
   try {
      const posts = await Post.find().sort({ createdAt: -1 })
         .populate({ path: 'author', select: '-password' })
         .populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
               path: 'author',
               select: '-password'
            }
         });
         
      return res.status(200).json({
         posts,
         success: true
      })
   } catch (error) {
      console.log(error);
   }
};

export const getUserPost = async (req, res) => {
   try {
      const authorId = req.id;
      const posts = await Post.find({author:authorId}).sort({createdAt:-1}).populate({
         path:'author',
         select:'-password'
      }).populate({
         path: 'comments',
         sort: { createdAt: -1 },
         populate: {
            path: 'author',
            select: '-password'
         }
      })
      return res.status(200).json({
         posts,
         success: true
      })
      
   } catch (error) {
      console.log(error);
   }
};

export const likePost = async (req, res) => {
   try {
      const likeKrneWalaUserKiId = req.id;
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({message:'post not found', success:false});
      
      // logic of like
      await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });  // if we use push method then one user can do multiple likes
      await post.save();
      
      // implementing socket.io for realtime notefication
      
      
      return res.status(200).json({
         message:'post liked',
         success: true
      })
      
   } catch (error) {
      console.log(error);
   }
};

export const disLikePost = async (req, res) => {
   try {
      const likeKrneWalaUserKiId = req.id;
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({message:'post not found', success:false});
      
      // logic of like
      await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });  // if we use push method then one user can do multiple likes
      await post.save();
      
      // implementing socket.io for realtime notefication
      
      
      return res.status(200).json({
         message:'post disliked',
         success: true
      })
      
   } catch (error) {
      console.log(error);
   }
};

export const addComment = async (req,res) => {
   try {
      const postId = req.params.id;
      const commentKrneWalaUserKiId = req.id;
      
      const {text} = req.body;
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post not found', success: false });
      
      if (!text) return res.status(400).json({message:'please enter comment', success:false});
      
      const comment = await Comment.create({
         text,
         author:commentKrneWalaUserKiId,
         post:postId
      })
      
      await comment.populate({
         path:'author',
         select:"-password"
      });
      
      post.comments.push(comment._id);
      
      await post.save();
      
      return res.status(201).json({
         message:'comment added',
         comment,
         success:true
      })
      
   } catch (error) {
      console.log(error);
   }
};

export const getCommentsOfPost = async (req, res) => {
   try {
      const postId = req.params.id;
      
      const comments = await Comment.find({post:postId}).populate({
         path:'author',
         select:'-password'
      })
      if(!comments) return res.status(404).json({message:'No comments found for this post', success:false});
      return res.status(200).json({success:true,comments});
      
   } catch (error) {
      console.log(error);
   }
};

export const deletePost = async (req, res) => {
   try {
      const postId = req.params.id;
      const authorId = req.id;
      
      const post = await Post.findById(postId);
      if(!post) return res.status(404).json({message:'Post not found', success:false});
      
      // cheak login user is owner of the post
      if(post.author.toString() !== authorId) return res.status(403).json({message:'this post is not your'});
      
      // delete the post
      await Post.findByIdAndDelete(postId);
      // remove the user post from user's model
      let user = await User.findById(authorId);
      user.posts = user.posts.filter(id => id.toString() !== postId);
      await user.save();
      // delete associated comments
      await Comment.deleteMany({post:postId});
      
      return res.status(200).json({
         success:true,
         message:'Post deleted'
      })
      
   } catch (error) {
      console.log(error);
   }
};

export const bookmarkPost = async (req, res) => {
   try {
      const postId = req.params.id;
      const authorId = req.id;
      const post = await Post.findById(postId);
      if(!post) return res.status(404).json({message:'Post not found', success:false});
      
      let user = await User.findById(authorId);
      if (user.bookmarks.includes(post._id)) {
         // already bookmarked => remove from the bookmark
         await user.updateOne({$pull:{bookmarks:post._id}});
         await user.save();
         return res.status(200).json({type:'unsaved', message:'post remove from bookmarks', success:true});
      } else {
         // do bookmark
         await user.updateOne({$addToSet:{bookmarks:post._id}});
         await user.save();
         return res.status(200).json({type:'saved', message:'post bookmarks', success:true});
      }
      
   } catch (error) {
      console.log(error);
   }
};