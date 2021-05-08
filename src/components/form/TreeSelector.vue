<template>
  <el-select
    ref="selectRef"
    v-model="valueTitle"
    style="width: 100%"
    :disabled="disabled"
    :clearable="clearable"
    :placeholder="placeholder || '请选择'"
    @value="valueTitle"
    :multiple="showCheckbox"
    :collapse-tags="collapseTags"
    @visible-change="initScrollBarToTop"
    @remove-tag="removeTag"
    @clear="clearHandle"
  >
    <el-option
      :disabled="!treeStructure.length"
      :value="valueTitle"
      :label="showCheckbox ? valueTitle[0] : valueTitle"
    >
      <div v-if="search" class="search-container">
        <el-input
          v-model="searchValue"
          debounce
          placeholder="请输入搜索"
          class="search-text"
          type="text"
          @click.native.stop
        >
          <el-button slot="append" icon="el-icon-search" />
        </el-input>
      </div>
      <el-tree
        id="tree-option"
        ref="selectTree"
        :accordion="true"
        :data="treeStructure"
        :props="defaultProps"
        :node-key="defaultProps.value"
        highlight-current
        :show-checkbox="showCheckbox"
        @check-change="handleCheckChange"
        :filter-node-method="filterNode"
        :default-expanded-keys="defaultExpandedKey"
        @node-click="handleNodeClick"
        :check-strictly="checkStrictly"
      />
    </el-option>
  </el-select>
