<template>
  <div class="home">
    <search-form
      :searchFormList="searchFormList"
      :formInfo="searchForm"
      :rules="{}"
      class="search-form"
      @searchForm="searchFormFun"
      @resetForm="resetForm"
    ></search-form>
  </div>
</template>

<script>
// @ is an alias to /src
import SearchForm from "@/components/form/SearchForm";

const defaultObj = {
  businessId: "",
  name: "",
  subjectId: ""
};
export default {
  name: "Home",
  components: {
    SearchForm
  },
  data() {
    return {
      // 搜索数据
      searchForm: {
        id: "",
        name: "",
        multiple: [],
        datePicker: [],
        channels: [],
        sex: "",
        modifyTime: ""
      },
      options: [],
      pageNum: 1,
      flag: true,
      treeStructure: [
        {
          label: "测试1",
          value: "test1",
          children: [
            {
              label: "测试2",
              value: "test2",
              children: [
                {
                  label: "测试3",
                  value: "test3"
                }
              ]
            }
          ]
        },
        {
          label: "测试4",
          value: "test4",
          children: [
            {
              label: "测试6",
              value: "test6"
            }
          ]
        },
        {
          label: "测试5",
          value: "test5"
        }
      ]
    };
  },
  computed: {
    searchFormList() {
      const that = this;

      return [
        {
          label: "姓名",
          model: "name",
          placeholder: "请输入姓名",
          type: "input"
        },
        {
          label: "号码",
          model: "id",
          placeholder: "请选择号码",
          type: "select",
          options: this.options,
          filterable: true,
          remote: true,
          reserveKeyword: true,
          suffix: true,
          clear() {
            that.remoteMethod("", "options", "getIdList");
          },
          remoteMethod(query) {
            const searchContent = query.trim() || "";
            that.remoteMethod(searchContent, "options", "getIdList");
          },
          loadmore(v) {
            that.loadmore("options", "getIdList", v);
          }
        },
        {
          label: "查询时间",
          model: "modifyTime",
          placeholder: "请选择查询时间",
          type: "datePicker",
          daterange: "datetime",
          valueFormat: "timestamp"
        },
        {
          label: "性别",
          model: "sex",
          type: "radio",
          options: [
            {
              label: "男",
              value: 1
            },
            {
              label: "女",
              value: 0
            }
          ]
        },
        {
          label: "渠道",
          model: "channels",
          type: "TreeSelector",
          treeStructure: this.treeStructure,
          placeholder: "请选择渠道",
          // width: "50%",
          checkStrictly: true,
          suffix: true,
          defaultProps: {
            value: "value",
            children: "children",
            label: "label"
          },
          showCheckbox: true
        },
        {
          label: "时间范围",
          model: "datePicker",
          placeholder: "请选择时间范围",
          type: "datePicker",
          daterange: "datetimerange",
          // width: "50%",
          valueFormat: "timestamp",
          onChange(value) {
            that.searchForm.startTime = value[0];
            that.searchForm.endTime = value[1];
          }
        },
        {
          label: "条件名称",
          model: "multiple",
          placeholder: "请输入名称",
          type: "InputMultiple",
          width: "100%"
        }
      ];
    }
  },
  methods: {
    searchFormFun() {
      // this.getList()
    },
    resetForm() {
      this.searchForm = {
        id: "",
        name: "",
        multiple: [],
        datePicker: [],
        channels: [],
        sex: "",
        modifyTime: ""
      };
      this.searchFormFun();
    },
    getIdList(query) {
      return new Promise(function(resolve, reject) {
        resolve([
          {
            label: "测试",
            value: "test"
          }
        ]);
      });
    },
    async remoteMethod(query, type, funcName) {
      this.pageNum = 1;
      this.flag = true;
      this[type] = await this[funcName](query);
    },
    // 下拉滚动
    async loadmore(type, funcName, query) {
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

<style lang="less" scoped>
// .search-form {
//   width: 100%;
// }
</style>
