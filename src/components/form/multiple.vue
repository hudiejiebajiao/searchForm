<template>
  <div style="position: relative; background: #fff">
    <div
      :class="{ select_input: true, 'hidden-scroll': eviNoList.length < 5 }"
      @click="showInput"
    >
      <div class="select">
        <div class="write" v-if="eviNoList.length === 0 && isShow">
          {{ placeholder }}
        </div>
        <el-tooltip
          :key="tag"
          v-for="tag in eviNoList"
          class="item"
          effect="dark"
          :content="tag"
          placement="top"
        >
          <el-tag
            color="#F2F2F2"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
        </el-tooltip>

        <el-input
          ref="saveTagInput"
          v-if="true"
          class="input-new-tag"
          v-model="eviNoValue"
          @keyup.enter.native="handleInputConfirm('keyup')"
          @blur="handleInputConfirm('blur')"
          size="mini"
        >
        </el-input>
      </div>
      <div v-if="eviNoList.length > 0" class="delete" @click="clearAll">
        <span>清空</span>
      </div>
      <div class="condition" v-if="isShow">
        <p>
          一次最多查询{{ limit }}条，可以以逗号，空格，回车分隔开，已自动去重
        </p>
      </div>
    </div>
    <p class="tip" v-if="tip">{{ tip }}</p>
  </div>
</template>

<script>
const twenty = 20;
export default {
  name: "InputMultiple",
  props: {
    placeholder: {
      type: String,
      default: () => ""
    },
    limit: {
      type: Number,
      default: () => twenty
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      eviNoList: [],
      inputVisible: false,
      isShow: true,
      eviNoValue: "",
      tip: ""
    };
  },
  watch: {
    value: {
      handler(v) {
        this.eviNoList = v;
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    showInput() {
      this.isShow = false;
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除查询内容
    handleClose(tag) {
      const one = 1;
      this.eviNoList.splice(this.eviNoList.indexOf(tag), one);
      this.$emit("change", this.eviNoList);
    },
    // 输入框
    handleInputConfirm(status) {
      this.eviNoValue = this.eviNoValue.trim().replace(/\s+|\uff0c/g, ",");
      const newList = this.eviNoValue.split(",") || [];
      if (newList.length) {
        this.eviNoList = this.distinct(this.eviNoList, newList);
        if (this.eviNoList.length > this.limit) {
          this.eviNoList = this.eviNoList.slice(0, this.limit);
          this.tip = `*您已输入超过${this.limit}条，系统将自动截取并显示前${this.limit}条的信息。`;
        } else {
          this.tip = "";
        }
      }
      if (this.eviNoList.length === 0) {
        this.isShow = true;
      }
      this.eviNoValue = "";
      if (status === "keyup") {
        this.$nextTick((_) => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      } else {
        this.inputVisible = false;
      }
      this.$emit("change", this.eviNoList);
    },
    // 数组去重
    distinct(a, b) {
      const arr = a.concat(b);
      const result = [];
      for (const i of arr) {
        if (i) {
          !result.includes(i) && result.push(i);
        }
      }

      return result;
    },
    // 删除全部
    clearAll() {
      this.eviNoList = [];
      this.isShow = true;
    }
  }
};
</script>

<style scoped lang="less">
.select_input {
  // font-size: 14px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  padding: 10px 30px 10px 10px;
  height: 84px;
  overflow-y: scroll;
  color: #c0c4cc;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 4px;
  }

  &:hover::-webkit-scrollbar-thumb {
    background: hsla(0, 0%, 53%, 0.4);
  }

  &:hover::-webkit-scrollbar-track {
    background: hsla(0, 0%, 53%, 0.1);
  }

  .select {
    display: flex;
    display: -webkit-flex;
    box-sizing: border-box;
    align-content: center;
    flex-wrap: wrap;
    width: 100%;
    // height: 100%;

    background-color: #fff;
    text-align: left;

    .el-tag {
      position: relative;
      margin-right: 10px;
      margin-bottom: 10px;
      padding-right: 20px;
      border: none;
      max-width: 158px;
      height: 25px;
      line-height: 25px;
      color: #959595;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      /deep/ .el-tag__close {
        position: absolute;
        top: 5px;
        right: 5px;
      }
    }
    // .row {
    //   width: 70px;
    //   overflow: hidden;
    //   text-overflow: ellipsis;
    //   white-space: nowrap;
    // }
  }
  .delete {
    position: absolute;
    right: 10px;
    bottom: 0;
    // width: 25px;
    // height: 100%;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
  }
  .write {
    margin-left: 10px;
    // color: #5a5a5a;
  }
  .condition {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    // color: #5a5a5a;
    p {
      text-align: center;
      margin: 0;
    }
  }
  .input-new-tag {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    width: 300px;
    margin-bottom: 10px;
    height: 25px;
    /deep/ input {
      height: 25px;
      outline: none;
      border: none;
      box-shadow: none;

      &:focus {
        outline: none;
        border: none;
        box-shadow: none !important;
      }
    }
  }
}
.hidden-scroll {
  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.tip {
  position: absolute;
  bottom: -30px;
  color: red;
}
</style>
