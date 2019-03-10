<template>
  <div :class="$style.wrapper">
    <el-dialog :title="revenueTitle" :visible.sync="revBoxVisible"  @close='closeDialog'>
      <el-form :model="revenue">
        <el-form-item label="收入类别名称" :label-width="formLabelWidth">
          <div :class="$style.select">
            <el-select v-model="RevenueTypeName" placeholder="请选择收入类别" @change="chooseRevType(RevenueTypeName)">
                <el-option
                  v-for="item in RevenueTypeNameOpts"
                  :key="item.RevenueTypeCode"
                  :label="item.RevenueTypeName"
                  :value="item.RevenueTypeName">
                </el-option>
              </el-select>
          </div>
        </el-form-item>
        <el-form-item label="收费项目名称" :label-width="formLabelWidth">
          <el-input v-model="revenue.ChargeProjectName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="计费单位名称" :label-width="formLabelWidth">
          <div :class="$style.select">
            <el-select v-model="CalculateUnitName" placeholder="请选择计费单位" @change="chooseCalUnit(CalculateUnitName)">
              <el-option
                v-for="item in CalculateUnitNameOpts"
                :key="item.CalculateUnitCode"
                :label="item.CalculateUnitName"
                :value="item.CalculateUnitName">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="收费标准" :label-width="formLabelWidth">
          <el-input v-model="revenue.ChargeStandard" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收费范围名称" :label-width="formLabelWidth">
          <div :class="$style.select">
            <el-select v-model="ChargeScopeName" placeholder="请选择收入范围" @change="chooseChargeScope(ChargeScopeName)">
              <el-option
                v-for="item in ChargeScopeNameOpts"
                :key="item.ChargeScopeCode"
                :label="item.ChargeScopeName"
                :value="item.ChargeScopeName">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="预算总收入" :label-width="formLabelWidth" v-if="showBudget">
          <el-input v-model="revenue.BudgetTotalRrevenue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="实际总收入" :label-width="formLabelWidth" v-if="showActual">
          <el-input v-model="revenue.ActualTotalRrevenue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="测算依据（200字以内）" :label-width="formLabelWidth">
          <el-input v-model="revenue.BudgetAccding" 
            autocomplete="off" 
            type="textarea"
            :rows="5">
          </el-input>
        </el-form-item>
        <el-form-item label="备注（200字以内）" :label-width="formLabelWidth">
          <el-input v-model="revenue.Notes" 
            autocomplete="off" 
            type="textarea"
            :rows="5">
          </el-input>
        </el-form-item>
        <el-form-item label="说明（超过500字请上传附件）" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="/api/add/BudgetTotalRrevenue"
            accept=".xls,.xlsx,.doc,.docx"
            :auto-upload="false"
            :on-change="loadFile"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :multiple="false"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">选择</el-button>
            <div slot="tip" class="el-upload__tip">文件必须小于: 10 MB(只允许上传doc、xls、docx、xlsx</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="subRevCancel">取 消</el-button>
        <el-button type="primary" @click="subRevenue">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props:{
    revBoxVisible:{
      type:Boolean,
      default:false
    },
    revenueTitle:{
      type:String,
      default:''
    },
    revenue:{
      type:Object,
      default:function(){
        return {
          ChargeProjectName:'',
          ChargeStandard:'',
          BudgetTotalRrevenue:'',
          ActualTotalRrevenue:'',
          BudgetAccding:'',
          Notes:''
        }
      }
    },
    RevenueTypeNameOpts:{
      type:Array,
      default:function(){
        return [{
          "RevenueTypeCode":'', 
          "RevenueTypeName": ''
        }]
      }
    },
    CalculateUnitNameOpts:{
      type:Array,
      default:function(){
        return [{
          "CalculateUnitCode": '',
          "CalculateUnitName": ''
        }]
      }
    },
    ChargeScopeNameOpts:{
      type:Array,
      default:function(){
        return [{
          "ChargeScopeCode": '', 
          "ChargeScopeName": ''
        }]
      }
    }
  },
  data () {
    return {
      fileName:"",
      fileList: [],
      formLabelWidth: '210px',
      RevenueTypeName:'',
      CalculateUnitName:'',
      ChargeScopeName:'',
      BudgetAccding:'',
      revenueTitle:'',
      showBudget:false,
      showActual:false,
      RevenueTypeNameOpts:[],
      CalculateUnitNameOpts:[],
      ChargeScopeNameOpts:[],
      revenue:{
        ChargeProjectName:'',
        ChargeStandard:'',
        BudgetTotalRrevenue:'',
        ActualTotalRrevenue:'',
        BudgetAccding:'',
        Notes:''
      },
    };
  },
  //由于数据更改导致的虚拟DOM重新渲染
  updated(){
    this.showBudOrAct();
  },
  methods: {
    //显示预算总收入输入框还是实际总收入输入框
    showBudOrAct(){
      if(this.revenueTitle=='添加收入预算明细'||this.revenueTitle=='更新收入预算明细'){
        this.showBudget=true;
        this.showActual=false;
      }
      if(this.revenueTitle=='添加实际收入明细'||this.revenueTitle=='更新实际收入明细'){
        this.showBudget=false;
        this.showActual=true;
      }
    },
    //选择收入类别
    chooseRevType(RevenueTypeName){
      this.RevenueType=this.RevenueTypeNameOpts.filter((item)=>{
        return item.RevenueTypeName==RevenueTypeName;//return不能掉，否则没有值返回
      })[0];
    },
    //选择计费单位
    chooseCalUnit(CalculateUnitName){
      this.CalculateUnit=this.CalculateUnitNameOpts.filter((item)=>{
        return item.CalculateUnitName==CalculateUnitName;
      })[0];
    },
    //选择收入范围
    chooseChargeScope(ChargeScopeName){
      this.ChargeScope=this.ChargeScopeNameOpts.filter((item)=>{
        return item.ChargeScopeName==ChargeScopeName;
      })[0]
    },
    //触发父组件上的提交事件
    subRevenue(){
      let year=new Date().getFullYear();
      if(this.showBudget){
        delete this.revenue['ActualTotalRrevenue'];
        year+=1
      }
      else if(this.showActual){
        delete this.revenue['BudgetTotalRrevenue'];
      }
      const revenueData={ApplyDpartmentID:this.$store.state.userId, ApplyDpartmentName:this.$store.state.userName, Annual:year,...this.revenue,...this.RevenueType,...this.CalculateUnit,...this.ChargeScope};
      if(this.fileName){
        revenueData.FileName=this.fileName;
      }
      this.$refs.upload.submit();
      this.fileList=[];//文件提交以后清空显示的文件列表
      this.RevenueTypeName='';
      this.CalculateUnitName='';
      this.ChargeScopeName='';
      this.$emit('subRevenue',revenueData);
      this.fileName='';
    }, 
    //触发父组件上的取消提交事件
    subRevCancel(){
      this.fileName='';
      this.$emit('subRevCancel');
    },
    //添加文件
    loadFile(file,fileList){
      this.fileName=file.name;
      this.fileList=fileList;
    },
    //用户选择文件数目超过限定数目
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    //提示用户是否删除
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    //关闭对话框
    closeDialog(){
      this.fileName='';
      this.$emit('closeRevenue');
    }
  }
}
</script>

<style lang="scss" module>
.wrapper{
  i{
    position: absolute;
    right: 10px;
  }
  button{
    width:140px;
  }
  .select{
    text-align: left;
  }
}
</style>