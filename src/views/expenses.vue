<template>
  <div :class="$style.expenses">
    <heador :showFlag="true"/>
    <navigation/>
    <exp-tab :projectData="projectArr" :showFlag="this.$store.state.userId=='000'?true:false" @getProId="getProDetail" @edit="editItem" @hidden="hiddenItem" @add="addItem" @display="displayItem"/>
    <add-pro-box :addProVisible="addFlag" @subPro="subPro" @subProCancel="subProCancel" @closeAdd="closeAdd"/>
    <edit-pro-box :projectName="projectName" :editProVisible="editFlag" @subEdit="subEdit" @subEditCancel="subEditCancel" @closeEdit="closeEdit"/>
    <pag @getPage="getPageData" :pageNum="pageTotal"/>
    <detail-tab :detailData="detailArr" :projectId="proId" :showAdd="showAddBtn" @addDetail="addDetail" @editDetail="editDetail" @delDetail="delDetail"/>
    <detail-box :detailVisible="detailFlag" :detail="detail" @subDetail="subDetail" @subDetailCancel="subDetailCancel" @closeDetail="closeDetail"/>
    <pag @getPage="getDetailPage" :pageNum="detailPage" :currentPage="curPage"/>
    <footor/>
  </div>
</template>

<script>
import Heador from '@/components/common/header'
import Footor from '@/components/common/footer'
import Navigation from '@/components/common/nav'
import ExpTab from '@/components/expenses/expTab'
import addProBox from '@/components/expenses/addProBox'
import editProBox from '@/components/expenses/editProBox'
import Pag from '@/components/common/pagination'
import detailTab from '@/components/expenses/detailTab' 
import detailBox from '@/components/expenses/detailBox'
import qs from 'qs'
export default {
  inject:['reload'],
  data () {
    return {
      projectArr:[],
      detailArr:[],
      proId:'',
      pageTotal:0,
      detailPage:0,
      detailFlag:false,
      addFlag:false,
      editFlag:false,
      showAddBtn:false,
      projectName:'',
      curPage:0,
    };
  },
  components: {
    Heador,
    Footor,
    Navigation,
    ExpTab,
    Pag,
    detailTab,
    detailBox,
    addProBox,
    editProBox
  },
  mounted() {
    this.getData();
  },
  methods: {
    //获取项目信息
   getData(){
     let postData=qs.stringify({
       userId:this.$store.state.userId,
       page:1,
     })
     let callback=(response)=>{
        let res=response.data.data;
        let pageNum=response.data.total;
        this.projectArr=res;
        this.pageTotal=pageNum;
        console.log(response);
     }
     this.post('/api/project',postData,callback);
    },
    //分页获取项目信息
    getPageData(cur){
      this.curProPage=cur;
      let postData=qs.stringify({
          userId:this.$store.state.userId,
          page:cur,
        });
      let callback=(response)=>{
        let res=response.data.data;
        this.projectArr=res;
      }
      this.post('/api/project',postData,callback);
    },
    //获取页面详情信息
    getProDetail(proId){
      this.curPage=1;
      this.showAddBtn=true;
      this.proId=proId;
      let postData=qs.stringify({
        projectID:this.proId,
        year:new Date().getFullYear()+1,
        page:1,
      })
      let callback=(response)=>{
        let res=response.data.data;
        this.detailArr=res;
        this.detailPage=response.data.total;
      }
      this.post('/api/project/details',postData,callback);
    },
    //分页获取详细信息
    getDetailPage(cur){ 
      this.curPage=cur;
      let postData=qs.stringify({
        projectID:this.proId,
        year:new Date().getFullYear()+1,
        page:cur,
      })
      let callback=(response)=>{
        let res=response.data.data;
        this.detailArr=res;
      }
      this.post('/api/project/details',postData,callback);
    },
    //刷新项目信息
    freshPro(){
      if(this.curProPage){
        this.getPageData(this.curProPage);
      }else{
        this.reload();
      }
    },
    //添加新项目信息
    addItem(){
      this.addFlag=true;
    },
    //隐藏某一项
    hiddenItem(row){
      let postData=qs.stringify({
        ProjectID:row.ProjectID,
      });
      let callback=(response)=>{
        let res=response.data;
        this.freshPro();
      }
      this.post('/api/update/hide',postData,callback);      
    },
    //显示某一项
    displayItem(row){
      let postData=qs.stringify({
        ProjectID:row.ProjectID,
      });
      let callback=(response)=>{
        let res=response.data;
        this.freshPro();
      }
      this.post('/api/update/show',postData,callback);  
    },
    //修改项目信息
    editItem(row){
      this.editFlag=true;
      this.editId=row.ProjectID;
      this.projectName=row.ProjectName;
    },
    //提交项目修改信息
    subEdit(projectName){
      let postData=qs.stringify({
        ProjectID:this.editId,
        ProjectName:projectName
      })
      let callback=(response)=>{
        this.editFlag=false;
        this.freshPro();
      }
      this.post('/api/update/project',postData,callback);
    },
    //取消提交
    subEditCancel(){
      this.editFlag=false;
    },
    //提交新项目信息
    subPro(proInfo){
      console.log(proInfo)
      let postData=qs.stringify({
        DepartmentID:proInfo.DepartmentID,
        ProjectID:proInfo.ProjectID,
        ProjectName:proInfo.ProjectName,
        Notes:proInfo.Notes,
      });
      let callback=(response)=>{
        this.addFlag=false;
        this.reload();
      }
      this.post('/api/add/project',postData,callback);
    },
    //取消添加新项目信息
    subProCancel(){
      this.addFlag=false;
    },
    //清空detail中的数据
    clearDetail(){
      this.detail={
        BudgetAccding:'',
        Notes:'',
        ProjectBudgetMoney:'',
        ProjectBudgetName:''
      };
    },
    //添加修改删除明细信息后重新请求接口，获取最新数据
    fresh(){
      if(this.curPage==1)
      {
        setTimeout(this.getProDetail(this.proId),1000);
      }else{
        setTimeout(this.getDetailPage(this.curPage),1000);
      }
    },
    //添加项目详细信息
    addDetail(){
      this.add=true;//标识是添加操作而非修改操作
      this.edit=false;
      this.detailFlag=true;
    },
    //修改项目详细信息
    editDetail(row){
      this.detailFlag=true;
      this.detail=row;//将一行的详细信息赋值给修改框
      this.edit=true;
      this.add=false;
    },
    //删除某行详细信息
    delDetail(row){
      let postData=qs.stringify({
        DSID:row.DSID,
        Illustration:row.Illustration
      });
      let callback=(response)=>{
        this.fresh();//请求最新数据
      }
      this.post('/api/del/details',postData,callback);
      this.detailFlag=false;
    },
    //提交项目明细信息
    subDetail(detail){
      let callback=(response)=>{
        this.detailFlag=false;
        this.fresh();
      }
      //点击添加按钮时的提交操作
      if(this.add){
        detail.Annual=new Date().getFullYear()+1;
        detail.ProjectID=this.proId;
        let postData=qs.stringify(detail);
        this.post('/api/add/details',postData,callback);
      }
      //点击修改按钮时的提交操作
      else if(this.edit){
        delete detail['Downloads'];
        //当有新文件传过来时
        if(detail.FileName){
           detail.OldFileName=detail['Illustration'];
        }
        let postData=qs.stringify(detail);
        this.post('/api/update/details',postData,callback);
      }
      this.clearDetail();
    },
    subDetailCancel(){
      this.detailFlag=false;
      this.clearDetail();//清空对话框中的数据
    },
    closeAdd(){
      this.addFlag=false;
    },
    closeEdit(){
      this.editFlag=false;
    },
    closeDetail(){
      this.detailFlag=false;
      this.clearDetail();
    }
  }
}

</script>
<style lang="scss" module>
.expenses{
  width:80vw;
  margin:0 auto;
}
</style>