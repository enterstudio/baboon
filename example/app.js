'use strict';

var path = require('path');
var baboon = require('../lib/baboon')(path.join(__dirname));
var middleware = baboon.middleware;
var server = baboon.server;
var app = server.app;
var passport = require('passport');
//var GoogleStrategy = require('passport-google').Strategy;
//var GitHubStrategy = require('passport-github').Strategy;

///////////////////////////////////////////
// auth strategies
///////////////////////////////////////////

//passport.use(new GoogleStrategy({
//        returnURL: process.env.GOOGLE_RETURN_URL || "http://127.0.0.1:3000/auth/google/return",
//        realm: process.env.GOOGLE_REALM || "http://127.0.0.1:3000/"
//    },
//    function(identifier, profile, done) {
//        findOrCreate(identifier, profile, function(err, user) {
//
//            console.log('### identifier');
//            console.log(identifier);
//
//
//            console.log('### profile');
//            console.log(profile);
//            done(err, user);
//        });
//    }
//));
//
//passport.use(new GitHubStrategy({
//        clientID: 'e255d4c484d293e40e05',
//        clientSecret: 'c939429366715b49000c95bab6f0bdb4fe10c7be',
//        callbackURL: "http://127.0.0.1:3000/auth/github/callback"
//    },
//    function(accessToken, refreshToken, profile, done) {
//        findOrCreate({accessToken:accessToken, refreshToken:refreshToken}, profile, function(err, user) {
//            console.log('### accessTocken');
//            console.log(accessToken);
//
//            console.log('### refreshToken');
//            console.log(refreshToken);
//
//            console.log('### profile');
//            console.log(profile);
//            done(err, user);
//        });
//    }
//));

///////////////////////////////////////////
// routes config
///////////////////////////////////////////

//app.get('/auth/google', passport.authenticate('google'));
//app.get('/auth/google/return', passport.authenticate('google', { session:false }),
//    function(req, res) {
//
//        req.session.regenerate(function () {
//            // set user
//            req.session.user = req.user;
//            delete req.user;
//
//            // set time for activity checking
//            req.session.activity = new Date();
//            req.session.start = new Date();
//
//            // set user language in session
//            if (user.language) {
//                req.session.language = user.language;
//            }
//
//            // login successfully
//            res.redirect('/');
//        });
//    });
//
//app.get('/auth/github', passport.authenticate('github'));
//app.get('/auth/github/callback', passport.authenticate('github', { session:false }),
//    function(req, res) {
//
//        req.session.regenerate(function () {
//            // set user
//            req.session.user = req.user;
//            delete req.user;
//
//            // set time for activity checking
//            req.session.activity = new Date();
//            req.session.start = new Date();
//
//            // set user language in session
//            if (user.language) {
//                req.session.language = user.language;
//            }
//
//            // login successfully
//            res.redirect('/');
//        });
//    });


// toplevel uiExamples route
app.get('/ui', function (req, res) {
    middleware.session.checkSession(req, res, function () {
        middleware.context.index(req, res);
        res.render('uiExamples/index');
    });
});

// toplevel uiExamples catch all route
app.get('/ui/*', function (req, res) {
    middleware.session.checkSession(req, res, function () {
        middleware.context.index(req, res);
        res.render('uiExamples/index');
    });
});

// toplevel admin routes
app.get('/admin', function (req, res) {
    middleware.session.checkSession(req, res, function () {
        middleware.context.index(req, res);

        if (baboon.rights.userHasAccessTo(req.session.user, 'baboon/admin/user/create')) {
            res.render('admin/index');
        } else {
            res.render('index');
        }
    });
});

// toplevel admin catch all route
app.get('/admin/*', function (req, res) {
    middleware.session.checkSession(req, res, function () {
        middleware.context.index(req, res);

        if (baboon.rights.userHasAccessTo(req.session.user, 'baboon/admin/user/create')) {
            res.render('admin/index');
        } else {
            res.render('index');
        }
    });
});

///////////////////////////////////////////
// start server
///////////////////////////////////////////

baboon.server.start();