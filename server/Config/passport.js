const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { UserModel } = require('../models/user.model');
require('dotenv').config();



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
    callbackURL: process.env.SERVER_URL,
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
        
        return done(null, user);
    } catch (error) {
        console.error('Google Auth Error:', error);
        return done(error, null);
    }
}));

module.exports = passport;