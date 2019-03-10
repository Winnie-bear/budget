// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import Vuex from 'vuex'
import Axios from 'axios'
import {Loading, Message} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import '@/css/global.scss';
Vue.use(Vuex);
Vue.use(ElementUI);//全局引用ElementUI
Vue.config.productionTip = false;
Vue.prototype.$axios=Axios;
let loadingInstance;
// request拦截器，实现loading加载
Axios.interceptors.request.use(config => {
  loadingInstance = Loading.service({
    text: '正在努力加载中，请不要心急哦...',
  });
  return config
}, error => {
  loadingInstance.close()
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
});

// response拦截器，实现loading关闭
Axios.interceptors.response.use(data => {
  loadingInstance.close()
  return data
}, error => {
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
});

//全局定义post函数
Vue.prototype.post=function(postUrl,postData,callback){
  this.$axios({
    url:postUrl,
    method:'post',
    headers:{  
      "Content-Type":"application/x-www-form-urlencoded"
    },
    data:postData
  }).then((response)=>{
     callback(response);
  }).catch(err=>{
    console.log(err)
  });
}
const store=new Vuex.Store({
   state:{
     userName:'',
     userId:'',
     reportTitle:'',
     depFlag:false,
     annualFlag:false
   },
   mutations:{
      updateUserInfo(state,userInfo){
       state.userName=userInfo.DepartmentName;
       state.userId=userInfo.DepartmentID;
      },
      updateRepShow(state,repInfo){
        state.reportTitle=repInfo.reportTitle;
        state.depFlag=repInfo.depFlag;
        state.annualFlag=repInfo.annualFlag;
      }
   }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,//这个不能掉
  components: { App },
  template: '<App/>'
})
