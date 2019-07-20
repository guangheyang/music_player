var gulp = require('gulp')

var htmlClean = require('gulp-htmlclean')       //压缩 html
var imageMin  = require('gulp-imagemin')        //打包图片
var babel     = require('gulp-babel')           //处理 ES6
var uglify    = require('gulp-uglify')          //压缩 js
var debug     = require('gulp-strip-debug')     //去掉调试信息(如:console.log()等)
var less      = require('gulp-less')            //将 less转化为 css
var cssClean  = require('gulp-clean-css')       //压缩 css
var connect   = require('gulp-connect')         //开启本地服务器代理

///判断当前环境  默认不等,不压缩,以便调试
var devMod = process.env.NODE_ENV == 'production'

//设置当前环境  为 production则压缩
// export NODE_ENV=production    // 需要 node环境

var folder = {
    src: 'src/',
    dist: 'dist/'
}

gulp.task('html', function (){
    var page = gulp.src(folder.src + 'html/*')
        .pipe(connect.reload())                 //页面自动刷新
        if(devMod){
            page.pipe(htmlClean())             //生产环境才压缩,css/js配置类似
        }
        page.pipe(gulp.dest(folder.dist + 'html/'))
})

gulp.task('js', function (){
    var page = gulp.src(folder.src + 'js/*')
        .pipe(connect.reload())
        if(devMod){
            page.pipe(debug())
                .pipe(babel())
                .pipe(uglify())
        }
        page.pipe(gulp.dest(folder.dist + 'js/'))
})

gulp.task('css', function (){
    var page = gulp.src(folder.src + 'css/*')
        .pipe(connect.reload())
            .pipe(less())
        if(devMod){
            page.pipe(cssClean())
        }
        page.pipe(gulp.dest(folder.dist + 'css/'))
})

gulp.task('image', function (){
    gulp.src(folder.src + 'image/*')
        .pipe(imageMin())    
        .pipe(gulp.dest(folder.dist + 'image/'))
})

gulp.task('server', function (){
    connect.server({
        port: 8888,             // 端口号
        livereload: true,       // 开启热加载
        //root: './dist'          // 让dist为服务器根目录
    })
})

//开启监听
//监听指定目录下的文件, 再次执行对应的任务
gulp.task('watch', function (){
    gulp.watch(folder.src + 'html/*', ['html'])
    gulp.watch(folder.src + 'js/*', ['js'])
    gulp.watch(folder.src + 'css/*', ['css'])
})

// 执行guulp指令时, 默认执行后面的任务
gulp.task('default', ['html', 'js', 'css', 'image', 'server', 'watch'])

//gulp.src

//gulp.dest

//gulp.task

//gulp.watch
