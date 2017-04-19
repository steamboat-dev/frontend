const DiscordStrategy = require('passport-discord').Strategy

// Get user model
const User = require('../shared/schema/user');
const config = require('../config/config');

module.exports = function(passport) {
    var opts = {};

    // Called by all OAuth providers. Logs user in and creates account in the database if it doesn't exist already
    function OAuthLogin(prefix, name, id, done) {
        User.findOne({ OAuthID: prefix + "_" + id }, function(err, user) {
            if(err) return done(err, false);
            if(user) {
                if(user.isOauth !== true) return done(null, false, { error: { message: "Incorrect username or password provided.", code: "invalid_credentials" } });
                return done(null, user);
            }
            // Even though we don't use the password field, it's better to set it to *SOMETHING* unique
            User.register(prefix + "_" + id + "-" + Math.floor(Math.random() * 1000000), prefix + "_" + id, function(user, error) {
                if(!user) return done(null, false, error);
                done(null, user);
            }, prefix + "_" + id, name);
        });
    }

    passport.use(new DiscordStrategy({
        clientID: config.oauth.discord.clientID,
        clientSecret: config.oauth.discord.clientSecret,
        callbackURL: config.host + "/auth/discord/callback",
        scope: ["identify"]
    }, function(accessToken, refreshToken, profile, done) {
        OAuthLogin("discord", profile.username, profile.id, done);
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(user, done) {
        User.findById(user, (err, user) => done(err, user));
    });
}