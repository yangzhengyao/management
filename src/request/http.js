import axios from "axios";
import store from "../store/index";
import router from "../router";
import qs from 'qs'
import { MessageBox } from "element-ui";
//let useUrl = process.env.NODE_ENV == "development"?"http://192.168.16.14:9201/":"http://139.9.238.23:9103/";
let useUrl;
if(process.env.NODE_ENV == "development"){
  useUrl = "http://192.168.16.14:9201/";
}else if(process.env.NODE_ENV == "production"){
  useUrl = process.env.VUE_APP_BASE_SERVER;
}else{
  useUrl = "http://192.168.16.14:9201/";
}

//不同环境的切换
if (process.env.NODE_ENV == "development") {
	//http://192.168.16.16:9200  http://192.168.1.113:9200   http://192.168.16.14:9201--开发  192.168.1.138:9103--生产 http://139.9.238.23:9103  http://139.9.238.23:9103/
  //axios.defaults.baseURL = "http://192.168.16.14:9201";
} else if (process.env.NODE_ENV == "debug") {
  axios.defaults.baseURL = "https://www.ceshi.com";
} else if (process.env.NODE_ENV == "production") {
  //axios.defaults.baseURL = "http://127.0.0.1:9201";
}
//请求超时时间
axios.defaults.timeout = 60 * 1000;

//请求头  "application/x-www-form-urlencoded" application/json
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";

// 请求拦截器
axios.interceptors.request.use(
  config => {
    /*每次发送请求之前判断vuex中是否存在token
         如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
         即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断*/
    const token = store.state.token;
    token && (config.headers.Authorization = token);
    // 不用传appInfoId的接口集合 或者是传参是数组，appId需要单独处理的
    let urlArr = ["user/auth"];
    //参数
    let beforeSendPar;

    //Object.assign({},params,{appInfoId:window.sessionStorage.getItem("appId")})

    // 根据不同的请求方式赋值参数
    if(config.method == 'get'){
      beforeSendPar = config.params;
    }else if(config.method == 'post'){
      beforeSendPar = config.data;
      //console.log(config.data)
    }

    //添加appInfoId参数
    if( Array.isArray(beforeSendPar) ){
      if(beforeSendPar.length > 0){
        let obj = {};
        let arr = [];
        beforeSendPar.forEach(function(item,index) {
          item.appInfoId = window.sessionStorage.getItem("appId");
					//item.appInfoId = '18';
          arr.push(item);
        });
        beforeSendPar = arr;
      }
    }else{
      beforeSendPar = Object.assign({},beforeSendPar,{appInfoId:window.sessionStorage.getItem("appId")})
		//beforeSendPar = Object.assign({},beforeSendPar,{appInfoId:"13"})
    }

    //根据urlArr数组过滤  处理不用传appInfoId的接口
    if( Array.isArray(beforeSendPar) ){
      urlArr.forEach(function(item,index) {
        if(config.url.indexOf(item)!= -1){
          beforeSendPar.forEach(function(inneritem,innerIndex) {
            delete inneritem.appInfoId;
          })
        }
      })
    }else{
      urlArr.forEach(function(item,index) {
        if(config.url.indexOf(item)!= -1){
          Object.keys(beforeSendPar).forEach(function(key) {
            if(key == 'appInfoId'){
              delete beforeSendPar['appInfoId']
            }
          })
        }
      });
    }

    if(config.method == 'get'){
       config.params = beforeSendPar;
    }else if(config.method == 'post'){
       config.data = beforeSendPar;
    }
		/* if (config.method === 'post') {
			config.data = qs.stringify(config.data)
		} */
    return config;
  },
  error => {
    return Promise.error(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  response => {
	//&&response.data.errorCode == '4001'
	if(response.status == 200&&response.data.errorCode == '4001'){
		router.push({
			name: '404'
		})
		return response
	}
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是2开头的的情况
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  error => {
    if (error.response.status) {
      switch (error.response.status) {
				// 请求接口错误
				case 400:
					MessageBox({
						message: "请求接口错误",
						confirmButtonText: "确定"
					});
					break;
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          router.replace({
            path: "/login",
            query: {
              redirect: router.currentRoute.fullPath
            }
          });
          break;

        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          MessageBox({
            message: "登录过期，请重新登录",
            confirmButtonText: "确定"
          });
          // 清除token
          localStorage.removeItem("token");
          store.commit("loginSuccess", null);
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          setTimeout(() => {
            router.replace({
              path: "/login",
              query: {
                redirect: router.currentRoute.fullPath
              }
            });
          }, 1000);
          break;

        // 404请求不存在
        case 404:
          MessageBox({
            message: "网络请求不存在",
            confirmButtonText: "确定"
          });
          break;
        case 500:
          MessageBox({
            message: "后台出了一些故障哦！请耐心等待~~~",
            confirmButtonText: "确定"
          });
          break;
        // 其他错误，直接抛出错误提示
        default:
          MessageBox({
            message: error.response.data.message,
            confirmButtonText: "确定"
          });
      }
      return Promise.reject(error.response);
    }
  }
);

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(useUrl+url, {
        params: params
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

/**
 * get方法，调红旗接口，和其他get前缀不一样
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function getHongqi(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .post(useUrl+url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

// post请求  application/x-www-form-urlencoded;charset=UTF-8  qs.stringify(data)
export function postRequest (url, data = {}, method = 'post') {
  return new Promise((resolve, reject) => {
    axios({
      url: useUrl+url,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    })
      .then(res => {
        /*成功*/
        resolve(res.data)
      })
      .catch(res => {
        //失败
        reject(res)
      })

  })
}

/**
 *  delete方法，对应delete请求
 *  @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function cancel(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .delete(useUrl+url, {
        data: params
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}
