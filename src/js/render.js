// img + info + btn 渲染
(function ($, root) {

    function renderInfo(info) {
        var str = `
            <div class="song-name">${info.song}</div>
            <div class="singer-name">${info.singer}</div>
            <div class="album-name">${info.album}</div>
        `
        $('.song-info').html(str);
    }

    function renderImg(src) {
        var img = new Image();
        img.src = src;
        img.onload = () => {
            $('.img-box img').attr('src', src);
            root.blurImg(img, $('body'));
        }
    }

    function renderIsLike(like) {
        if (like) {
            $('.like').addClass('liking');
        } else {
            $('.like').removeClass('liking');
        }
    }

    // 同时渲染 信息/ 图片/ isLike
    root.render = function (data) {
        renderImg(data.image);
        renderInfo(data);
        renderIsLike(data.isLike);
    }

}(window.Zepto, window.player || (window.player = {})))