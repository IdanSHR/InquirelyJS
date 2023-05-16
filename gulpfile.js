const gulp = require("gulp");
const ts = require("gulp-typescript");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");

// Compile TypeScript files to JavaScript
function compileTS() {
    const tsProject = ts.createProject("tsconfig.json");
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist/js"));
}

// Minify JavaScript files
function minifyJS() {
    return gulp
        .src("dist/js/Survey.js")
        .pipe(rename({ suffix: ".min" }))
        .pipe(uglify())
        .pipe(gulp.dest("dist/js"));
}

function compileSass() {
    return gulp
        .src("src/*.scss") // Path to your SCSS files
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("dist/css")); // Output directory for compiled CSS
}

// Watch for changes in TypeScript files
function watchTS() {
    gulp.watch("./src/*.ts", compileTS);
    gulp.watch("./src/*.ts", minifyJS);
    gulp.watch("src/*.scss", compileSass);
}

// Define gulp tasks
gulp.task("compile", compileTS);
gulp.task("minify", minifyJS);
gulp.task("watch", watchTS);
gulp.task("default", gulp.series("compile", "minify"));
