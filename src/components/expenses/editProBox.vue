<template>
  <div>
    <el-dialog title="修改项目信息" :visible.sync="editProVisible" @close="closeEdit">
      <el-form> 
        <el-form-item label="项目名称" :label-width="formLabelWidth">
          <el-input v-model="projectName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="subEditCancel">取 消</el-button>
        <el-button type="primary" @click="subEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props:{
    editProVisible:{
      type:Boolean,
      default:false
    },
    projectName:{
      type:String,
      default:'',
    }
  },
  data () {
    return {
      formLabelWidth: '140px',
    };
  },
  methods: {
    subEdit(){
      this.$emit('subEdit',this.projectName);
    },
    subEditCancel(){
      this.$emit('subEditCancel');
    },
    closeEdit(){
      this.projectName=''
      console.log(this.projectName);
      this.$emit('closeEdit');
    }
  }
}

</script>
<style lang="scss" module>
</style>