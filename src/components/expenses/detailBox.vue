<template>
  <div :class="$style.wrapper">
    <el-dialog title="添加申报预算明细信息" :visible.sync="detailVisible" @close="closeDetail">
      <el-form :model="detail" ref="detailForm">
        <el-form-item label="本项目预算明细之一" :label-width="formLabelWidth">
          <el-input v-model="detail.ProjectBudgetName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目预算金额（元）" :label-width="formLabelWidth">
          <el-input v-model="detail.ProjectBudgetMoney" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="测算依据（200字以内）" :label-width="formLabelWidth">
          <el-input v-model="detail.BudgetAccding" 
            autocomplete="off" 
            type="textarea"
            :rows="5">
          </el-input>
        </el-form-item>
        <el-form-item label="备注（200字以内）" :label-width="formLabelWidth">
          <el-input v-model="detail.Notes" 
            autocomplete="off" 
            type="textarea"
            :rows="5">
          </el-input>
        </el-form-item>
      </el-form>
      <p :class="$style.illustrate">说明（超过500字请上传附件）</p>
      <el-upload
        ref="upload"
        class="upload-demo"
        action="/api/add/details"
        accept=".xls,.xlsx,.doc,.docx"
        :auto-upload="false"
        :on-change="loadFile"
        :before-remove="beforeRemove"
        :multiple="false"
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList">
        <el-button size="small" type="primary">选择</el-button>
        <div slot="tip" class="el-upload__tip">文件必须小于: 10 MB(只允许上传doc、xls、docx、xlsx</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="subDetailCancel">取 消</el-button>
        <el-button type="primary" @click="subDetail">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props:{
    detailVisible:{
      type:Boolean,
      default:false
    },
    detail:{
      type:Object,
      default:function(){
        return {
          //ProjectID:'',
          Annual:new Date().getFullYear()+1,
          BudgetAccding:'',
          Notes:'',
          ProjectBudgetMoney:'',
          ProjectBudgetName:'',
          Illustration:''
        }
      }
    }
  },
  data () {
    return {
      fileName:'',
      fileList: [],
      formLabelWidth: '210px',
      detail: {
        BudgetAccding:'',
        Notes:'',
        ProjectBudgetMoney:'',
        ProjectBudgetName:'',
      },
    };
  },
  methods: {
    //清空内容
    clearAll(){
      this.detail={
        BudgetAccding:'',
        Notes:'',
        ProjectBudgetMoney:'',
        ProjectBudgetName:''
      };
    },
    subDetail(){
      if(this.fileName)
      {       
        this.detail.FileName=this.fileName;
      }
      this.$refs.upload.submit();
      this.fileList=[];//文件提交以后清空显示的文件列表
      this.fileName='';//提交以后要将文件名清空，要不然下次提交时没添加文件，也会再次提交文件
      this.$emit('subDetail',this.detail);
    },
    subDetailCancel(){
      this.fileName='';
      this.$emit('subDetailCancel');
    },
    loadFile(file,fileList){
      this.fileName=file.name;
      this.fileList=fileList;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    closeDetail(){
      this.clearAll();
      this.fileName='';
      this.$emit('closeDetail');
    },
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
  .illustrate{
    margin:15px 0px;
    font-weight: bold;
  }
}
</style>