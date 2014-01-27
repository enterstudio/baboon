'use strict';

// Module dependencies.
var path = require('path');
var express = require('express');

var rootPath = __dirname;
var baboon = require('../lib/baboon')(rootPath);
var app = express();
var api = require('./server/routes/api');
var index = require('./server/routes');

var oneMonth = 2592000000;
var loggers = baboon.loggers;
var config = baboon.config;

app.configure('development', function () {

    // Enable livereload
    if (config.livereload) {
        app.use(require('connect-livereload')());
    }

    // Disable caching of scripts for easier testing
    app.use(function noCache(req, res, next) {

        if (req.url.indexOf('/assets/') === -1 && req.url.indexOf('/api/') === -1) {
            res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.header('Pragma', 'no-cache');
            res.header('Expires', 0);
        }
        next();
    });

    app.use(baboon.getConnectLogger(loggers.express));
    app.use(express.static(path.join(rootPath, '.tmp')));
    app.use(express.static(path.join(rootPath, 'client')));
    app.set('views', rootPath + '/.tmp/views');
});
app.configure('production', function () {
    app.use(express.compress());

    // Disable caching for rest api
    app.use(function noCache(req, res, next) {

        if (req.url.indexOf('/api/') === 0) {
            res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.header('Pragma', 'no-cache');
            res.header('Expires', 0);
        }
        next();
    });

    app.use(baboon.getConnectLogger(loggers.express));
    app.use(express.favicon(path.join(rootPath, 'server', 'public', 'favicon.ico'), {maxAge:oneMonth}));
    app.use(express.static(path.join(rootPath, 'server', 'public'), {maxAge:oneMonth}));
    app.set('views', rootPath + '/server/views');
});

app.configure(function () {
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(baboon.errorHandler);
});

// Api Routes
app.get('/api/awesomeThings', api.awesomeThings);
app.get('/api/ssl/awesomeThings', api.awesomeThings);

// Toplevel Routes
app.get('/admin', index.admin);
app.get('/projects/project1', index.projects);

// Angular Routes
app.get('/*.html', index.partials);
app.get('/*', index.index);

// Start server
baboon.serverListen(app);

// Expose app
var exports;
exports = module.exports = app;