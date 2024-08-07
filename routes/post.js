const express = require("express");
const router = express.Router();
const { body,param,validationResult } = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Post');

router.post('/createpost', [
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('username').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const {title, description, username} = req.body;
    try {
        const user = await User.findOne({username}).populate('friends');
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        const post = new Post({
            title,
            description,
            username, 
            createdBy: user._id,
            visibility: user.friends.map(friend => friend._id)
        });
        await post.save();
        res.status(201).json({message: 'Post created successfully'});
    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
});

router.get('/viewpost/:username',[
    param('username').notEmpty()
],async (req, res) => {
    const {username} = req.params;
    try {
        const user = await User.findOne({username});
        const posts = await Post.find({visibility: user._id}).sort({date:-1});
        res.status(200).json({posts});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.post('/addcomment/:postid', [
    param('postid').notEmpty(),
    body('username').notEmpty(),
    body('comment').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { postid } = req.params;
    const { username, comment } = req.body;
    try {
        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        const post = await Post.findById(postid);
        if (!post) {
            return res.status(404).json({message: 'Post not found'});
        }
        const newComment = {
            user: user._id,
            username: user.username,
            comment: comment,
            date: new Date()
        };
        post.comments.push(newComment);
        const userFriends = user.friends.map(friendId => friendId.toString());
        userFriends.forEach(friendId => {
            if (!post.visibility.includes(friendId) && friendId!=post.createdBy.toString()) {
                post.visibility.push(friendId);
            }
        });
        await post.save();
        res.status(200).json({message: 'Comment added successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error});
    }
});




module.exports = router;

