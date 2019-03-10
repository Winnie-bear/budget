<template>
  <div :class="$style.revenue">
    <heador :show-flag="true"/>
    <navigation />
    <revenue-tab :budget-flag="topBudFlag" :actual-flag="topActFlag" :revenue-data="budgetArr" @addRev="addBudgetRev" @editRev="editBudgetRev" @delRev="delBudgetRev"/>
    <pag :page-num="budgetPage" @getPage="getRevBudgetPage"/>
    <revenue-tab :actual-flag="baseActFlag" :budget-flag="baseBudFlag" :revenue-data="actualArr" @addRev="addActualRev" @editRev="editActualRev" @delRev="delActualRev"/>
    <pag :page-num="actualPage" @getPage="getActDataPage"/>
    <revenue-box :rev-box-visible="revBoxFlag" :revenue-title="revenueTitle" :revenue-type-name-opts="revenueTypeNameArr" :calculate-unit-name-opts="calculateUnitNameArr" :charge-scope-name-opts="chargeScopeNameArr" :revenue="revenue" @subRevenue="subRevenue" @subRevCancel="subRevCancel" @closeRevenue="closeRevenue"/>
    <footor/>
  </div>
</template>

<script>
import Heador from '@/components/common/header'
import Footor from '@/components/common/footer'
import Navigation from '@/components/common/nav'
import RevenueTab from '@/components/revenue/revenueTab'
import RevenueBox from '@/components/revenue/revenueBox'
import Pag from '@/components/common/pagination'
import qs from 'qs'
import axios from 'axios'
export default {
  data () {
    return {
      budgetArr:[],
      actualArr:[],
      revenueTypeNameArr:[],
      calculateUnitNameArr:[],
      chargeScopeNameArr:[],
      revenueTitle:"",
      revenue:{
        ChargeProjectName:'',
        ChargeStandard:'',
        BudgetTotalRrevenue:'',
        ActualTotalRrevenue:'',
        BudgetAccding:'',
        Notes:''
      },
      budgetPage:0,
      actualPage:0,
      revBoxFlag:false,
    };
  },
  components: {
    Heador,
    Navigation,
    RevenueTab,
    RevenueBox,
    Pag,
    Footor
  },
  mounted() {
    this.getRevenueBudget();
    this.getActualData();
  },
  methods:{
    //获取弹框中下拉框的值
    get(){
      //回调函数中使用箭头函数，可以解决this的指向问题，以免出现property  undefined的情况
      axios.post('/api/dic_calculateunit').then((response)=>{
        this.calculateUnitNameArr=response.data;       
      });
      axios.get('/api/dic_revenuetype').then((response)=>{
        this.revenueTypeNameArr=response.data;
      });
      axios.get('/api/dic_chargescope').then((response)=>{
        this.chargeScopeNameArr=response.data;
      });
    },
    //添加修改删除明细信息后重新请求接口，获取最新数据
    freshBud(){
      if(this.curBudPage)
      {
        setTimeout(this.getRevBudgetPage(this.curBudPage),1000);
      }else{
        setTimeout(this.getRevenueBudget(),1000);
      }
    },
    freshAct(){
      if(this.curActPage){
       setTimeout(this.getActDataPage(this.curActPage),1000);
      }else{
        setTimeout(this. getActualData(),1000);
      }
    },
    //获取本年收入预算数据
    getRevenueBudget(){
      this.topBudFlag=true;
      this.topActFlag=false;
      const postData=qs.stringify({
        username:this.$store.state.userId,
        year:new Date().getFullYear()+1,
        page:1,
      })
      let callback=(response)=>{
        this.budgetArr=response.data.data;
        this.budgetPage=response.data.total;
      }
      this.post('/api/project/BudgetTotalRrevenue',postData,callback);
    },
    //分页获取本年收入预算数据
    getRevBudgetPage(cur){
      this.curBudPage=cur;
      const postData=qs.stringify({
          username:this.$store.state.userId,
          year:new Date().getFullYear()+1,
          page:cur,
        })
      let callback=(response)=>{
        this.budgetArr=response.data.data;
      }
       this.post('/api/project/BudgetTotalRrevenue',postData,callback);
    },
    //获取去年实际收入数据
    getActualData(){
      this.baseActFlag=true;
      this.baseBudFlag=false;
      let postData=qs.stringify({
        username:this.$store.state.userId,
        year:new Date().getFullYear(),
        page:1,
      })
      let callback=(response)=>{
        this.actualArr=response.data.data;
        this.actualPage=response.data.total;
      }
      this.post('/api/project/ActualTotalRrevenue',postData,callback);
    },
    //分页获取去年实际收入数据
    getActDataPage(cur){
      this.curActPage=cur;
      let postData=qs.stringify({
          username:this.$store.state.userId,
          year:new Date().getFullYear(),
          page:cur,
      });
      let callback=(response)=>{
        this.actualArr=response.data.data;
      }
      this.post('/api/project/ActualTotalRrevenue',postData,callback);
    },
    //清空数据
    clearAll(){
      this.revenue={
          ChargeProjectName:'',
          ChargeStandard:'',
          BudgetTotalRrevenue:'',
          ActualTotalRrevenue:'',
          BudgetAccding:'',
          Notes:''
      }
    },
    //添加收入预算信息
    addBudgetRev(){
      this.revenueTitle="添加收入预算明细";
      this.revBoxFlag=true;
      this.get();
    },
    //编辑收入预算信息
    editBudgetRev(row){
      this.revenueTitle="更新收入预算明细";
      this.revBoxFlag=true;
      this.revenue=row;
      this.get();
    },
    //删除收入预算信息
    delBudgetRev(row){
      let postData=qs.stringify({
        ApplyID:row.ApplyID,
        Illustration:row.Illustration
      });
      let callback=(response)=>{
        this.freshBud();
      }
      this.post('/api/del/ActualTotalRrevenue',postData,callback);
    },
    //添加实际收入信息
    addActualRev(){
      this.revenueTitle="添加实际收入明细";
      this.revBoxFlag=true;
      this.get();
    },
    //编辑实际收入信息
    editActualRev(row){
      this.revenueTitle="更新实际收入明细";
      this.revBoxFlag=true;
      this.revenue=row;
      this.get();
    },
    //删除实际收入信息
    delActualRev(row){
      let postData=qs.stringify({
        ApplyID:row.ApplyID,
        Illustration:row.Illustration
      });
      let callback=(response)=>{
        this.freshAct();
      }
      this.post('/api/del/ActualTotalRrevenue',postData,callback);
    },
    //提交收入信息
    subRevenue(revenueData){
      this.revBoxFlag=false;
      if(revenueData.FileName){
        revenueData.OldFileName=revenueData.Illustration;   
      }
      let postData=qs.stringify(revenueData);
      let callback=(response)=>{
        this.freshBud();
      }
      let actuCallBack=(response)=>{
        this.freshAct();
      }
      if(this.revenueTitle=="添加收入预算明细"){
        this.post('/api/add/BudgetTotalRrevenue',postData,callback);        
      }else if(this.revenueTitle=="更新收入预算明细"){
       this.post('/api/update/BudgetTotalRrevenue',postData,callback);
      }else if(this.revenueTitle=="添加实际收入明细"){
        this.post('/api/add/ActualTotalRrevenue',postData,actuCallBack);
      }else if(this.revenueTitle=="更新实际收入明细"){
        this.post('/api/update/ActualTotalRrevenue',postData,actuCallBack);
      }
    },
    //取消提交收入信息
    subRevCancel(){
      this.clearAll();
      this.revBoxFlag=false;
    },
    closeRevenue(){
      this.clearAll();
      this.revBoxFlag=false;
    }
  }
}
</script>

<style lang='scss' module>
.revenue{
  width:80vw;
  margin:0 auto;
}
</style>