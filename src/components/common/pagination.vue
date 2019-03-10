<template>
  <div :class="$style.wrapper">
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="10"
      :pager-count="11"
      layout="prev, pager, next, jumper"
      :total="pageNum">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props:{
    pageNum:{
      type:Number,
      default:''
    },
    currentPage:{
      type:Number,
      default:''
    }
  },
  data () {
    return {
       
    };
  },
  methods: {
    handleCurrentChange(cur) {
      this.$emit('getPage',cur); //子组件中触发父组件的getPage方法并传值
    }
  }
}

</script>
<style lang="scss" module>
.wrapper{
  background-color:#fff;
}
</style>