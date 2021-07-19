import Vue from "vue";

function debounce(fn, wait) {
  let timer = null;
  //此处返回的是一个函数
  return function() {
    //之后多次点击，这里的timer是上次执行所生成的timer，不为null
    if (timer !== null) {
      //把定时器清空
      clearTimeout(timer);
    }
    //重新开始计时
    timer = setTimeout(fn, wait);
  };
}

// v-loadmore: 用于在element-ui的select下拉框加上滚动到底事件监听
Vue.directive("loadmore", {
  bind(el, binding) {
    // 获取element-ui定义好的scroll盒子
    const SELECTWRAP_DOM = el.querySelector(
      ".el-select-dropdown .el-scrollbar__wrap"
    );

    SELECTWRAP_DOM.addEventListener(
      "scroll",
      debounce(function() {
        /*
         * scrollHeight 获取元素内容高度(只读)
         * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
         * clientHeight 读取元素的可见高度(只读)
         * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
         * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
         */
        const CONDITION =
          SELECTWRAP_DOM.scrollHeight - SELECTWRAP_DOM.scrollTop <=
          SELECTWRAP_DOM.clientHeight + 5;
        if (CONDITION) {
          binding.value();
        }
      }, 100).bind(SELECTWRAP_DOM)
    );
  }
});

//input输入框远程搜索时添加滚动分页加载后台数据
Vue.directive("inputloadmore", {
  bind(el, binding) {
    // 获取element-ui定义好的scroll盒子
    const SELECTWRAP_DOM = el.querySelector(
      ".el-autocomplete-suggestion .el-autocomplete-suggestion__wrap"
    );
    SELECTWRAP_DOM.addEventListener("scroll", function() {
      const CONDITION =
        this.scrollHeight - this.scrollTop <= this.clientHeight + 5;
      if (CONDITION) {
        binding.value();
      }
    });
  }
});
