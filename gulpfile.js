var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    notify = require('gulp-notify'),
    bower = require('gulp-bower'),
    connect = require('gulp-connect'),
    merge = require('merge-stream'),
    del = require('del');

var path = {
  root: 'src',
  bower_dir: 'bower_components',
  vendor_dir: 'vendor',
  public: {
    fonts: 'public/fonts',
    css: 'public/css',
    js: 'public/js',
    root: 'public',
    vendor: 'public/vendor'
  }
};

gulp.task('connect', function () {
  return connect.server({
    root: path.public.root,
    livereload: true
  });
});

gulp.task('clean:public', function () {
  return del(path.public.root+'/**/*');
});

gulp.task('bower', function () {
  return bower()
  .pipe(gulp.dest(path.bower_dir));
});

gulp.task('icons', function () {
  var fontawesome = gulp.src(path.bower_dir + '/font-awesome/fonts/**.*')
  .pipe(gulp.dest(path.public.fonts));

  var bootstrap = gulp.src(path.bower_dir + '/bootstrap-sass/assets/fonts/bootstrap/**.*')
  .pipe(gulp.dest(path.public.fonts+'/bootstrap'));

  return merge(fontawesome, bootstrap);
});

gulp.task('css', function () { 
    var main = sass(path.root+'/style/style.scss', {
      loadPath: [
        path.bower_dir + '/bootstrap-sass/assets/stylesheets',
        path.bower_dir + '/font-awesome/scss'
       ]
     })
    .on("error", notify.onError(function (error) {
      return "Error: " + error.message;
    }))
    .pipe(gulp.dest(path.public.css))
    .pipe(connect.reload());

    var vendor = gulp.src(path.vendor_dir + '/**/*.css')
    .pipe(gulp.dest(path.public.vendor));

    return merge(main, vendor);
});

gulp.task('html', function () {
  return gulp.src(path.root + '/**/*.html')
  .pipe(gulp.dest(path.public.root))
  .pipe(connect.reload());
});

gulp.task('js', function () {
  var main = gulp.src(path.root + '/js/*.js')
  .pipe(gulp.dest(path.public.js))
  .pipe(connect.reload());

  var vendor = gulp.src(path.vendor_dir + '/**/*.js')
  .pipe(gulp.dest(path.public.vendor));

  return merge(main, vendor);
});

gulp.task('watch', function () {
  gulp.watch(path.root + '/**/*.scss', ['css']);
  gulp.watch(path.root + '/**/*.html', ['html']);
  gulp.watch(path.root + '/**/*.js', ['js']);
});

gulp.task('default', ['clean:public', 'connect', 'watch', 'bower', 'icons', 'css', 'html', 'js']);

gulp.task('build', ['bower', 'icons', 'css', 'html', 'js']);
