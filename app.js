const responseFactory = require("./src/util/ResponseFactory");
const config = require('./src/config/config');
const mongoose = require('mongoose');
const HTTPServer = require("./src/util/HTTPServer.js");
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const del = require('del');

let paths = {
    scripts: {
        built: "src/public/js/build",
        src: "src/client/js/*.js"
    }
}

var app = {};

// Configuration
app.config = config;

app.responseFactory = responseFactory;

// Check if user is signed in
app.loggedInMiddleware = (req, res, next) => {
    if (!req.user) return res.status(403).redirect('/signin');
    next();
}

// Make a new instance of our http server
app.httpServer = new HTTPServer(app);

app.server = require('http').createServer(app.httpServer.server);

// Connect to the database
mongoose.connect(config.database);

// Process JS for niceity of web browsers
gulp.task('scripts', ['clean'], (cb) => {
    console.log("Processing JavaScript...");
    let t = gulp.src(paths.scripts.src)
    t = t.pipe(babel({
        presets: ['es2015']
    }))
    if(!config.debug) t = t.pipe(uglify());
    t.pipe(gulp.dest(paths.scripts.built));
    console.log("Finished Processing JavaScript");
    return t;
});

// Rerun the task when a file changes 
gulp.task('watch', () => {
    gulp.watch(paths.scripts.src, ['scripts']);
});

gulp.task('default', ['watch', 'scripts']);
gulp.start(['watch', 'scripts'])

app.server.listen(config.port, config.onlyListenLocal ? "127.0.0.1" : null);