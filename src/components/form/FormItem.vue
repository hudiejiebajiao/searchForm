<template>
  <el-form-item
    v-if="!formItem.isNotShow"
    :label="formItem.label"
    :prop="formItem.model"
    class="form_item "
    :style="{ width: formItem.width }"
    :label-width="formItem.labelWidth"
  >
    <template v-slot:label v-if="$slots.label">
      <slot name="label"></slot>
    </template>
    <el-select
      v-if="formItem.type === 'select'"
      v-model="model"
      v-loadmore="loadmore"
      ref="formItem"
      :filterable="formItem.filterable"
      :remote="formItem.remote"
      :multiple="formItem.multiple"
      :disabled="formItem.disabled"
      :clearable="!formItem.notClearable"
      :collapse-tags="formItem.collapseTags"
      :multiple-limit="formItem.multipleLimit || 0"
      :allow-create="formItem.allowCreate"
      :filter-method="formItem.filterMethod"
      :remote-method="formItem.remoteMethod"
      :loading="formItem.loading"
      :reserve-keyword="formItem.reserveKeyword"
      :default-first-option="formItem.defaultFirstOption"
      :size="formItem.size"
      :placeholder="formItem.placeholder"
      :value-key="formItem.valueKey"
      :class="{ item: true, 'select-suffix': formItem.suffix }"
      @clear="(v) => handleChange('change', formItem.clear, v)"
      @change="(v) => handleChange('change', formItem.onChange, v)"
    >
      <el-option
        v-for="item in formItem.options"
        :key="formItem.optionsValue ? item[formItem.optionsValue] : item.value"
        :label="
          formItem.optionsLabel ? item[formItem.optionsLabel] : item.label
        "
        :value="
          formItem.valueKey
            ? item
            : formItem.optionsValue
            ? item[formItem.optionsValue]
            : item.value
        "
      ></el-option>
    </el-select>
    <el-input
      v-if="formItem.type === 'input'"
      v-model.trim="model"
      ref="formItem"
      :clearable="!formItem.notClearable"
      :disabled="formItem.disabled"
      :prefix-icon="formItem.prefixIcon"
      :suffix-icon="formItem.suffixIcon"
      :rows="formItem.rows || 2"
      :size="formItem.size"
      :autosize="formItem.autosize"
      :readonly="formItem.readonly"
      :autofocus="formItem.autofocus"
      :placeholder="formItem.placeholder"
      :type="formItem.inputType"
      :maxlength="formItem.maxlength"
      :show-word-limit="formItem.showWordLimit"
      class="item"
      @input="(v) => handleChange('input', formItem.onInput, v)"
      @change="(v) => handleChange('change', formItem.onChange, v)"
      @blur="(v) => handleChange('blur', formItem.onBlur, v)"
      @focus="(v) => handleChange('focus', formItem.onFocus, v)"
    ></el-input>
    <el-date-picker
      v-if="formItem.type === 'datePicker'"
      v-model="model"
      ref="formItem"
      :size="formItem.size"
      :editable="formItem.editable"
      :clearable="!formItem.notClearable"
      :type="formItem.daterange"
      range-separator="至"
      :disabled="formItem.disabled"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :value-format="formItem.valueFormat"
      :default-time="formItem.defaultTime"
      :picker-options="formItem.pickerOptions"
      :placeholder="formItem.placeholder"
      class="item"
      @change="(v) => handleChange('change', formItem.onChange, v)"
    >
    </el-date-picker>
    <el-radio-group
      v-if="formItem.type === 'radio'"
      v-model="model"
      ref="formItem"
      :disabled="formItem.disabled"
      @change="(v) => handleChange('change', formItem.onChange, v)"
    >
      <el-radio
        v-for="item in formItem.options"
        :key="item.value"
        :label="item.value"
        >{{ item.label }}</el-radio
      >
    </el-radio-group>
    <TreeSelector
      v-if="formItem.type === 'TreeSelector'"
      :class="{ item: true, 'select-suffix': formItem.suffix }"
      v-model="model"
      ref="formItem"
      :tree-structure="formItem.treeStructure"
      :search="formItem.search"
      :alwaysTop="formItem.alwaysTop"
      :default-props="formItem.defaultProps"
      :clearable="!formItem.notClearable"
      :accordion="formItem.accordion"
      :index="formItem.index"
      :disabled="formItem.disabled"
      :isParentCode="formItem.isParentCode"
      :placeholder="formItem.placeholder"
      :showCheckbox="formItem.showCheckbox"
      :collapseTags="formItem.collapseTags"
      :checkStrictly="formItem.checkStrictly"
      @change="(v) => handleChange('change', formItem.onChange, v)"
    ></TreeSelector>
    <InputMultiple
      v-if="formItem.type === 'InputMultiple'"
      v-model="model"
      ref="formItem"
      :placeholder="formItem.placeholder"
      :limit="formItem.limit"
      class="item"
      @change="(v) => handleChange('change', formItem.onChange, v)"
    ></InputMultiple>
  </el-form-item>
</template>
<script>
import InputMultiple from "./multiple";
import TreeSelector from "./TreeSelector";
export default {
  name: "FormItem",
  components: {
    InputMultiple,
    TreeSelector
  },
  props: {
    formItem: {
      type: Object,
      default: () => ({
        label: "ceshi",
        model: "subjectName",
        placeholder: "ceshi",
        type: "input"
      })
    },
    value: {
      type: String | Number,
      default: () => ""
    }
  },
  data() {
    return {
      model: "",
      pageNum: 1,
      flag: true
    };
  },
  watch: {
    value(v) {
      this.model = JSON.parse(JSON.stringify(v));
    }
  },
  created() {
    this.model = JSON.parse(JSON.stringify(this.value));
  },

  methods: {
    handleChange(type, func, v) {
      if (type === "change") {
        this.$emit("input", v);
      }
      if (!func) return;
      func.call(this, v);
    },
    loadmore() {
      if (this.formItem.loadmore) {
        this.formItem.loadmore.call(this, this.$refs.formItem.query);
      }
    },
    async remoteMethod(query, type, funcName) {
      this.pageNum = 1;
      this.flag = true;
      this[type] = await this[funcName](query);
    },
    // 下拉滚动
    async loadmoreFun(type, funcName, query) {
      if (this[type].length % ten === 0 && this.flag) {
        this.pageNum += 1;
        const list = await this[funcName](query);
        if (!list.length) {
          this.flag = false;
        }
        this[type] = this[type].concat(...list);
      }
    }
  }
};
</script>
<style scoped lang="less">
.form_item {
  .item {
    width: 100%;
  }
}
// .select-suffix {
//   /deep/ .el-icon- {
//     &::before {
//       content: '\E6E1';
//     }
//   }
//   /deep/ .el-icon-circle-close {
//     font-size: 12px !important;
//     transform: none !important;
//     display: flex;
//     display: -webkit-flex;
//     align-items: flex-end;
//     &::before {
//       content: '清除';
//     }
//   }
//   /deep/ .is-focus {
//     .el-icon- {
//       transform: rotate(0) !important;
//     }
//   }
// }
</style>
