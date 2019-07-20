(function ($, root) {
    var duration = 0,
        frameId = null,
        startTime = 0,
        lastPer = 0;

    // 渲染歌曲时间(总)
    function renderAllTime(time) {
        duration = time
        time = formatTime(time);
        // 切换歌曲时,初始化时间
        lastPer = 0;
        $('.all-time').html(time);
    }

    // 秒 -> 分
    function formatTime(t) {
        t = Math.round(t);    
        var m = Math.floor(t / 60);     //分
        var s = t - m * 60;             //秒
        
        // 两位数处理
        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }
        return m + ':' + s;
    }

    // 播放时间渲染(从参数 p或 lastPer时刻开始)
    function start(p) {
        lastPer = p === undefined ? lastPer : p;
        startTime = new Date().getTime();

        function frame() {
            var curTime = new Date().getTime();
            var per = lastPer + (curTime - startTime) / (duration * 1000);
            
            update(per)
            cancelAnimationFrame(frameId);          //防止动画叠加
            frameId = requestAnimationFrame(frame)
        }
        frame()
    }

    // 播放时间 及进度条更新
    function update(per) {
        var curTime = per * duration;
        var translate = (per - 1) * 100 + '%'
        
        curTime = formatTime(curTime);
        $('.cur-time').html(curTime);
        $('.pro-top').css({
            transform: 'translateX(' + translate + ')'
        })
    }

    // 播放时间 及进度条停止
    function stop() {
        cancelAnimationFrame(frameId);
        var curTime = new Date().getTime();
        var per = (curTime - startTime) / (duration * 1000);
        lastPer += per;
    }

    root.pro = {
        renderAllTime,
        start,
        stop,
        update
    }

}(window.Zepto, window.player || (window.player = {})))