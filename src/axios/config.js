import axios from 'axios';
import Vue from 'vue'
axios.defaults.timeout = 180000

const service = axios.create({baseURL: "https://api.pixivic.com"});
let _config
service.interceptors.request.use(config => {
  _config = config
  config.headers['Content-Type'] = "application/json";
  return config;
}, error => {
  Promise.reject(error);
})
service.interceptors.response.use(
  response => {
    const res = response.data;
    return res;
  },
  error => {
    Promise.reject(error);
    return false
  }
)

const local = axios.create({baseURL: "http://10.131.13.28:9000"});
let _config2
local.interceptors.request.use(config => {
  _config2 = config
  config.headers['Content-Type'] = "application/json";
  return config;
}, error => {
  Promise.reject(error);
})
local.interceptors.response.use(
  response => {
    const res = response.data;
    return res;
  },
  error => {
    Promise.reject(error);
    return false
  }
)

export default {service,local};