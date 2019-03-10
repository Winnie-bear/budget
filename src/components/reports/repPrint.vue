<template>
  <div :class="$style.wrapper">
    <h3>{{reportTitle}}</h3>
    <div :class="$style.select">
      <div :class="$style.elselect" v-if="depFlag">
        <span>单位名称</span>
        <el-select v-model="DepartmentName" placeholder="请选择单位" @change="chooseName(DepartmentName)">
          <el-option
            v-for="item in departments"
            :key="item.DepartmentID"
            :label="item.DepartmentName"
            :value="item.DepartmentName">
          </el-option>
        </el-select>
      </div>
      <div :class="$style.elselect" v-if="annualFlag">
        <span>年度</span>
        <el-select v-model="Annual" placeholder="请选择年份">
          <el-option
            v-for="item in years"
            :key="item.Annual"
            :label="item.Annual"
            :value="item.Annual">
          </el-option>
        </el-select>
      </div>
      <el-button type="primary" @click="checkReport">查看报表</el-button>
      <el-button type="success" @click="exportToExcel">excel格式导出</el-button>
    </div>  
    <div>
      <el-table
        id="reportForm"
        :data="reportData.data"
        :span-method="arraySpanMethod"
        height="500"
        border
        style="width: 100%">
        <el-table-column
          align="center"
          v-for="(value,key) in reportData.data[0]"
          :prop="key"
          :key="key">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import Excel from 'xlsx'
