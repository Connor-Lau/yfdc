<template>
  <div class="_calender-box">
    <slot name="title"></slot>
    <div class="date-header">
      <van-icon name="arrow-left" size="20" color="#252525" @click="handlePrev" />
      <div class="show-date">{{ year }}年{{ monthText }}月</div>
      <van-icon name="arrow" size="20" color="#252525" @click="handleNext" />
    </div>
    <div class="date-content">
      <div class="week-box">
        <div
          v-for="item in ['日', '一', '二', '三', '四', '五', '六']"
          :key="item"
          class="week-header">
          {{ item }}
        </div>
      </div>
      <div class="day-box">
        <div
          class="every-day"
          v-for="item in dayCount"
          :key="item"
          :class="{
            'active-day': item - beginDay === day,
            'no-optional': !isOptional(item - beginDay),
          }"
          @click="handleClickDay(item)">
          <!-- 可选月的日期 -->
          <div
            v-if="item - beginDay > 0 && item - beginDay <= curDays"
            :class="{
              'no-optional': !isOptional(item - beginDay),
            }">
            <p>{{ item - beginDay }}</p>
            <p v-if="`${year}-${month}-${item - beginDay}` == curDate" class="today-text">
              今天
            </p>
          </div>
          <!-- 不可选上月的日期 -->
          <div class="other-day" v-else-if="item - beginDay <= 0">
            {{ item - beginDay + prevDays }}
          </div>
          <!-- 不可选下月的日期 -->
          <div class="other-day" v-else>{{ item - beginDay - curDays }}</div>
        </div>
      </div>
    </div>
    <slot name="subtitle"></slot>
    <slot name="timetype"></slot>
    <!-- <div class="time-type">
      <div class="type-item" v-for="(item,index) in timeType" :key="index">{{item.timer}}</div>
    </div> -->
    <div class="date-hour">
      <van-datetime-picker
        type="time"
        :formatter="formatter"
        :show-toolbar="false" :visible-item-count="3" :columns-order="['hour', 'minute']" ref="datetime" :max-minute="23" @change="chooseTime" />
      <span>至</span>
    </div>

    <div class="bottom-hegiht">
      <slot name="bottom"></slot>
    </div>
    <page-bottom-button
      v-if="!$slots.bottom"
      @confirm="confirm"
      :isPage="false"
      leftText="关闭"
      @close="cancel"></page-bottom-button>
  </div>
</template>

