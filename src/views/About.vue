<template>
  <!-- 瀑布流 -->
  <div class="main">
    <div class="box">
      <div style="height:300px">1</div>
    </div>
    <div class="box">
      <div style="height:100px">2</div>
    </div>
    <div class="box">
      <div style="height:200px">3</div>
    </div>
    <div class="box">
      <div style="height:200px">4</div>
    </div>
    <div class="box">
      <div style="height:300px">5</div>
    </div>
    <div class="box">
      <div style="height:100px">6</div>
    </div>
    <div class="box">
      <div style="height:300px">7</div>
    </div>
    <div class="box">
      <div style="height:100px">8</div>
    </div>
    <div class="box">
      <div style="height:300px">9</div>
    </div>
    <div class="box">
      <div style="height:100px">10</div>
    </div>
    <div class="box">
      <div style="height:300px">11</div>
    </div>
    <div class="box">
      <div style="height:100px">12</div>
    </div>
    <div class="box">
      <div style="height:300px">13</div>
    </div>
    <div class="box">
      <div style="height:100px">14</div>
    </div>
    <div class="box">
      <div style="height:300px">15</div>
    </div>
    <div class="box">
      <div style="height:100px">16</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    // 页面加载完成调用一次。
    this.fall();
    // 页面尺寸发生改变再次调用。
    window.onresize = this.fall;
  },
  methods: {
    // 定义瀑布流算法函数
    fall() {
      const minGap = 20; // 最小间距，让每一列的最小空隙可以自定义，避免太过拥挤的情况发生。但是，会通过计算得到真实的间距。
      const itemWidth = 300; // 每一项的宽度，即当前每一个图片容器的宽度。保证每一列都是等宽不等高的。
      const scrollBarWidth = this.getScrollbarWidth(); // 获取滚动条的宽度
      const pageWidth = window.innerWidth - scrollBarWidth; // 获取当前页面的宽度 = window.innerWidth - 滚动条的宽度
      const column = Math.floor(pageWidth / (itemWidth + minGap)); // 实际列数=页面宽度/(图片宽度+最小间距)
      const gap = (pageWidth - itemWidth * column) / column / 2; // 计算真实间距 = (页面宽度- 图片宽度*实际列数)/实际列数/2
      const items = document.querySelectorAll(".box"); // 获取所有的外层元素
      const heightArr = []; // 定义一个空数组，保存最低高度。

      for (let i = 0; i < items.length; i++) {
        // 遍历所有的外层容器
        const height = items[i].offsetHeight;
        // 如果当前处在第一行
        if (i < column) {
          // 直接设置元素距离上部的位置和距离左边的距离。
          items[i].style.cssText = `top: ${gap}px;left: ${(itemWidth + gap) *
            i +
            gap}px`;
          // 保存当前元素的高度。
          heightArr.push(height);
        } else {
          // 不是第一行的话，就进行比对。
          let minHeight = heightArr[0]; // 先保存第一项的高度
          let minIndex = 0; // 保存第一项的索引值
          for (let j = 0; j < heightArr.length; j++) {
            // 通过循环遍历比对，拿到最小值和最小值的索引。
            if (minHeight > heightArr[j]) {
              minHeight = heightArr[j];
              minIndex = j;
            }
          }
          // 通过最小值为当前元素设置top值，通过索引为当前元素设置left值。
          items[i].style.cssText = `top: ${minHeight +
            gap * 2}px; left: ${(itemWidth + gap) * minIndex + gap}px`;
          // 并修改当前索引的高度为当前元素的高度
          heightArr[minIndex] = minHeight + gap + height;
        }
      }
    },
    // 获取滚动条的宽度
    getScrollbarWidth() {
      const oDiv = document.createElement("div"); //创建一个div
      // 给div设置样式。随便定义宽高，只要能获取到滚动条就可以
      oDiv.style.cssText = `width: 50px;height: 50px;overflow: scroll;`;
      document.body.appendChild(oDiv); //把div添加到body中
      const scrollbarWidth = oDiv.offsetWidth - oDiv.clientWidth; // 使最大宽度和可视宽度相减，获得到滚动条宽度。
      oDiv.remove(); //移除创建的div
      return scrollbarWidth; //返回滚动条宽度
    }
  }
};
</script>

<style scoped lang="less">
.main {
  height: 100%;
  position: relative;
}
.box {
  position: absolute;
  width: 300px;
  background-color: pink;
}
</style>
<style>
html,
body {
  height: 100%;
}
</style>