import qs from 'qs'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      DepartmentName:'',
      Annual:'',
      DepartmentName:'',
      tableDepName:'',
      department:{},
      firColSpanArr:[],
      // secColSpanArr:[],
      thirColSpanArr:[],
      fourColSpanArr:[],
      departments:[],
      years:[],
      reportData:{},
      checked:false,
      repTitles:[
        '中南民族大学年度校级及部门专项预算申报明细表（财务用表）',
        '中南民族大学年度校级及部门专项预算申报明细表（各部门汇总表）',
        '中南民族大学年度校级及部门专项预算申报汇总（各部门汇总表）',
        '中南民族大学年度实际收入申报表(财务用表)',
        '中南民族大学年度实际收入申报表(各部门汇总表)',
        '中南民族大学年度收入预算申报表(财务用表)',
        '中南民族大学年度收入预算申报表(各部门汇总表)',
        '预算申报单位负责人及编制人联系方式',
        '中南民族大学年校级及部门专项预算申报表（各部门汇总表）',
        '中南民族大学年度校级及部门专项预算申报明细表（部门用表）',
        '中南民族大学年度实际收入申报表(部门用表)',
        '中南民族大学年度收入预算申报表(部门用表)'
      ]
    };
  },
  watch:{//实时监控
    departments:{
      handler:function(val,oldVal){
        if(val.length==0){//不能用val==[]，对象是一个内存地址，不会相等
          this.DepartmentName='';
          this.Annual='';
        }
      },
      immediate:true
    },
    reportData:{
      handler:function(val,oldVal){
        //不清空保存合并数的数组，当多次请求的时候，数组中的值会改变
        this.firColSpanArr=[];
        // this.secColSpanArr=[];
        this.thirColSpanArr=[];
        this.fourColSpanArr=[];
        if(val.data){
          //this.reportLen=val.data.length;//保存数据数组的长度
          if(this.reportTitle==this.repTitles[3]||this.reportTitle==this.repTitles[4]||this.reportTitle==this.repTitles[5]||this.reportTitle==this.repTitles[6]||this.reportTitle==this.repTitles[10]||this.reportTitle==this.repTitles[11]){
            this.getSpanArr(val.data,'申请单位名称',this.firColSpanArr);
            this.getSpanArr(val.data,'收入类别',this.thirColSpanArr);
            this.getSpanArr(val.data,'收费项目名称',this.fourColSpanArr);
          }else{
            this.getSpanArr(val.data,'单位名称',this.firColSpanArr);
            this.getSpanArr(val.data,'项目编码',this.thirColSpanArr);
            this.getSpanArr(val.data,'项目名称',this.fourColSpanArr);
          }
        }
      },
      immediate:true
    },
    reportTitle:{
      handler:function(val,oldVal){
        this.reportData.data=[];//每次报表名字发生变化时说明已经切换报表，要清空上一次的数据
        this.Annual='';
        this.DepartmentName='';
        if(!this.$store.state.depFlag && this.$store.state.annualFlag){//没有单位名称选择器时，直接请求年度数据
          this.annualPost=true;
          this.reportPost=false;
          let postData=null;
          if(this.$store.state.userId!='000'){
            postData=qs.stringify({
              DepartmentID:this.$store.state.userId
            })
          }
          let yearCallBack=(response)=>{
            this.years=response.data;
          }
          this.postTable(val,this.annualPost,this.reportPost,postData,yearCallBack);
        }else if(this.$store.state.depFlag){//有单位名称选择器时，先请求单位名称数据
          let callback=(response)=>{
          this.departments=response.data;
          }
          this.post('/api/departmentname',null,callback);
        }
      },
      immediate:true
    }
  },
  computed:{//实时计算data中没有的值，mapState通过扩展运算符将store.state.reportTitle映射this.reportTitle
    ...mapState(['reportTitle','depFlag','annualFlag'])
  },
  methods: {
    //请求表格所对应的年份选择或具体数据
    postTable(title,annualPost,reportPost,postData,callback){
       this.repTitles.forEach((item,index)=>{
         if(title==item){
            if(annualPost){
             this.post(`/api/table${index+1}/annual`,postData,callback);
            }else if(reportPost){
              this.post(`/api/table${index+1}/details`,postData,callback);
            }else{
              this.post('/api/table8/details',postData,callback);
            }
         }
       })
    },
    //存放合并行数的数组
    getSpanArr(arr,property,storeArr){
      let divIndex=0;
      if(arr){
        arr.forEach((item,index)=>{
          if(index===0){
            storeArr.push(1);
          }else{
            if(item[property]==arr[index-1][property]){
              storeArr[divIndex]+=1;
              storeArr.push(0);
            }else{
              divIndex=index;
              storeArr.push(1);
            }
          }
        })
      }
    },
    //生成存合并单元格的数组
    mergesCell(colIndex,spanArr){
      let mergesArr=[];
      let newSpanArr=spanArr.concat([]);//利用concat方法返回spanArr的一个副本，newSpanArr和spanArr就不会指向同一块内存，splice就不会同时修改两个数组
      let i=this.DepartmentName==''?3:4;
      if(this.DepartmentName){
        newSpanArr.splice(0,3);
      }else{
        newSpanArr.splice(0,2);
      }
      newSpanArr.forEach((value,index)=>{
        if(value){
          mergesArr[mergesArr.length]={
            s:{},
            e:{}
          }
          mergesArr[mergesArr.length - 1].s.c = colIndex;
          mergesArr[mergesArr.length - 1].s.r = index+i;
          mergesArr[mergesArr.length - 1].e.c = colIndex;
          mergesArr[mergesArr.length - 1].e.r = index+i+value-1;
        } 
      })
      return mergesArr;
    },
    //合并行列
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if(rowIndex==0){
        return {
          rowspan:1,
          colspan:Object.keys(this.reportData.data[0]).length
        }
      }
      if(this.DepartmentName){
        if(rowIndex==1){
          return {
            rowspan:1,
            colspan:Object.keys(this.reportData.data[0]).length
          }
        }
      }
      if(this.reportTitle!==this.repTitles[7]){
        if(columnIndex ===0 || columnIndex ===1){
          if(this.firColSpanArr[rowIndex]){
            return {
              rowspan:this.firColSpanArr[rowIndex],
              colspan:1
            }
          }else{
            return {
              rowspan:0,
              colspan:0
            }
          }
        }
        if(columnIndex ===2){
          if(this.thirColSpanArr[rowIndex]){
            return {
              rowspan:this.thirColSpanArr[rowIndex],
              colspan:1
            }
          }else{
            return {
              rowspan:0,
              colspan:0
            }
          }
        }
        if(columnIndex ===3){
          if(this.fourColSpanArr[rowIndex]){
            return {
              rowspan:this.fourColSpanArr[rowIndex],
              colspan:1
            }
          }else{
            return {
              rowspan:0,
              colspan:0
            }
          }
        }
      }
    },
    //选择单位名称
    chooseName(DepartmentName){
      this.reportData.data=[];
      this.Annual='';//每次重新选择单位就先把之前选择的年份清空
      //过滤出当前选择单位所对应的数据值，包括单位名字和单位ID
      this.department=this.departments.filter((item)=>{
        return item.DepartmentName==DepartmentName;
      })[0];
      this.annualPost=true;
      this.reportPost=false;
      let postData=qs.stringify(this.department);
      let callback=(response)=>{
        this.years=response.data;
      }
      this.postTable(this.reportTitle,this.annualPost,this.reportPost,postData,callback);    
    },
    //查看报表
    checkReport(){
      let table=document.getElementById('reportForm');
      let header=table.getElementsByClassName('el-table__header-wrapper')[0];
      header.style.cssText="display:none";
      console.log(header)
      this.checked=true;
      if(this.reportTitle!==this.repTitles[7]){
        if(this.Annual){
          let checkData={year:this.Annual};
          if(this.departments.length){//当选择了单位名称时
            checkData={...this.department,year:this.Annual};
          }else if(this.$store.state.userId!='000'){
            checkData={
              DepartmentName:this.$store.state.userName,
              DepartmentID:this.$store.state.userId,
              year:this.Annual
            }
          } 
          this.reportPost=true;
          this.annualPost=false;
          let postData=qs.stringify(checkData);
          let callback=(response)=>{
            this.reportData=response.data;
          }
          this.postTable(this.reportTitle,this.annualPost,this.reportPost,postData,callback);
        }else{
          this.$message({
            message: '请输入参数“年度”的值。该参数不能为空。',
            type: 'warning'
          });
        } 
      }else{
        let callback=(response)=>{
          this.reportData=response.data;
        }
        this.postTable(this.reportTitle,null,null,null,callback);
      }
    },
    //设置列宽
    getCols(){
      let cols=[];
      let keys=Object.keys(this.reportData.data[0]);
      for(let i=0;i<keys.length;i++){
        if(keys[i]!=='备注'&&keys[i]!=='上传文档'&&keys[i]!=='项目预算名称'){
          cols.push({
            wpx:80
          });
        }
        if(keys[i]=='备注'&& this.reportTitle!=this.repTitles[8]){
          cols.push({
            wpx:160
          })
        }
        if(keys[i]=='备注'&& this.reportTitle==this.repTitles[8]){
          cols.push({
            wpx:250
          })
        }
        if(keys[i]=='上传文档'||keys[i]=='项目预算名称'){
          cols.push({
            wpx:85
          })
        }
      }
      return cols;
    },
    //生成excel表的工作区间（ABC...表示）
    generateBigLet(){
      let keys=Object.keys(this.reportData.data[0]);//返回一个包含json数据全部键名的数组
      let colNums=keys.length;
      let str=[];
      for(let i=65;i<65+colNums;i++){
        str.push(String.fromCharCode(i));
      }
      return str;
    },
    //添加单元格的样式
    addCellSty(sheet){
      let workArea=this.generateBigLet();
      let workLen=workArea.length;
      let merge1=this.mergesCell(0,this.firColSpanArr);
      let merge2=this.mergesCell(1,this.firColSpanArr);
      let merge3=this.mergesCell(2,this.thirColSpanArr);
      let merge4=this.mergesCell(3,this.fourColSpanArr);
      let mergeArr=merge1.concat(merge2).concat(merge3).concat(merge4);
      const border= { 
        top: { style: "thin"}, 
        right: { style: "thin"}, 
        bottom: { style: "thin"}, 
        left: { style: "thin"} 
      };
      const align={
        horizontal: "center" ,
        vertical: "center",
        wrapText:true
      }
      if(this.DepartmentName){
          sheet["A3"]={
            v:`单位名称：${this.DepartmentName}`,
            t:'s',
          }
          mergeArr.push({
            s:{
              c:0,r:2,
            },
            e:{
              c:workLen-1,
              r:2
            }
          })
        }
      sheet["A1"]={
        v:`${this.reportData.title}`,
        t:'s',
        s:{
          alignment:align
        }
      }
      mergeArr.push({
        s:{
          c:0,r:0,
        },
        e:{
          c:workLen-1,
          r:1
        }
      })   
      sheet["!merges"]=mergeArr;
      workArea.forEach((value,index)=>{
        let rows=this.$store.state.userId!=='000'?this.reportData.data.length-2:this.reportData.data.length+1;//+1是因为sheet表头合并了一行
        let i=this.DepartmentName===''?3:4;
        for(;i<=rows;i++){
          if(sheet[value+i]){//确保单元格存在
            sheet[value+i].s={
              border:border,
              alignment:align
            }
          }
        }
      });
    },
    //导出excel表格
    exportToExcel(){
      if(this.checked){
        let cols=this.getCols();
        /* generate workbook object from table */
        let sheet =Excel.utils.json_to_sheet(this.reportData.data);
        sheet['!cols'] = cols;
        this.addCellSty(sheet);
        try {
          FileSaver.saveAs(this.sheet2blob(sheet), `${this.reportData.title}.xlsx`)
        } catch (e) { if (typeof console !== 'undefined') console.log(e) }
      }else{
        this.$message({
          message: '请先查看报表哦~',
          type: 'warning'
        });
      }
    },
    // 字符串转ArrayBuffer
    s2ab(s) {
      let buf = new ArrayBuffer(s.length);
      let view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    },
    sheet2blob(sheet, sheetName) {
      sheetName = sheetName || 'sheet1';
      var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
      };
      workbook.Sheets[sheetName] = sheet;
      console.log(workbook.Sheets[sheetName])
      // 生成excel的配置项
      var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
      };
      var wbout = XLSX.write(workbook, wopts);//XLSX是full.min.js中的对象,并不是xlsx插件对象
      var blob = new Blob([this.s2ab(wbout)], {type:"application/octet-stream"});
      return blob;
    }
  }
}

</script>
<style lang='scss' module>
.wrapper{
  background-color:#fff;
  color:#5c87b2;
  padding-top:20px;
  h3{
    margin:0px;
  }
  .select{
    padding:20px 0px;
    display:flex;
    flex-direction:row;
    justify-content:center;
    .elselect{
      margin-right:30px;
      >span{
        margin:0px 15px;
      }
    }
  }
}
</style>