<script>
// 新UI日历组件，目前只支持单选日期。 暂不支持选择详细的XX时XX分XX秒，也不返回XX时XX分XX秒
// 外部应该组件参考：1. 不做限制  <calender-ui v-model="" @change=""></calender-ui>
// 2.限制日期  <calendar-ui v-model="testDate" min-date="1990-01-01" max-date="2100-12-31" @change="change" @confirm="confirm"></calendar-ui>
import PageBottomButton from "@/components/yni/page-bottom-button.vue";
export default {
  name: "CalenderUi",
  components: { PageBottomButton },
  props: {
    // v-model 支持 XXXX年XX月XX日 || XXXX-XX-XX || new Date()
    value: {
      type: [String, Date],
      default: "",
    },
    // 限制最小日期，支持 XXXX年XX月XX日 || XXXX-XX-XX || new Date()
    minDate: {
      type: [String, Date],
      default: "",
    },
    // 限制最大日期, 支持 XXXX年XX月XX日 || XXXX-XX-XX || new Date()
    maxDate: {
      type: [String, Date],
      default: "",
    },
    timeIndex: {
      type: Number,
      default: "",
    },
    timeItem: {
      type: Object,
      default: "",
    }
  },
  data () {
    return {
      year: null,
      month: null,
      day: null,
      hour: null,
      curDate: "", // 今天日期
      dayCount: 42,
      startTime: null,
      endTime: null
    };
  },
  watch: {
    value (val) {
      if (val) {
        this.setValueDate();
      }
    },
    timeIndex (newVal, oldVal) {
      if (newVal > 0) {
        this.$nextTick(() => {
          let ref = this.$refs['datetime'].getPicker().setValues([this.timeItem.startTime, this.timeItem.endTime])
          let valueRef = this.$refs['datetime'].getPicker().getValues()
          this.hour = valueRef[0] + '-' + valueRef[1]
          this.startTime = valueRef[0]
          this.endTime = valueRef[1]
        })
      }
    },
  },
  created () {
    this.getInitDate();
  },
  computed: {
    // 当前月
    beginDay () {
      return new Date(this.year, this.month - 1, 1).getDay();
    },
    // 上个月
    prevDays () {
      return new Date(this.year, this.month - 1, 0).getDate();
    },
    // 下个月
    curDays () {
      return new Date(this.year, this.month, 0).getDate();
    },
    // 月份小于10则0+月
    monthText () {
      return this.month < 10 ? "0" + this.month : this.month;
    },
    // 获取最小日期对象
    minInfo () {
      return this.getLimitDateInfo("minDate") || {};
    },
    // 获取最大日期对象
    maxInfo () {
      return this.getLimitDateInfo("maxDate") || {};
    },
  },
  methods: {
    // 初始化
    getInitDate () {
      const date = new Date();
      this.year = date.getFullYear();
      this.month = date.getMonth() + 1;
      this.day = date.getDate();
      this.curDate = `${this.year}-${this.month}-${this.day}`;
      this.hour = '00:00-00:00'
      this.setValueDate();
    },
    // 通过value 设置日期
    setValueDate () {
      const { value } = this;
      if (!value) return;
      const date = new Date(this.valueFormatFn(value));
      this.year = date.getFullYear();
      this.month = date.getMonth() + 1;
      this.day = date.getDate();
      this.computedDay();
    },
    // 跟据value的值设置返回格式， YYYY-mm-dd || YYYY年mm月dd日 || YYYY/mm/dd
    setValueFormat () {
      const { value } = this;
      if (!value) return `${this.year}-${this.monthText}-${this.day}`;
      if (value instanceof Date) {
        return `${this.year}-${this.monthText}-${this.day}`;
      }
      if (value.includes("年") && value.includes("月") && value.includes("日")) {
        return `${this.year}年${this.monthText}月${this.day}日`;
      }
      if (value.includes("/")) {
        return `${this.year}-${this.monthText}/${this.day}`;
      }
      return `${this.year}-${this.monthText}-${this.day}`;
    },
    // 变量日期格式化函数
    valueFormatFn (value) {
      let dateStr = value;
      if (!value) return dateStr;
      if (value instanceof Date) {
        return value;
      }
      if (value.includes("年") && value.includes("月") && value.includes("日")) {
        dateStr = value.replace(/年/, "/").replace(/月/, "/").replace(/日/, "");
      }
      if (value.includes("-")) {
        dateStr = value.replace(/-/g, "/");
      }
      return dateStr;
    },
    // 获取限制日期对象
    getLimitDateInfo (name = "minDate") {
      if (!this[name]) return {};
      const date = new Date(this.valueFormatFn(this[name]));
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
    },
    // 限制日期跟限制日期对比,是否可选
    isOptional (day, clickName = -1) {
      const [min, max] = [this.minInfo, this.maxInfo];
      const [isMin, isMax] = [JSON.stringify(min) !== "{}", JSON.stringify(max) !== "{}"];
      if (clickName === 0 || (isMin && clickName === -1)) {
        if (this.year < min.year) {
          return false;
        }
        if (this.year < min.year && this.month <= min.month) {
          return false;
        }
        if (this.year < min.year && this.month <= min.month && day < min.day) {
          return false;
        }
        if (this.year == min.year && this.month == min.month && day < min.day) {
          return false;
        }
        if (
          this.year == min.year &&
          this.month == min.month &&
          day > min.day &&
          clickName === 0
        ) {
          return false;
        }
      }
      if (clickName === 1 || (isMax && clickName === -1)) {
        if (this.year > max.year) {
          return false;
        }
        if (this.year > max.year && this.month >= max.month) {
          return false;
        }
        if (this.year > max.year && this.month >= max.month && day > max.day) {
          return false;
        }
        if (this.year == max.year && this.month == max.month && day > max.day) {
          return false;
        }
        if (
          this.year == max.year &&
          this.month == max.month &&
          day < max.day &&
          clickName === 1
        ) {
          return false;
        }
      }
      return true;
    },
    // 设置是否可选函数
    setIsOptionalFn () {
      const { dayCount, beginDay, day, curDays } = this;
      for (let i = 0; i < dayCount; i++) {
        if (i - beginDay > 0 && i - beginDay <= curDays) {
          return i;
        }
      }
    },
    // 选择日期
    handleClickDay (item) {
      if (item - this.beginDay > 0 && item - this.beginDay <= this.curDays) {
        this.day = item - this.beginDay;
      }
      this.$emit("change", this.getChangeInfo());
      this.$emit("input", this.setValueFormat());
    },
    // 获取改变日期组合对象
    getChangeInfo () {
      let dayText = this.day < 10 ? '0' + this.day : this.day
      return {
        year: this.year,
        month: this.monthText,
        day: this.day,
        hour: this.hour,
        startTime: this.startTime,
        endTime: this.endTime,
        _date1: `${this.year}-${this.monthText}-${this.day}`,
        _date2: `${this.year}年${this.monthText}月${this.day}日`,
        _date3: `${this.year}-${this.monthText}-${dayText} ${this.hour}`,
        _date4: `${this.year}/${this.monthText}/${dayText}`
      };
    },
    // 切换上一个月
    handlePrev () {
      if (!this.isOptional(this.setIsOptionalFn() - this.beginDay, 0)) return;
      if (this.month == 1) {
        this.month = 12;
        this.year--;
      } else {
        this.month--;
      }
      this.computedDay();
    },
    // 切换下个一个月
    handleNext () {
      if (!this.isOptional(this.setIsOptionalFn() - this.beginDay, 1)) return;
      if (this.month == 12) {
        this.month = 1;
        this.year++;
      } else {
        this.month++;
      }
      this.computedDay();
    },
    // 计算切换月份时默认选择日期
    computedDay () {
      const allDay = new Date(this.year, this.month, 0).getDate();
      if (this.day > allDay) {
        this.day = allDay;
      }
      this.$emit("change", this.getChangeInfo());
      this.$emit("input", this.setValueFormat());
    },
    formatter (type, val) {
      if (val.substr(-1) != '0') {
        return parseInt(val, 10) + ':00'
      } else {
        return val + ':00'
      }
    },
    chooseTime (val) {
      let index = this.$refs['datetime'].getPicker().getIndexes()
      this.$nextTick(() => {
        let ref = this.$refs['datetime'].getPicker().getValues()
        this.hour = ref[0] + '-' + ref[1]
        this.startTime = ref[0]
        this.endTime = ref[1]
        this.$emit("changeTime")
      })
    },
    confirm () {
      this.$emit("confirm", this.getChangeInfo());
    },
    cancel () {
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="scss" scoped>
.date-header,
.date-content,
p {
  text-align: center;
  line-height: 24px;
  padding: 0;
  margin: 0;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  box-sizing: border-box;
}
.week-box,
.day-box {
  width: 100%;
  margin: 0 0.2rem;
}
.day-box {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
}
.date-header {
  height: 0.8rem;
  line-height: 0.8rem;
  border-bottom: 0.02rem solid #e4e4e4;
}
.show-date {
  margin-top: 0px;
  display: inline-block;
  text-align: center;
  width: 3rem;
  color: #252525;
  font-size: 0.28rem;
}
.week-box {
  border-bottom: 0.02rem solid #e4e4e4;
}
.week-header {
  color: #252525;
  font-size: 0.28rem;
  text-align: center;
  line-height: 0.6rem;
  margin: 0;
  padding: 0;
  display: inline-block;
  height: 0.6rem;
  width: 1rem;
}
.every-day {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  box-sizing: border-box;
  width: 1.01rem;
  height: 1.05rem;
  text-align: center;
  line-height: 1.05em;
  font-size: 0.36rem;
  color: #252525;
}
.other-day {
  width: 100%;
  background: #fcfcfc;
  color: #b8b8b8;
  height: 1.05rem;
  line-height: 1.05em;
  display: flex;
  align-items: center;
  justify-content: center;
}
.now-day {
  background: #252525;
}
.active-day {
  font-weight: 500;
  color: #000000;
  background: #dcecfd;
}
.today-text {
  margin-top: 0.1rem;
  font-size: 0.28rem;
}
.no-optional {
  background: #fcfcfc !important;
  color: #b8b8b8 !important;
}
.bottom-hegiht {
  width: 100%;
  height: 1.32rem;
}
.date-hour {
  position: relative;
  span {
    font-size: 0.32rem;
    font-weight: 400;
    color: #000000;
    position: absolute;
    top: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
