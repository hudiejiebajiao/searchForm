<template>
  <el-form
    ref="ruleForm"
    :model="formInfo"
    :rules="rules"
    label-position="right"
    label-width="130px"
    class="demo-ruleForm"
  >
    <FormItem
      :ref="formItem.model"
      v-for="formItem in formList"
      :key="formItem.model"
      v-model="formInfo[formItem.model]"
      :formItem="formItem"
      :class="{
        form_item: true,
        form_item1: limit === 4,
        form_item2: limit === 3
      }"
    ></FormItem>
    <el-form-item
      :class="{
        form_item: true,
        form_search: true,
        form_item1: limit === 4,
        form_item2: limit === 3
      }"
      style="flex: 1 1 auto; text-align: right"
    >
      <el-button
        class="btn-main search"
        type="primary"
        size="mini"
        @click="searchForm"
        >{{ searchBtnName }}</el-button
      >
      <el-button class="btn-routine search" size="mini" @click="resetForm"
        >重置</el-button
      >
      <el-button
        v-if="
          fullWidth > 1440
            ? evidenceFormList.length > 3
            : evidenceFormList.length > 2
        "
        :icon="showInput ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
        size="mini"
        class="btn-routine"
        @click="showInput = !showInput"
      ></el-button>
    </el-form-item>
  </el-form>
</template>
<script>
const four = 4;
import FormItem from "./FormItem";

export default {
  name: "SearchForm",
  components: {
    FormItem
  },
  props: {
    evidenceFormList: {
      type: Array,
      default: () => []
    },
    formInfo: {
      type: Object,
      default: () => {}
    },
    rules: {
      type: Object,
      default: () => {}
    },
    limit: {
      type: Number,
      default: () => four
    },
    searchBtnName: {
      type: String,
      default: () => "查询"
    }
  },
  data() {
    return {
      showInput: false,
      fullWidth: document.documentElement.clientWidth
    };
  },
  computed: {
    formList() {
      const three = 3;
      const two = 2;
      const width = 1440;
      const num = this.fullWidth > width ? three : two;
      const newList = this.evidenceFormList.filter((item) => !item.notShow);

      return newList && newList.length >= num && this.showInput
        ? newList
        : newList.slice(0, num);
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },

  methods: {
    handleResize() {
      this.fullWidth = document.documentElement.clientWidth;
    },
    handleChange(func, v) {
      if (!func) return;
      func.call(this, v);
    },
    searchForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.showInput = false;
          this.$emit("searchForm", this.formInfo);
        } else {
          console.log("error submit!!");

          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.$emit("resetForm", this.formInfo);
    }
  }
};
</script>
<style scoped lang="less">
.el-form {
  // width: 100%;
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  align-items: flex-start;
  // padding: 20px 0;
  .form_search {
    /deep/ .el-form-item__content {
      margin-left: 0 !important;
    }
  }
  .form_item {
    // flex: 1;
    // display: flex;
    // margin: 10px 0;
    // justify-content: flex-end;

    .evi-showMore,
    .evi-showUp {
      border: 1px solid #e0e0e0;
      padding: 7px;
      margin-left: 10px;
    }
    .item {
      width: 100%;
    }
  }
  @media screen and (max-width: 1440px) {
    .form_item1 {
      width: 33%;
    }
    .form_item2 {
      width: 50%;
    }
    .form_date {
      width: 66%;
    }
  }
  @media screen and (min-width: 1441px) {
    .form_item1 {
      width: 25%;
    }
    .form_item2 {
      width: 33%;
    }
    .form_date {
      width: 50%;
    }
  }
}
</style>
