<template>
  <div style="margin-top: 20px;">
    <div class="block">
      <el-date-picker
        v-model="value1"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
        @change="init"
      ></el-date-picker>
    </div>
    <button type="button" class="el-carousel__arrow el-carousel__arrow--left">
      <i class="el-icon-arrow-left"></i>
    </button>
    <button type="button" class="el-carousel__arrow el-carousel__arrow--right">
      <i class="el-icon-arrow-right"></i>
    </button>
    <div class="el-backtop" style="right: 100px; bottom: 150px;">
      <i class="el-icon-caret-top" @click="toTop"></i>
    </div>

    <div id="waterfall"></div>
    <div class="loader" id="loader">
      <div class="loader-inner line-spin-fade-loader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
var waterfall = null;
export default {
  components: {},
  data() {
    return {
      list: [],
      over: false,
      value1: ""
    };
  },
  created() {},
  mounted() {
    this.init();
    let _this = this;

    // 添加点击事件
    document.getElementById("waterfall").addEventListener("click", function(e) {
      if (e.target.attributes["son-idx"] && !(e.target.attributes["son-idx"].nodeValue === null || e.target.attributes["son-idx"].nodeValue === "") ) {
        let idx = parseInt(e.target.attributes["son-idx"].nodeValue);
        _this.showBigAction(idx);
      } else if (e.target.attributes["class"] && e.target.attributes["class"].value.indexOf("description") != -1 ) {
        if (e.target.attributes["class"].value.indexOf("checked") == -1) {
          e.target.classList.add("checked");
        } else {
          e.target.classList.remove("checked");
        }
      }
    });

    // 添加右键点击事件
    document.getElementById("waterfall").addEventListener("contextmenu", function(e) {
      event.preventDefault();
      console.log(e.target.attributes["class"].value)
      if (e.target.attributes["class"] && e.target.attributes["class"].value== "img") {
        let parent = e.target.parentNode;
        if (parent.attributes["class"].value.indexOf("green-bord") == -1) {
          parent.classList.add("green-bord");
        } else {
          parent.classList.remove("green-bord");
        }
      }
    });
  },
  methods: {
    init() {
      this.list = [];
      document.getElementById("waterfall").innerHTML = "";

      // 插件 https://github.com/mqyqingfeng/waterfall
      waterfall = new WaterFall({
        container: "#waterfall",
        pins: ".pin",
        loader: "#loader",
        gapHeight: 20,
        gapWidth: 20,
        pinWidth: 216,
        threshold: 100
      });

      let _this = this;
      waterfall.on("load", function() {
        _this.loadMore();
      });
    },
    loadMore() {
      // 没有数据
      if (this.over) return;
      let _this = this;

      getData().then(res => {
        let dataArr = res.data.data;
        if (!dataArr || dataArr.length < 1) {
          this.over = true;
          // document.getElementById("loader").innerHTML("hahahahahah")
          return;
        }

        // 处理多张图片
        let imgArr = [];
        dataArr.map(e => {
          let partArr = e.imageUrls.map(urls => {
            let newObj = {};
            clone(e, newObj);
            newObj.src = urls;
            imgArr.push(newObj);
          });
        });

        let preLen = _this.list.length;
        var arr = [];
        for (var i = 0, len = imgArr.length; i < len; i++) {
          var data = imgArr[i];
          arr.push(
            '<div class="pin"><img son-idx="' +
              (preLen + i) +
              '" src="' +
              data.src.large +
              '" class="img" alt="' +
              data.title +
              '"> <p class="description">' +
              data.title +
              '<i class="el-icon-success"></i></p></div>'
          );
        }
        _this.list.push(...imgArr);
        // 调用 append 方法 检验是否所有的图片都具有高度后才会 append 进文档树中
        waterfall.append(arr.join(""), ".img");
      });
    },
    showBigAction(idx) {
      let tmp = [];
      this.list.forEach(ele => {
        tmp.push(ele.src.large);
      });
      this.$imagePreview({
        images: tmp,
        index: idx
      });
    },
    rightClick(item) {
      console.log(item);
    },
    toTop() {
      var gotoTop= function(){
          var currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
          currentPosition -= 100;
          if (currentPosition > 0) {
            window.scrollTo(0, currentPosition);
          }
          else {
            window.scrollTo(0, 0);
            clearInterval(timer);
            timer = null;
          }
        }
        var timer=setInterval(gotoTop,1);
      // window.scrollTo(0, 0);
    }
  }
};

import fetch from "@/axios/config.js";
//获取数据
function getData() {
  return fetch({
    url: "/static/data.json",
    method: "get",
    // params:{'year': year},
    data: {}
  });
}

//深度克隆对象的方法	 -- > 深层拷贝，对象属性方法一致，单都是单独的个体。
function clone(origin, target) {
  var target = target || {};
  for (var prop in origin) {
    target[prop] = origin[prop];
  }
  return target;
}
</script>

<style>
.el-carousel__arrow {
  position: fixed;
}
.el-backtop {
  bottom: 10px !important;
  right: 10px !important;
}
.description i {
  display: none;
  color: lime;
  font-size: 20px;
}
.description.checked i {
  display: inline-block;
}
.green-bord {
  border: 3px lime solid
}
</style>
