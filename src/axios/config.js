import axios from 'axios';
import Vue from 'vue'

// import { getToken } from '';
// let BASE_URL = 'http://10.131.13.66/api'
// 创建axios实例
const service = axios.create({
  // baseURL: 'http://localhost:8080', //测试
  baseURL: "https://api.pixivic.com", //正式

  timeout: 10000, // 请求超时时间
  /***如果qs没有stringify,将下面方法打开才能提交form,只在post时生效 **/
  /*
  transformRequest: [function (data) {
    // Do whatever you want to transform the data1
    let ret = ''
    for (let it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    //console.log(ret);
    return ret;
  }]*/
});
let _config
// request拦截器
service.interceptors.request.use(config => {
  _config = config
  //	if(typeof(config.params)=='object'){
  //		config.params['_rnd']=Math.random();
  //	}else{
  //		config.params={
  //			_rnd:Math.random()
  //		}
  //	}
  // let token = sessionStorage.getItem( 'token' );
  // if ( token ) {
  // 	config.headers[ 'Authorization' ] = token; // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
  // }
  config.headers['Content-Type'] = "application/json"; //让每个请求携带Openid,请根据实际情况自行修改
  return config;
}, error => {
  //store.commit('openToast','请求错误');
  //console.log("request_error")
  // Do something with request error
  //console.log(error); // for debug
  Promise.reject(error);
})
/**=======================================**/
// respone拦截器
service.interceptors.response.use(
  /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中,
   */
  response => {
    const res = response.data;
    return res;
  },
  /**接口交互错误是处理,如果特殊错误,可对message进行修改**/
  error => {
    //Vue.$vux.loading.hide();
    //Vue.$vux.toast.text("网络错误");
    //store.state.netError = true;
    //store.commit('timeOpen', "<em style='color:red;'>网络故障</em>");
    // console.log( error.response );
    // let msg = '';
    // if ( error.response.status == 502 ) {
    // 	msg = '请重新请求一次'
    // } else {
    // 	for ( let item in error.response.data ) {
    // 		msg = error.response.data[ item ]
    // 	}
    // }
    //
    // store.commit( 'openInfoPop', msg )
    // return Promise.reject( error );
    Promise.reject(error);
    return false
  }

)

export default service;