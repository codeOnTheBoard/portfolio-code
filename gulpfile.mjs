import { src, dest, series, watch } from 'gulp';
import concat from 'gulp-concat';
import terser from 'gulp-terser';
import rigger from 'gulp-rigger';
import imageminPic from 'gulp-imagemin';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass'; // Исправленный импорт
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import stripCssComments from 'gulp-strip-css-comments';
import cleancss from 'gulp-clean-css';
import strip from 'gulp-strip-comments';
import newer from 'gulp-newer';
import { deleteAsync } from 'del';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import browserSync from 'browser-sync';
import avif from 'gulp-avif';
import webp from 'gulp-webp';
import svgSprite from 'gulp-svg-sprite';
import svgmin from 'gulp-svgmin';
import cheerio from 'gulp-cheerio';
import replace from 'gulp-replace';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';
import include from 'gulp-include';

// Устанавливаем компилятор Sass
const sass = gulpSass(dartSass);

export const pages = () => {
  return src('app/pages/*.html')
    .pipe(
      include({
        includePaths: 'app/components',
      })
    )
    .pipe(dest('app'))
    .pipe(browserSync.stream());
};

export const stylesColor = () => {
  return src([
    'app/scss/blue.scss',
    'app/scss/yellow.scss',
    'app/scss/pink.scss',
    'app/scss/orange.scss',
    'app/scss/green.scss',
  ])
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: 'Styles',
            message: err.message,
          };
        }),
      })
    )
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserlist: ['last 10 versions'],
        grid: true,
      })
    )
    .pipe(stripCssComments())
    .pipe(
      cleancss({
        level: { 2: { specialComments: 0 } },
        format: 'keep-breaks',
      })
    )
    .pipe(sourcemaps.write(''))
    .pipe(dest('app/css/'))
    .pipe(browserSync.stream());
};

export const styles = () => {
  return src(['app/scss/libs.scss', 'app/scss/main.scss'])
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: 'Styles',
            message: err.message,
          };
        }),
      })
    )
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('libs.css'))
    .pipe(rename('libs.min.css'))
    .pipe(
      autoprefixer({
        overrideBrowserlist: ['last 10 versions'],
        grid: true,
      })
    )
    .pipe(stripCssComments())
    .pipe(
      cleancss({
        level: { 2: { specialComments: 0 } },
        format: 'keep-breaks',
      })
    )
    .pipe(sourcemaps.write(''))
    .pipe(dest('app/css/'))
    .pipe(browserSync.stream());
};

export const browsersync = () => {
  browserSync.init({
    server: { baseDir: 'app/' },
    notify: false,
    online: false,
  });
};

export const scripts = () => {
  return src('app/libs/common.js')
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: 'Scripts',
            message: err.message,
          };
        }),
      })
    )
    .pipe(strip())
    .pipe(rigger())
    .pipe(concat('scripts.min.js'))
    .pipe(terser())
    .pipe(dest('app/js/'))
    .pipe(browserSync.stream());
};

export const picture = () => {
  return src(['app/img/src/*.*', '!app/img/src/*.svg'])
    .pipe(newer('app/img'))
    .pipe(avif({ quality: 50 }))
    .pipe(src('app/img/src/*.*'))
    .pipe(newer('app/img'))
    .pipe(webp())
    .pipe(src('app/img/src/*.*'))
    .pipe(newer('app/img'))
    .pipe(imageminPic())
    .pipe(dest('app/img'))
    .pipe(browserSync.stream());
};

export const sprite = () => {
  return src('app/img/sprite/*.svg')
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          $('[fill]').removeAttr('fill');
          $('[stroke]').removeAttr('stroke');
          $('[style]').removeAttr('style');
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(replace('&gt;', '>'))
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: '../sprite.svg',
            render: {
              scss: {
                dest: 'app/scss/_sprite.scss',
                template: 'app/scss/templates/_sprite_template.scss',
              },
            },
            example: true,
          },
        },
      })
    )
    .pipe(dest('app/img/'))
    .pipe(browserSync.stream());
};

export const fonts = () => {
  return src('app/fonts/src/*.*')
    .pipe(
      fonter({
        formats: ['woff', 'ttf'],
      })
    )
    .pipe(src('app/fonts/*.ttf'))
    .pipe(ttf2woff2())
    .pipe(dest('app/fonts'))
    .pipe(browserSync.stream());
};

export const cleaning = () => {
  return deleteAsync('dest/img/');
};

export const cleandest = () => {
  return deleteAsync('dest/**/*', { force: true });
};

export const startwatch = () => {
  browsersync();
  watch('app/fonts/src/*.*', fonts);
  watch('app/img/*.*', picture);
  watch('app/img/src/*.*', picture);
  watch(['app/components/*.*', 'app/pages/*.*'], pages);
  watch('app/img/favicon/*.*').on('change', browserSync.reload);
  watch('app/scss/**/*.scss', styles);
  watch('app/**/*.html').on('change', browserSync.reload);
  watch('app/**/*.php').on('change', browserSync.reload);
  watch('app/css/*.css').on('change', browserSync.reload);
  watch(['app/**/*.js', '!app/**/*.min.js'], scripts);
};

export const buildcopy = () => {
  return src(
    [
      'app/css/**/*.min.css',
      'app/js/**/*.min.js',
      'app/*.html',
      'app/*.php',
      'app/**/ht.access',
    ],
    { base: 'app' }
  ).pipe(dest('dest'));
};

export const build = series(
  cleandest,
  stylesColor,
  styles,
  scripts,
  picture,
  buildcopy
);

export default series(stylesColor, styles, startwatch);
