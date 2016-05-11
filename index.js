var through  = require('through2');
var gutil = require('gulp-util');
var ext   = gutil.replaceExtension;

module.exports = function(){
	var lessToScss = function (file,enc,cb){
		var content = file.contents.toString();
		//import先をlessからscssに
		content = content.replace(/\/less\//g, '/scss/')
		.replace(/\.less/g, '.scss')
		//@を$に変換
		.replace(/@/g, '$')
		//argbを除去
		.replace(/\%\((.*?)\);/g,function(all){
			var arr = all.match(/argb\(.*?\)/g);
			if(arr instanceof Array){
				for(var i = 0,n = arr.length; i < n; i++){
					arr[i] = arr[i].replace(/argb\(\$(.*?)\)/g,"${$1}");
				}
			}
			all = all.replace(/,argb\(.*?\)/g,"");
			var i = -1;
			all = all.replace(/\%d/g,function(al){
				i++;
				return arr[i];
			});
			all = all.replace(/\%/,'');
			return all;				         	
		})
		.replace(/ e\(/g, ' unquote(')
		//@mixinの定義
		.replace(/\.([\w\-]*)\s*\((.*)\)\s*\{/g, '@mixin $1($2){')
		.replace(/@mixin\s*([\w\-]*)\s*\((.*)\)\s*\{\s*\}/g, '// @mixin $1($2){}')
		.replace(/@mixin\s*([\w\-]*)\s*\((.*);(.*)\)/g,function(all){
			all = all.replace(/;/g,',');
			return all;
		})
		//@includeの設定
		.replace(/(\s)\.(hook[a-zA-Z\-\d]+);/g, '$1@include $2();')
		.replace(/(\s)\.([\w\-]*)\s*\((.*)\);*/g,'$1@include $2($3);')
		.replace(/(\s)\.([^\d\s\"]+);/g,'$1@include $2;')
		//@includeの引き数の分割を;から,に
		.replace(/@include\s*([\w\-]*)\s*\((.*);(.*)\)/g,function(all){
			all = all.replace(/;/g,',');
			return all;
		})
		//@includeにおける!importantの位置
		.replace(/\).*?;!important/," !important)")
		.replace(/\$(import|charset|media|font-face|page[\s:]|-ms-viewport|keyframes|-webkit-keyframes|-moz-keyframes|-o-keyframes|-moz-document)/g, '@$1')
		.replace(/\$\{/g, '#{$')
		.replace(/~("[^"]+")/g, 'unquote($1)')
		//extend定義
		.replace(/&:extend\((.*?)\)/g,"@extend $1")
		.replace(/@extend\s*(.*?)\s*?all;/g,"@extend $1;")
		//spin関数をadjust-hueに変換
		.replace(/spin/g,'adjust-hue')
		//~を除去
		.replace(/~(\s*['"])/g,'$1')
		//&が単語にくっついていたら話す
		.replace(/(.[\w\-]*?)&/g,"$1 &")
		//namespaceを定義
		.replace(/#([\w\-]*)\s*\{([^\}]*@mixin[\s\S]*)\}/g,function(all,$1,$2){
			all = all.replace(/#[\w\-]*\s*\{([^\}]*@mixin[\s\S]*)\}/,"$1");
			all = all.replace(/@mixin\s*([\w\-]*)/g,"@mixin "+$1+"_$1");
			return all;
		})
		//namespaceをinclude
		.replace(/#([\w\-]*)\s*>\s@include\s([\w\-]*)\((.*)\);/g,"@include $1_$2($3);")
		file.contents = new Buffer(content);
		file.path = ext(file.path, '.scss'); 
		this.push(file);
		cb();        
	} 
	return through.obj(lessToScss)
}