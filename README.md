gulp-less-to-scss
=======
A gulp plugin which converts less files to scss files

Download
-------

```
npm install gulp-less-to-scss
```


Usage
-------

```javascript
var lessToScss = require('gulp-less-to-scss');
gulp.task('lessToScss',function(){
    gulp.src('themes/system/less/*.less')
		.pipe(lessToScss())
		.pipe(gulp.dest('themes/system/scss'));
});
```

Notice
-------
Be Aware that not all less files can be converted properly.

If files are not converted well, you should correct them manually!!

LICENSE
-------

(MIT License)

Copyright (c) 2014 [horicdesign](http://horicdesign.com)
