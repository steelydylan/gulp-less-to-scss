gulp-less-to-scss
=======
A gulp plugin convert less files to scss files

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
This plugin cannot handle with 'when' statement.

LICENSE
-------

(MIT License)

Copyright (c) 2014 [horicdesign](http://horicdesign.com)