var root  = window.player,      // 主接口
    len   = 0,                  // 数据长度
    audio = root.audioManager,  // 播放器对象
    myPro   = root.pro,         // 进度条接口对象
    timer = null,               // 定时器
    control,                    // 歌曲索引控制
    duration,                   // 歌曲总时间(秒)
    dataList;                   // data(外部)

// 数据获取
function getData(url) {
    $.ajax({
        type: 'GET',
        url,
        success(data) {
            // data = JSON.parse(data)          //hubuilder 打包时需要此处理
            var dat = data[0];
            dataList = data;
            len = data.length;
            
            //初始化
            control = new root.controlIndex(len);
            watchList(data, len);
            root.render(dat);
            audio.getAudio(dat.audio);
            myPro.renderAllTime(dat.duration)
            duration = dat.duration
            bindEvent();
            bindTouch()
        }
    })
}
// 事件绑定
function bindEvent() {
    //自定义事件(切换到第 index首歌)
    $('body').on('playChange', (e, index) => {
        root.render(dataList[index]);
        audio.getAudio(dataList[index].audio);
        myPro.renderAllTime(dataList[index].duration);
        duration = dataList[index].duration;
        if (audio.status == 'play') {
            //播放时切歌
            audio.play();
            myPro.start(0);
            rotated(0);
        } else {
            //暂停时切歌
            myPro.update(0)
        }
        $('.img-box').attr('data-deg', 0)
        $('.img-box').css({
            'transform': 'rotateZ(0deg)',
            'transition': 'none'
        })
    })

    // 上一首
    $('.prev').on('click', () => {
        var i = control.prev();
        $('body').trigger('playChange', i);
    })

    // 下一首
    $('.next').on('click', () => {
        var i = control.next();
        $('body').trigger('playChange', i)
    })

    // 播放按钮点击
    $('.play').on('click', () => {
        if (audio.status == 'pause') {
            var deg = $('.img-box').attr('data-deg')
            rotated(deg);
            myPro.start();
            audio.play();
        } else {
            clearInterval(timer)
            audio.pause();
            myPro.stop();
        }
        $('.play').toggleClass('playing');
    })

    // 列表样式切换
    function myToggle (arr) {
        $(arr[0]).toggleClass(arr[1]);
        $(arr[2]).toggleClass(arr[3]);
    }

    // 显示/隐藏列表
    $('.list').on('click', () => {
        myToggle(['.control', 'hide', '.song-list', 'see'])
        
        // 隐藏列表 (点击除歌曲列表以外的部分)  
        $('.song-info, .song-img').one('click', () => {
            myToggle(['.control', 'hide', '.song-list', 'see'])
            $('.song-info, .song-img').off('click');
        })

    })

    // 列表切歌
    $('.song-list ul').on('click', 'li, span, div', e => {
        var sIndex = $(e.target).attr('data-index');
        myToggle(['.control', 'hide', '.song-list', 'see']);
        audio.status = 'play';
        $('.play').addClass('playing');
        $('body').trigger('playChange', sIndex);
        $('.song-info, .song-img').off('click');
    })

    // 点击喜欢
    $('.like').on('click', () => {
        $('.like').toggleClass('liking');
    })
}

// 进度条移动端事件
function bindTouch() {
    var left = $('.pro-bottom').offset().left;
    var width = $('.pro-bottom').offset().width;

    // 进度条小圆点
    $('.spot').on('touchtart', e => {
        myPro.stop()
    }).on('touchmove', e => {
        var x = e.changedTouches[0].clientX - left;
        var per = x / width;
        if (per >= 0 && per < 1) {
            myPro.update(per)
        }
    }).on('touchend', e => {
        var x = e.changedTouches[0].clientX - left;
        var per = x / width;
        var curTime = per * duration;
        if (per >= 0 && per < 1) {
            audio.playTo(curTime);
            myPro.start(per);
            audio.play();
            $('.play').addClass('playing');
        }
    })
}

// 歌曲播放完,让其触发点击事件,自动播放下一曲
$(audio.audio).on('ended', () => {
    $('.next').trigger('click')
})

// 歌曲列表渲染
function watchList(arr, lien){
    arr.forEach((ele, index) => {
        console.log(ele.song, ele.singer, index)
        var str = `
            <li data-index=${index}>
                <div data-index=${index}>${ele.song}</div>
                <span data-index=${index}>` + '---' + `${ele.singer}</span>    
            </li>`
        $('.song-list ul').append(str);
    })
}

// 封面旋转
function rotated(deg) {
    clearInterval(timer)
    timer = setInterval(() => {
        deg = +deg
        deg += 2;
        $('.img-box').attr('data-deg', deg)
        $('.img-box').css({
            'transform': 'rotateZ(' + deg + 'deg)',
            'transition': '1s all ease-out'
        })
    }, 160)
}

getData('/mock/data.json')
