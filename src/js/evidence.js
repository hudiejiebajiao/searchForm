globalSt = document.documentElement.scrollTop || document.body.scrollTop;
scroll();
window.addEventListener("scroll", scroll); // hoverLine(0);

function curClick(index) {
  console.log(77, index);
  //切换导航栏
  if (!document.getElementById("content".concat(index + 1))) return;
  globalSt = document.getElementById("content".concat(index + 1)).offsetTop;
  document.documentElement.scrollTop = globalSt;
  document.body.scrollTop = globalSt;
}

function scroll() {
  //监听鼠标滚动事件
  if (window.innerWidth <= 768) {
    document.querySelector(".header").classList.add("fix");
    return;
  }
  globalSt = document.documentElement.scrollTop || document.body.scrollTop;
  var bannerH = document.querySelector(".pro-banner")
    ? document.querySelector(".pro-banner").clientHeight
    : 0;
  var headerH = 60;
  if (globalSt > headerH) {
    document.querySelector(".header").classList.add("fix");
  } else {
    document.querySelector(".header").classList.remove("fix");
  }
  if (globalSt > bannerH - headerH) {
    document.querySelector(".solve-nav").classList.add("fix");
    document.querySelector(".header").classList.add("fix2");
  } else {
    document.querySelector(".solve-nav").classList.remove("fix");
    document.querySelector(".header").classList.remove("fix2");
  }
  console.log(787878, document.getElementById("content1"));
  if (
    globalSt >= document.getElementById("content1").offsetTop - 120 &&
    globalSt < document.getElementById("content2").offsetTop - 120
  ) {
    activeI = 0;
  } else if (
    globalSt >= document.getElementById("content2").offsetTop - 120 &&
    globalSt < document.getElementById("content3").offsetTop - 120
  ) {
    activeI = 1;
  } else if (
    globalSt >= document.getElementById("content3").offsetTop - 120 &&
    globalSt < document.getElementById("content4").offsetTop - 120
  ) {
    activeI = 2;
  } else if (globalSt >= document.getElementById("content4").offsetTop - 120) {
    activeI = 3;
  }
  console.log(
    '$(".nav_i a:eq(".concat(activeI, ")"))',
    $(".nav_i a:eq(".concat(activeI, ")"))
  );
  $(".nav_i a:eq(".concat(activeI, ")"))
    .siblings()
    .removeClass("active");
  $(".nav_i a:eq(".concat(activeI, ")")).addClass("active");
  navOffset = navw * activeI;
  $(".line").css({
    width: "".concat(navw, "%"),
    left: "".concat(navOffset, "%")
  });
}

function slideHandle(e) {
  // var brother1 = document.getElementById("test").parentNode.children[1];
  console.log(7878, e);
}
