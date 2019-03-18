"use strict";



var gulp = require('gulp'),
    clean = require('gulp-clean'),
    runSequence = require('run-sequence'),
    replace = require('gulp-replace');

// gulp.task('buildJs', function () {
//     var src = "./libs/**",
//         dest = "./build";

//     return gulp.src(src)
//         .pipe(gulp.dest(dest))
//         .pipe(uglify())
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest(dest));
// });


gulp.task('buildResources', function () {
    var resourses = ["fonts", "images", "scripts", "themes", "webfonts"];
    resourses.forEach(folder => gulp.src("src/" + folder + "/**").pipe(gulp.dest("./build/" + folder)));
});

gulp.task('buildHtml', function () {
    var job = gulp.src("./src/*.html");
    var stamp = new Date().getTime();
    job.pipe(replace(/\.js/g, ".js?v=" + stamp))
        .pipe(gulp.dest("./build"));
});

gulp.task('clean', function () {
    return gulp.src(["./build"], {
        read: false
    }).pipe(clean());
});
gulp.task('default', function () {
    runSequence("clean", "buildResources", "buildHtml");
});