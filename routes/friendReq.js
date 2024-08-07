const express = require("express");
const router = express.Router();
const { body,param,validationResult } = require('express-validator');
const FriendReq = require('../models/FriendReq');
const User = require('../models/User');
const Post = require('../models/Post');



router.post('/sendreq', [
    body('from').notEmpty(),
    body('to').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { from, to } = req.body;
    try {
        const sender = await User.findOne({ username: from });
        const receiver = await User.findOne({ username: to });
        if (!sender || !receiver) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const existingRequest = await FriendReq.findOne({ from: sender._id, to: receiver._id });
        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }

      const friendRequest = new FriendReq({ from: sender._id, to: receiver._id });
      await friendRequest.save();
  
      res.status(201).json({ message: 'Friend request sent', requestId: friendRequest._id });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
});

router.post('/receivereq/', [
    body('username').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
      const receivedReq = await FriendReq.find({ to: user._id }).populate('from', 'username');
      const response = receivedReq.map(request => ({
        requestId: request._id,
        from: request.from.username,
        status: request.status
      }));
      res.status(200).json({response});
    } catch (error) {
        console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  


router.get('/acceptreq/:reqid', [
    param('reqid').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    var { reqid } = req.params; 
    try {
      const friendRequest = await FriendReq.findById(reqid);
      if (!friendRequest) {
        return res.status(404).json({ message: 'Friend request not found' });
      }
      friendRequest.status = 'accepted';
      await friendRequest.save();
      await User.findByIdAndUpdate(friendRequest.from, { $addToSet: { friends: friendRequest.to } });
      await User.findByIdAndUpdate(friendRequest.to, { $addToSet: { friends: friendRequest.from } });
      await Post.updateMany({ createdBy: friendRequest.from }, { $addToSet: { visibility: friendRequest.to } });
      await Post.updateMany({ createdBy: friendRequest.to }, { $addToSet: { visibility: friendRequest.from } });
      res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  });

router.get('/rejectreq/:reqid', [
    param('reqid').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { reqid } = req.params;
    try {
      const friendRequest = await FriendReq.findById(reqid);
      if (!friendRequest) {
        return res.status(404).json({ message: 'Friend request not found' });
      }
      friendRequest.status = 'declined';
      await friendRequest.save();
      res.status(200).json({ message: 'Friend request declined' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  


module.exports = router