</template>
<script>
export default {
  name: "TreeSelector",
  props: {
    search: {
      type: Boolean,
      default: false
    },
    alwaysTop: {
      // 是否回到顶点
      type: Boolean,
      default: false
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          value: "value",
          children: "children",
          label: "label"
        };
      }
    },
    /* 选项列表数据(树形结构的对象数组) */
    treeStructure: {
      type: Array,
      default: () => {
        return [];
      }
    },
    /* 初始值 */
    value: {
      type: String | Array,
      default: () => {
        return "";
      }
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    checkStrictly: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    index: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否只能选择父节点
    isParentCode: {
      type: Boolean,
      default: false
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      searchValue: "",
      valueId: this.value, // 初始值
      valueTitle: "",
      defaultExpandedKey: [],
      num: 0
    };
  },
  watch: {
    searchValue(val) {
      this.$refs.selectTree.filter(val);
    },
    value() {
      this.valueId = this.value;
      this.initHandle();
    }
  },
  mounted() {
    this.valueTitle = this.valueId; // 初始化显示

    this.initHandle();
  },
  created() {},
  methods: {
    initScrollBarToTop(visible) {
      if (visible && (!this.firstSetScrollTop || this.alwaysTop)) {
        // 第一次打开弹框设置到顶端 （第一次firstSetScrollTop是undefine）
        setTimeout(() => {
          try {
            // 防止报错影响组件使用
            this.$refs.selectRef.$refs.scrollbar.$refs.wrap.scrollTop = 0;
            this.firstSetScrollTop = true;
          } catch (error) {
            console.log(error);
          }
        }, 0);
      }
    },
    filterNode(value, data) {
      if (!value) return true;

      return data[this.defaultProps.label].indexOf(value) !== -1;
    },
    // 初始化值
    initHandle() {
      if (this.showCheckbox) {
        if (this.valueId && this.valueId.length) {
          this.valueId.forEach((item) => {
            // if (this.$refs.selectTree.getCheckedNodes().some(checked => checked.orgCode === item)) {
            //   return
            // }
            this.$refs.selectTree.setChecked(item, true); // 设置默认选中
          });
          this.defaultExpandedKey = this.valueId; // 设置默认展开
        } else {
          this.$refs.selectTree.getCheckedNodes().forEach((item) => {
            this.$refs.selectTree.setChecked(
              item[this.defaultProps.value],
              false
            );
          });
          this.valueTitle = [];
        }

        return;
      }
      if (this.valueId) {
        this.$refs.selectTree.setCurrentKey(this.valueId); // 设置默认选中
        this.defaultExpandedKey = [this.valueId]; // 设置默认展开
      } else {
        this.valueTitle = "";
      }
    },
    // 切换选项
    handleNodeClick(node) {
      if (this.isParentCode) {
        this.$refs.selectRef.blur(); // 选中后 使隐藏下拉框
        if (this.showCheckbox) {
          this.valueTitle = this.$refs.selectTree
            .getCheckedNodes()
            .map((item) => {
              return item[this.defaultProps.label];
            });
          this.valueId = this.$refs.selectTree.getCheckedNodes().map((item) => {
            return item[this.defaultProps.value];
          });
          this.defaultExpandedKey = this.valueId;
          this.$emit("change", this.valueId);
        } else {
          this.valueTitle = node[this.defaultProps.label];
          this.valueId = node[this.defaultProps.value];
        }

        this.$emit("noderoot", node);
      } else if (node.children.length === 0) {
        this.$refs.selectRef.blur(); // 选中后 使隐藏下拉框
        if (this.showCheckbox) {
          this.valueTitle = this.$refs.selectTree
            .getCheckedNodes()
            .map((item) => {
              return item[this.defaultProps.label];
            });
          this.valueId = this.$refs.selectTree.getCheckedNodes().map((item) => {
            return item[this.defaultProps.value];
          });
          // this.defaultExpandedKey = this.valueId
          this.$emit("change", this.valueId);
        } else {
          this.valueTitle = node[this.defaultProps.label];
          this.valueId = node[this.defaultProps.value];
        }

        this.$emit("noderoot", node);
        this.defaultExpandedKey = [];
      }
    },
    handleCheckChange(data, checked) {
      if (this.showCheckbox) {
        checked && this.checkedAllChildren(data);
        this.valueTitle = this.$refs.selectTree
          .getCheckedNodes()
          .map((item) => {
            return item[this.defaultProps.label];
          });
        this.valueId = this.$refs.selectTree.getCheckedNodes().map((item) => {
          return item[this.defaultProps.value];
        });
        this.defaultExpandedKey = this.valueId;
        this.$emit("change", this.valueId);
      } else {
        this.$emit("change", data[this.defaultProps.value]);
      }
    },
    checkedAllChildren(data) {
      if (data.children && data.children.length) {
        data.children.forEach((item) => {
          this.$refs.selectTree.setChecked(item, true); // 设置默认选中
          if (item.children && item.children.length) {
            this.checkedAllChildren(item);
          }
        });
      }
    },
    removeTag(tag) {
      this.valueId = this.$refs.selectTree
        .getCheckedNodes()
        .filter((item) => item[this.defaultProps.label] !== tag);
      const currentTagId = this.$refs.selectTree
        .getCheckedNodes()
        .find((item) => item[this.defaultProps.label] === tag)[
        this.defaultProps.value
      ];
      this.$refs.selectTree.setChecked(currentTagId, false);
    },
    // 清除选中
    clearHandle() {
      this.valueId = null;
      this.defaultExpandedKey = [];
      this.clearSelected();
      if (this.showCheckbox) {
        this.$refs.selectTree.getCheckedNodes().forEach((item) => {
          this.$refs.selectTree.setChecked(
            item[this.defaultProps.value],
            false
          );
        });
        this.valueTitle = [];
        this.$emit("change", this.valueId);

        return;
      }
      this.valueTitle = "";
      this.$emit("noderoot", null);
      this.$emit("change", this.valueId);
    },
    /* 清空选中样式 */
    clearSelected() {
      const allNode = document.querySelectorAll("#tree-option .el-tree-node");
      for (let i = 0; i < allNode.length; i++) {
        allNode[i] = allNode[i].classList.remove("is-current");
      }
    }
  }
};
</script>
<style lang="less" scoped>
.el-scrollbar__wrap {
  margin-right: -40px;
}
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  padding: 0;
  overflow: hidden;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
/deep/ ul li .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
  line-height: 26px;
}
.el-tree-node__label {
  font-weight: normal;
}
/deep/ .el-tree .is-current .el-tree-node__label {
  color: #409eff;
  font-weight: 700;
}
/deep/ .el-tree .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}

.search-container {
  padding-left: 15px;
  padding-right: 10px;
  margin-bottom: 8px;
  background-color: #fff;
  .search-text {
    border: none;
    border-bottom: 1px solid #d9d9d9;
    /deep/ .el-input__inner {
      border: none;
    }
  }
}

.el-select-dropdown__item {
  background-color: #fff;
}

/deep/ .el-input-group__append {
  background: none;
  border: none;
}
</style>
