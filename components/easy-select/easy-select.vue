<template>
  <view class="easy-select" @click.stop="trigger" :style="[easySelectSize]">
    <input
      type="text"
      v-model="value"
      :placeholder="placeholder"
      disabled
      clearable
    />
    <view class="clickMask" @click.stop="trigger"></view>
    <view  class="easy-select-suffix" style="top:2px" v-if="value !=undefined&& value!=null && value.length!=0 && emptyStatus&&!forbidden"  @click="empty">x</view>
    <view v-else
      class="easy-select-suffix"
      :style="{ border: '1px solid rgba（0,0,0,0)' }"
      :class="[showSuffix]"
    >
      
      
      <view  class="easy-select-down-tag"><u-icon name="arrow-up-fill" class="icons" color="#2a82e4" size="12" ></u-icon></view>
    </view>
    <view
      class="easy-select-options"
      v-if="showOptions"
      :style="{
        'min-width': boundingClientRect.width + 'px',
        top: optionsGroupTop,
        margin: optionsGroupMargin,
      }"
    >
      <view
        class="easy-select-options-item"
        v-for="item in options"
        :key="item.value"
        @click.stop="select(item)"
        :class="{ active: currentSelect.label === item.label }"
      >
        <text>{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * easy-select
 * @author Snoop zhang
 * @description Select Component
 * */
const COMPONENT_NAME = "easy-select";
const MAX_OPTIONS_HEIGHT = 137; // 修改务必也修改easy-select-options的css部分
const OPTIONS_ITEM_HEIGHT = 33; // 修改务必也修改easy-select-options-item的css部分
const OPTIONS_MARGIN = 10;
const OPTIONS_PADDING = 6 * 2 + 2; // + 2是border
const OPTIONS_OTHER_HEIGHT = OPTIONS_MARGIN + OPTIONS_PADDING;
const STORAGE_KEY = "_easyWindowHeight";
const SIZE = {
  medium: {
    // width: "240rpx",
    // height: "40px",
  },
  small: {
    // width: "200rpx",
    // height: "30px",
  },
  mini: {
    // width: "160rpx",
    // height: "30px",
  },
};

export default {
  name: COMPONENT_NAME,
  props: {
    windowHeight: {
      type: [Number, String],
      default: 0,
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    value: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "medium",
    },
    options: {
      type: Array,
      default() {
        return [
          {
            value: "选项1",
            label: "黄金糕",
          },
          {
            value: "选项2",
            label: "双皮奶",
          },
          {
            value: "选项3",
            label: "蚵仔煎",
          },
          {
            value: "选项4",
            label: "龙须面",
          },
          {
            value: "选项5",
            label: "北京烤鸭",
          },
        ];
      },
    },
    tableIndex: {
      type: [Number, String],
      default: 0,
    },
		idx: {
      type: [Number, String],
      default: 0,
    },
		id: {
      type: [Number, String],
      default: 0,
    },
    forbidden:{
      type:Boolean,
      default:false
    },
    emptyStatus:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      showOptions: false,
      boundingClientRect: {},
      currentSelect: {},
      optionsGroupTop: "auto",
      optionsGroupMargin: "",
    };
  },
  computed: {
    showSuffix() {
      return this.showOptions ? "showOptions" : "no-showOptions";
    },
    easySelectSize() {
      let size = this.size.toLowerCase();
      if (size in SIZE) {
        return {
          width: SIZE[size].width,
          height: SIZE[size].height,
        };
      } else {
        return {};
      }
    },
  },
  mounted() {
    const elQuery = uni.createSelectorQuery().in(this);
    elQuery
      .select(".easy-select")
      .boundingClientRect((data) => {
        this.boundingClientRect = data;
      })
      .exec();
    try {
      if (!this.windowHeight) {
        const storageHeihgt = uni.getStorageSync(STORAGE_KEY);
        if (storageHeihgt) {
          this.easyWindowHeight = storageHeihgt;
          return;
        }
        const res = uni.getSystemInfoSync();
        this.easyWindowHeight = res.windowHeight;
        uni.setStorageSync(STORAGE_KEY, this.easyWindowHeight);
      }
    } catch (e) {
      // error
    }
  },
  methods: {
    trigger(e) {
      console.log("触发");
      if(this.forbidden){
        return
      }
      const view = uni.createSelectorQuery().in(this);
      view
        .select(".easy-select")
        .fields({ rect: true }, (data) => {
          let { top, bottom } = data;
          const thresholdHeight = Math.min(
            MAX_OPTIONS_HEIGHT + OPTIONS_MARGIN,
            this.options.length * OPTIONS_ITEM_HEIGHT + OPTIONS_OTHER_HEIGHT
          );
          bottom =
            Number(this.windowHeight || this.easyWindowHeight) -
            (top + this.boundingClientRect.height); // 距离底部的距离等于视口的高度减上top加select组件的高度

          // judge direction
          if (bottom < thresholdHeight) {
            this.optionsGroupDirection = "up";
            this.optionsGroupTop = -thresholdHeight - 12 + "px";
            this.optionsGroupMargin = "0";
          } else {
            this.optionsGroupDirection = "down";
            this.optionsGroupTop = "auto";
            this.optionsGroupMargin = "10px 0 0 0";
          }

          // if (this.scrollTop < )
          this.showOptions = !this.showOptions;
        })
        .exec();
    },
    select(options) {
			// return console.log(this.id)
      this.showOptions = false;
      this.currentSelect = options;
			let data ={
				options:options,
				tableIndex:this.tableIndex,
				idx:this.idx,
				id:this.id
			}
      this.$emit("selectOne", data );
    },
    empty(){ 
      this.showOptions = true;
      // console.log(this.value)
      // console.log(this.tableIndex)
      // console.log(this.idx)
      // console.log(this.id)
      // this.value = ""
      // let data ={
			// 	options:{},
			// 	tableIndex:"",
			// 	idx:"",
			// 	id:""
			// }
      // this.$emit("selectOne", data );
      // this.showOptions = false;
      // this.currentSelect = options;
			// let data ={
			// 	options:options,
			// 	tableIndex:this.tableIndex,
			// 	idx:this.idx,
			// 	id:this.id
			// }
      // let data ={
			// 	// options:options,
			// 	tableIndex:this.tableIndex,
			// 	idx:this.idx,
			// 	id:this.id
			// }
      this.$emit("empty");
    },
    hideOptions() {
      this.showOptions = false;
    },
  },
};
</script>

