<template>
  <div style="margin-top: 20px;">
    <el-input
      placeholder="关键词"
      @keyup.enter.native="search"
      style="width:200px;margin-bottom:10px;"
      v-model="searchKey"
      clearable
    ></el-input>
    <div class="block">
      <el-date-picker
        v-model="currentDate"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
        @change="init"
        :picker-options="pickerOptions"
      ></el-date-picker>
    </div>
    <el-badge :value="selectedCount" class="item" type="success" id="count" />
    <el-button type="success" size="mini" plain @click="syncho" id="syncho">保存</el-button>
    <el-button type="primary" size="mini" plain @click="today" id="today">今日</el-button>

    <button
      type="button"
      class="el-carousel__arrow el-carousel__arrow--left"
      @click="changeDate(-1)"
    >
      <i class="el-icon-arrow-left"></i>
    </button>
    <button
      type="button"
      class="el-carousel__arrow el-carousel__arrow--right"
      @click="changeDate(1)"
    >
      <i class="el-icon-arrow-right"></i>
    </button>
    <div class="el-backtop" style="right: 10px; bottom: 10px;">
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
import fetch from "@/axios/config.js";

export default {
  components: {},
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      list: [],
      over: false,
      currentDate: "",
      searchKey: "",
      page: 0,
      selectedCount: 0,
      waterfall: null
    };
  },
  created() {},
  mounted() {
    let tmpDate = new Date();
    tmpDate.setDate(tmpDate.getDate() - 3);
    this.currentDate = this.dateFormat(tmpDate);

    // 插件 https://github.com/mqyqingfeng/waterfall
    this.waterfall = new WaterFall({
      container: "#waterfall",
      pins: ".pin",
      loader: "#loader",
      gapHeight: 20,
      gapWidth: 20,
      pinWidth: 160,
      threshold: 100
    });
    let _this = this;
    _this.waterfall.on("load", function() {
      // 没有数据
      if (_this.over) return false;
      _this.loadMore();
    });

    // 添加点击事件
    document.getElementById("waterfall").addEventListener("click", function(e) {
      if (
        e.target.attributes["son-idx"] &&
        !(
          e.target.attributes["son-idx"].nodeValue === null ||
          e.target.attributes["son-idx"].nodeValue === ""
        )
      ) {
        let idx = parseInt(e.target.attributes["son-idx"].nodeValue);
        _this.showBigAction(idx);
      } else if (
        e.target.attributes["class"] &&
        e.target.attributes["class"].value.indexOf("description") != -1
      ) {
        if (e.target.attributes["class"].value.indexOf("checked") == -1) {
          e.target.classList.add("checked");
          _this.selectedCount += 1;
        } else {
          e.target.classList.remove("checked");
          _this.selectedCount -= 1;
        }
      }
    });
    this.init();

    // 添加右键点击事件
    // document.getElementById("waterfall").addEventListener("contextmenu",
    //   function(e) {event.preventDefault();

    //     if (
    //       e.target.attributes["class"] &&
    //       e.target.attributes["class"].value == "img"
    //     ) {
    //       let parent = e.target.parentNode;
    //       if (parent.attributes["class"].value.indexOf("green-bord") == -1) {
    //         parent.classList.add("green-bord");
    //       } else {
    //         parent.classList.remove("green-bord");
    //       }
    //     }
    //   });
  },
  methods: {
    init() {
      // 初始化
      this.list = [];
      this.page = 1;
      this.over = false;
      this.selectedCount = 0;
      document.getElementById("waterfall").innerHTML = "";

      let columnHeightArr = this.waterfall._columnHeightArr;
      if (columnHeightArr) {
        // 清除waterfall高度
        for (let index = 0; index < columnHeightArr.length; index++) {
          columnHeightArr[index] = 0;
        }
      }
    },
    loadMore() {
      // 加载数据
      let _this = this;
      getData(_this.page, _this.currentDate, _this.searchKey).then(res => {
        _this.page += 1;
        if (!res || !res.data || res.data.length < 1) {
          _this.over = true;
          this.$message({
            showClose: true,
            message: "没有更多数据了..",
            type: "warning"
          });
          let loader = document.getElementById("loader");
          loader.style.display = "none";
        } else {
          // 处理多张图片
          let dataArr = res.data;
          let imgArr = [];
          dataArr.forEach(e => {
            if (e.type != "manga" && e.pageCount < 10) {
              e.imageUrls.forEach(function(url, sort) {
                let newObj = {};
                clone(e, newObj);
                newObj.src = url;
                newObj.sort = sort;
                imgArr.push(newObj);
              });
            }
          });

          let preLen = _this.list.length;
          var arr = [];
          for (var i = 0, len = imgArr.length; i < len; i++) {
            var data = imgArr[i];
            arr.push(
              '<div class="pin"><img son-idx="' +
                (preLen + i) +
                '" src="' +
                data.src.large.replace("pximg.net", "pixiv.cat") +
                '" class="img" alt="' +
                data.title +
                '"> <p class="description">' +
                data.title +
                '<i class="el-icon-success"></i></p></div>'
            );
          }
          _this.list.push(...imgArr);
          // 调用 append 方法 检验是否所有的图片都具有高度后才会 append 进文档树中
          _this.waterfall.append(arr.join(""), ".img");
        }
      });
    },
    showBigAction(idx) {
      // 图片放大预览
      let tmp = [];
      this.list.forEach(ele => {
        tmp.push(ele.src.large.replace("pximg.net", "pixiv.cat"));
      });
      this.$imagePreview({
        images: tmp,
        index: idx
      });
    },
    syncho() {
      // 同步
      let pics = [];
      let _this = this;
      let checkedList = document.getElementsByClassName("checked");

      for (let i = 0; i < checkedList.length; i++) {
        let e = checkedList[i];
        let img = e.previousElementSibling;
        let index = img.getAttribute("son-idx");
        let elem = _this.list[index];

        let object = {};
        object.title = elem.title;
        object.illustId = elem.id;
        object.caption = elem.caption;
        object.sort = elem.sort;
        object.user = elem.artistPreView.name;
        object.userId = elem.artistPreView.id;
        object.userAvatar = elem.artistPreView.avatar;
        object.originalImg = elem.src.original;
        object.fixedImg = elem.src.large;
        object.pixImg = elem.src.medium;
        object.rankDate = _this.currentDate;

        let tagsArr = new Array();
        elem.tags.forEach(function(item, index) {
          tagsArr.push(item.name);
        });
        object.tags = tagsArr.join(",");
        pics.push(object);
      }

      return fetch.local({
        url: "/pic/save",
        method: "post",
        data: JSON.stringify(pics)
      });
    },
    today() {
      return fetch.local({
        url: "/pic/today",
        method: "post"
      });
    },
    search() {
      this.init();
      this.loadMore();
    },
    toTop() {
      // 回到顶部
      // var gotoTop = function() {
      //   var currentPosition =
      //     document.documentElement.scrollTop || document.body.scrollTop;
      //   currentPosition -= 1000;
      //   if (currentPosition > 0) {
      //     window.scrollTo(0, currentPosition);
      //   } else {
      //     window.scrollTo(0, 0);
      //     clearInterval(timer);
      //     timer = null;
      //   }
      // };
      // var timer = setInterval(gotoTop, 1);
      window.scrollTo(0, 0);
    },
    changeDate(i) {
      let date = new Date(this.currentDate);
      date.setDate(date.getDate() + i);
      this.currentDate = this.dateFormat(date);
      this.init();
      this.loadMore();
    },
    dateFormat(date) {
      var oYear = date.getFullYear();
      var oMoth = (date.getMonth() + 1).toString();
      if (oMoth.length <= 1) oMoth = "0" + oMoth;
      var oDay = date.getDate().toString();
      if (oDay.length <= 1) oDay = "0" + oDay;
      return oYear + "-" + oMoth + "-" + oDay;
    }
  }
};

//获取数据
function getData(page, currentDate, searchKey) {
  if (searchKey != "") {
    return fetch.service({
      url: "/illustrations",
      method: "get",
      params: {
        illustType: "illust",
        searchType: "original",
        maxSanityLevel: 6,
        page: page,
        pageSize: 30,
        keyword: searchKey
      }
      // data: {}
    });
  } else {
    return fetch.service({
      url: "/ranks",
      // url: "/static/data.json",
      method: "get",
      params: {
        page: page,
        date: currentDate,
        mode: "day"
      }
      // data: {}
    });
  }
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

.description i {
  display: none;
  color: lime;
  font-size: 20px;
}
.description.checked i {
  display: inline-block;
}
.green-bord {
  border: 3px lime solid;
}
#count {
  z-index: 100;
  position: fixed;
  left: 10px;
  top: 10px;
}
#syncho {
  position: absolute;
  right: 10px;
  top: 10px;
}
#today {
  position: absolute;
  right: 10px;
  top: 40px;
}
.footer {
  font-size: 20px;
  font-weight: bolder;
  color: aqua;
}
</style>
