(function ($, root) {

    function AudioManager() {
        this.audio = new Audio();  //创建一个audio对象
        this.status = 'pause';     //audio默认状态
    }

    AudioManager.prototype = {
        //播放
        play() {
            this.audio.play();
            this.status = 'play';
        },
        
        //暂停
        pause() {
            this.audio.pause();
            this.status = 'pause';
        },

        //获取歌曲及加载
        getAudio(src) {
            this.audio.src = src;
            this.audio.load();
        },

        //指定播放进度
        playTo(time) {
            this.audio.currentTime = time
        }
    }

    root.audioManager = new AudioManager();

}(window.Zepto, window.player || (window.player = {})))