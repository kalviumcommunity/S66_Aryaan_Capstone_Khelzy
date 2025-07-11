const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { UserModel } = require('../models/user.model');
require('dotenv').config();

const PORT  = process.env.PORT

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production'
        ? `${process.env.SERVER_URL}/auth/google/callback`  // Changed from onrender.com
        : `http://localhost:${PORT}/auth/google/callback`,  // Changed to use localhost
    proxy: true
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await UserModel.findOne({ 
            $or: [
                { googleId: profile.id },
                { email: profile.emails[0].value }
            ]
        });
        
        if (user) {
            // Update existing user's Google ID if they signed up with email first
            if (!user.googleId) {
                user.googleId = profile.id;
                user.profilePicture = profile.photos[0].value;
                await user.save();
            }
        } else {
            // Create new user if doesn't exist
            user = await UserModel.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                password: null,
                profilePicture: profile.photos[0].value,
                verified: true // Google users are automatically verified
            });
        }
        
        // Update your OAuth success callback to use first-party cookie settings
        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax', // Changed from 'none' to 'lax' for first-party
          path: '/',
          maxAge: 8 * 60 * 60 * 1000 // 8 hours
        };

        const refreshCookieOptions = {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        // Set cookies with first-party settings
        res.cookie('token', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, refreshCookieOptions);
        
        return done(null, user);
    } catch (error) {
        console.error('Google Auth Error:', error);
        return done(error, null);
    }
}));

module.exports = passport;