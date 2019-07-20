((function ($, root) {

    // 歌曲索引
    function Control(len) {
        this.index = 0;
        this.len = len;
    }

    Control.prototype = {
        prev() {
            return this.getIndex(-1);                    // 前一首
        },
        next() {
            return this.getIndex(1);                     // 后一首
        },
        // 歌曲索引计算
        getIndex(val) {
            var index = this.index,                      // 当前对应索引
                len = this.len,                          // 数据总长度
                curIndex = (index + val + len) % len;
            this.index = curIndex;                       // 改变后的索引
            return curIndex;
        }
    }

    root.controlIndex = Control;

})(window.Zepto, window.player || (window.player = {})))