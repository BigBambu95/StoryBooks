const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

// Stories Index
router.get('/', (req, res) => {
  Story.find({status: 'public'})
    .populate('user')
    .sort({data: 'desc'})
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      });
    }); 
});

// Show Single Story
router.get('/show/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .populate('user')
  .populate('comments.commentUser')
  .then(story => {
    if(story.status == 'public') {
      res.render('stories/show', {
        story: story
      });
    } else {
      if(req.user) {
        if(req.user.id == story.user._id) {
          res.render('stories/show', {
            story: story
          });
        } else {
          res.redirect(303, '/stories');
        }
      } else {
        res.redirect(303, '/stories');
      }
    }
  });
});

// List stories from a user
router.get('/user/:userId', (req, res) => {
  Story.find({user: req.params.userId, status: 'public'})
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      });
    });
});

// Logged in users stories
router.get('/my', ensureAuthenticated, (req, res) => {
  Story.find({ user: req.user.id })
    .populate('user')
    .sort({data: 'desc'})
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      });
    }); 
});

// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

// Edit Story Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .then(story => {
    if(story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      res.render('stories/edit', {
        story: story
      });
    }
  });
});

// Process Add Story
router.post('/', (req, res) => {
  let allowComments;

  if(req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  }

  // Create Story
  new Story(newStory)
    .save()
    .then(story => {
      res.redirect(303, `/stories/show/${story.id}`)
    });
});

// Edit Form Process
router.put('/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .then(story => {
    let allowComments;

    if(req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    // New Values
    story.title = req.body.title;
    story.body = req.body.body;
    story.status = req.body.status;
    story.allowComments = allowComments;

    story.save()
      .then(story => {
          res.redirect('/dashboard');
      });
  });
});

// Delete Form Process
router.delete('/:id', (req, res) => {
  Story.deleteOne({
    _id: req.params.id
  }).then(() => {
    res.redirect(303, '/dashboard');
  });
});

// Add Comment
router.post('/comment/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
    .then(story => {
      const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
      }

      // Push to comments array
     story.comments.unshift(newComment);
     story.save()
      .then(story => {
        res.redirect(303, `/stories/show/${story._id}`);
      });
    });
});

module.exports = router;