<style scoped lang="scss">
.easy-select {
  position: relative;
  border: 1px solid rgba(180, 208, 240, 1);
  border-radius: 4px;
  /* font-size: 28rpx; */
  color: #606266;
  outline: none;
  box-sizing: content-box;
  height: 30px;
  @media #{$pad}{
		height: 60rpx;
	}
}

.easy-select input {
  padding: 0 18rpx;
  padding-right: 10rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  height: 100% !important;
  min-height: 100% !important;
}

.easy-select .easy-select-suffix {
  position: absolute;
  box-sizing: border-box;
  height: 100%;
  right: 5px;
  top: 0;
  display: flex;
  align-items: center;
  transform: rotate(180deg);
  transition: all 0.3s;
  transform-origin: center;
  z-index: 1;
}

.easy-select .showOptions {
  transform: rotate(0) !important;
}

.easy-select .no-showOptions {
  transform: rotate(180deg) !important;
}

.easy-select .easy-select-options {
  position: absolute;
  padding: 6px 0;
  margin-top: 10px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  transform-origin: center top;
  z-index: 2238;
  overflow: scroll;
  max-height: 274rpx;
  @media #{$pad}{
		padding: 12rpx 0;
    margin-top: 20rpx;
    box-shadow: 0 4rpx 24rpx 0 rgba(0, 0, 0, 0.1);
	}
}

.easy-select .easy-select-options-item {
  padding: 0 20rpx;
  position: relative;
  white-space: nowrap;
  font-size: 14px;
  color: #606266;
  height: 33px;
  line-height: 33px;
  box-sizing: border-box;
  @media #{$pad}{
		font-size: 28rpx;
    height: 66rpx;
    line-height: 66rpx;
	}
}

.easy-select .active {
  background-color: #f5f7fa;
}
.easy-select .clickMask{
  position: absolute;
  padding: 0 18rpx;
  padding-right: 10rpx;
  height: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}
.uni-input-placeholder{
  color: rgb(192, 196, 204);
}
</style>
