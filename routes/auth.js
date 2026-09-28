
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, getMe, updateProfile, googleCallback, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Local Auth
router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);

// Protected Routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);


router.get('/google',
  passport.authenticate('google', {
    scope: [
      'profile', 
      'email', 
      'https://www.googleapis.com/auth/fitness.activity.read',
      'https://www.googleapis.com/auth/fitness.body.read',    
      'https://www.googleapis.com/auth/fitness.sleep.read',    


  
    ],
    accessType: 'offline', 
    prompt: 'consent',    
  })
);

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed`,
    session: false,
  }),
  googleCallback
);

module.exports = router;