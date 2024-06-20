import gulp from 'gulp';
const { series, parallel, src, dest, task, watch } = gulp;
import autoprefixer from 'gulp-autoprefixer';
import changed from 'gulp-changed';
import cssimport from 'gulp-cssimport';
import cleancss from 'gulp-clean-css';
import { deleteSync } from 'del';
import gulpif from 'gulp-if';
import imagemin, {svgo} from 'gulp-imagemin';
import plumber from 'gulp-plumber';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import sourcemaps from 'gulp-sourcemaps';
import stripdebug from 'gulp-strip-debug';
import uglify from 'gulp-uglify';
import through2 from 'through2';
import rollup from 'gulp-best-rollup-2';

import { nodeResolve } from "@rollup/plugin-node-resolve";
import { default as commonjs } from "@rollup/plugin-commonjs";

// load paths
const paths = {
    "styles": {
        "src": "src/scss",
        "filter": "/**/*.+(scss)",
        "dist": "dist/css",
        "distfilter": "/**/*.+(css|map)"
    },

    "scripts": {
        "src": "src/javascript",
        "filter": "/*.+(js)",
        "dist": "dist/javascript",
        "distfilter": "/**/*.+(js|map)"
    },

    "svgs": {
        "src": "src/images",
        "filter": "/**/*.+(svg)",
        "dist": "dist/images"
    },
};

const sassOptions = {
    errLogToConsole: true,
    outputStyle: 'compressed'
};

const autoprefixerOptions = {
    cascade: false,
    supports: false
};

var debugEnabled = false;

function styles(cb) {
    src(paths.styles.src + paths.styles.filter)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sourcemaps.init())
        .pipe(cssimport({matchPattern: "*.css"}))
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(cleancss({
            level: {
                1: {
                    normalizeUrls: false
                },
                2: {
                    restructureRules: true
                }
            }
        }))
        .pipe(sourcemaps.write('.', {
            sourceMappingURLPrefix: paths.themedir + '/' + paths.styles.dist
        }))
        .pipe( through2.obj( function( file, enc, cb ) {
            var date = new Date();
            file.stat.atime = date;
            file.stat.mtime = date;
            cb( null, file );
        }))
        .pipe(dest(paths.styles.dist));
    cb();
}

function scripts(cb) {
    src(paths.scripts.src + paths.scripts.filter)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sourcemaps.init())
        .pipe(rollup({ plugins: [
                nodeResolve({
                    browser: true
                }),
                commonjs(),
            ] }, 'iife'))
        .pipe(
            gulpif(
                !debugEnabled,
                stripdebug()
            )
        )
        .pipe(uglify({mangle: false}))
        .pipe(sourcemaps.write('.', {
            sourceMappingURLPrefix: paths.themedir + '/' + paths.scripts.dist
        }))
        .pipe( through2.obj( function( file, enc, cb ) {
            var date = new Date();
            file.stat.atime = date;
            file.stat.mtime = date;
            cb( null, file );
        }))
        .pipe(dest(paths.scripts.dist));
    cb();
}

function svgs(cb) {
    src(paths.svgs.src + paths.svgs.filter)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(changed(paths.svgs.dist))
        .pipe(imagemin(
            [
                svgo({
                    plugins: [
                        {name: 'removeViewBox', active: false},
                        {name: 'removeUselessStrokeAndFill', active: false},
                        {name: 'cleanupIDs', active: false},
                        {name: 'removeUselessDefs', active: false}
                    ]
                })
            ],
            {
                verbose: true
            }
        ))
        .pipe(dest(paths.svgs.dist));
    cb();
}

function cleanscripts(cb) {
    deleteSync([
        paths.scripts.dist + paths.scripts.distfilter
    ]);
    cb();
}

function cleanstyles(cb) {
    deleteSync([
        paths.styles.dist + paths.styles.distfilter
    ]);
    cb();
}

function cleansvgs(cb) {
    deleteSync([
        paths.svgs.dist + paths.svgs.filter
    ]);
    cb();
}

function watchAll() {
    // watch for style changes
    watch(paths.styles.src + paths.styles.filter, series(cleanstyles, styles));
    // watch for script changes
    watch(paths.scripts.src + "/**/*.+(js)", series(cleanscripts, scripts));
    // watch for svg changes
    watch(paths.svgs.src + paths.svgs.filter, series(cleansvgs, svgs));
}

function enableDebug(cb) {
    debugEnabled = true;
    cb();
}

function onError(err) {
    console.log(err);
}

task('clean', series(
    parallel(
        cleanstyles,
        cleanscripts,
        cleansvgs
    )
));

task('build', series(
    parallel(
        cleanstyles,
        cleanscripts,
        cleansvgs
    ),
    parallel(
        styles,
        scripts,
        svgs
    )
));

task('css', series(
    cleanstyles,
    styles
));

task('js', series(
    cleanscripts,
    scripts
));

task('svgs', series(
    cleansvgs,
    svgs
));

task('default', series(
    parallel(
        cleanstyles,
        cleanscripts,
        cleansvgs
    ),
    parallel(
        styles,
        scripts,
        svgs
    ),
    watchAll
));

task('debug', series(
    enableDebug,
    parallel(
        cleanstyles,
        cleanscripts,
        cleansvgs
    ),
    parallel(
        styles,
        scripts,
        svgs
    ),
    watchAll
));
