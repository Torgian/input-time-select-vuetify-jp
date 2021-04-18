<template>
  <v-container class="pa-0 ma-0">
    <span :class="disabled ? 'text--disabled v-label theme--light' : 'v-label theme--light'" style="font-size: 0.75em; display: table-row;">
      {{ label }}
    </span>
    <div class="d-inline-flex pa-0" style="margin-top: 2px; max-width: min-content">
      <v-autocomplete
        class="pa-0 time-hours align-self-start"
        ref="hour-input"
        :disabled="disabled"
        :dark="dark"
        :suffix="suffix ? '時' : null"
        v-model="selectedHour"
        append-icon=""
        :hide-details="hideDetails"
        :items="hourRange"
        :search-input.sync="searchHour"
        placeholder="時間"
        no-data-text="時間を入力してください"
        :filter="filterHours"
        @blur="updateSearchInputHour"
        @change="changeSearchHour"
        auto-select-first
        dense
        flat
        :menu-props="{ contentClass: hoursContentClass }"
        @click="setScroll"
      />

      <span class="py-0 px-2 align-self-center"> :
      </span>

      <v-autocomplete
        class="pa-0 time-minutes"
        v-model="selectedMinute"
        :disabled="disabled"
        menu-props="auto"
        auto-select-first
        append-icon=""
        :dark="dark"
        :suffix="suffix ? '分' : null"
        :hide-details="hideDetails"
        :items="minuteRange"
        :search-input.sync="searchMinute"
        :filter="filterMinutes"
        placeholder="分"
        :no-data-text="noDataTextMinutes"
        @blur="updateSearchInputMinute"
        @change="changeSearchMinute"
        dense
        flat
      />
    </div>
  </v-container>
</template>
<script>
import fiveMinuteRange from '../utilities/fiveMinuteRange.js'
import range from '../utilities/range.js'
import { parseTime } from '../utilities/time'

/**
 * Normalize chars likely to be used in a time input to 半角
 * @param {String} str
 * @return {String}
 */
function zenkaku2hankaku(str) {
  return str.replace(/[：０-９]/g, function (c) {
    return String.fromCharCode(c.charCodeAt(0) - 0xfee0)
  })
}

/**
 * Generate the list of hours to select from
 * @return ["01", "02", "03", "04", ..., "23", "翌1", "翌2", .., "翌23"]
 */
function generateHoursRange(endingHour) {
  const hours = range(0, endingHour, 2).map(x => {
    return 24 <= x ? `翌${String(x - 24)}` : x
  })
  return hours
}
const RANGE48 = Object.freeze(generateHoursRange(47))
const RANGE24 = Object.freeze(generateHoursRange(23))

/**
 * Parse time to selection, which is the representation expected by this component
 * @param {String|null} time - HH:MM
 * @return {Object}
 */
function parseTimeToSelection(time, requiredRange = RANGE24) {
  let hour = ''
  let minute = ''
  if (time) {
    const parsedTime = parseTime(time)
    if (parsedTime) {
      const [hourNum, minuteNum] = parsedTime
      if (hourNum < requiredRange.length) {
        hour = requiredRange[hourNum]
        minute = String(minuteNum).padStart(2, '0')
      }
    }
  }

  return {
    hour,
    minute,
  }
}

// Count number of input time select instantiated
let inputTimeSelectCount = 0

export default {
  name: 'InputTimeSelect',

  props: {
    label: {
      type: String,
      default: null,
    },

    value: {
      type: String,
      default: '',
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    sixtyMinuteRange: {
      type: Boolean,
      default: false,
    },

    dark: {
      type: Boolean,
      default: false,
    },

    range48: {
      type: Boolean,
      default: false,
    },

    hideDetails: {
      type: Boolean,
      default: false,
    },

    suffix: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    const { hour, minute } = parseTimeToSelection(
      this.value,
      this.range48 ? RANGE48 : RANGE24
    )

    const selectedHour = hour
    const selectedMinute = minute

    const searchHour = hour
    const searchMinute = minute

    inputTimeSelectCount++

    return {
      selectedHour,
      searchHour,
      selectedMinute,
      searchMinute,

      // We set this class to the "hours" menu element.
      // We ensure this class is unique so that we can retrieve the menu.
      hoursContentClass: `input-time-select-hour-${inputTimeSelectCount}`,
      hourScrollSet: false,
    }
  },

  computed: {
    hourRange() {
      const startOrEndHours = this.range48 ? RANGE48 : RANGE24
      return startOrEndHours
    },

    minuteRange() {
      return this.sixtyMinuteRange ? range(0, 59, 2) : fiveMinuteRange(0, 55)
    },

    noDataTextMinutes() {
      if (this.sixtyMinuteRange) {
        return '分を入力してください'
      } else {
        return '5分単位で分を入力してください'
      }
    },
  },

  watch: {
    value(newValue, oldValue) {
      if (newValue !== oldValue) {
        const timeValues = parseTimeToSelection(newValue, this.hourRange)
        this.selectedHour = timeValues.hour
        this.selectedMinute = timeValues.minute
      }
    },
  },

  methods: {
    /**
     * Scroll up until a convenient hour value is shown into view
     */
    setScroll() {
      // Do not re-set a scroll value if user already did some scrolling,
      // as going back to a default scroll value would degrade UX.
      if (this.hourScrollSet) {
        return
      }
      this.hourScrollSet = true

      // If there is any user input or value already registered, do not scroll
      if (this.searchHour || this.selectedHour) {
        return
      }

      // Wait for hoursElem to be visible.
      // Indeed, if it is not visible, the `scrollTo` API does not work!
      const interval = setInterval(() => {
        const hoursElem = document.getElementsByClassName(
          this.hoursContentClass
        )[0]
        if (hoursElem && hoursElem.style.display !== 'none') {
          // Scroll up to 08
          const HOUR_08_OFFSET = 225
          hoursElem.scrollTo({ top: HOUR_08_OFFSET })
          clearInterval(interval)
        }
      }, 50)

      // Clear interval after some time just in case it was never cleared before
      // to avoid eating up resources
      setTimeout(() => {
        clearInterval(interval)
      }, 5000)
    },

    changeSearchHour(val) {
      this.searchHour = val
      this.updateSearchInputHour()
    },

    changeSearchMinute(val) {
      this.searchMinute = val
      this.updateSearchInputMinute()
    },

    emitValue() {
      // Emit null if any selection is missing
      if (!this.selectedHour || !this.selectedMinute) {
        this.$emit('input', null)
        return
      }
      const hourNum = this.hourRange.indexOf(this.selectedHour)
      const hourHH = String(hourNum).padStart(2, '0')
      const time = `${hourHH}:${this.selectedMinute}`
      this.$emit('input', time)
    },

    yokuMatch(val) {
      const inputValue = Number(val)
      if (inputValue > 23) {
        const queryTextNumber = `翌${inputValue - 24}`
        return queryTextNumber
      }
    },

    updateSearchInputHour() {
      if (!this.searchHour) {
        this.selectedHour = ''
        this.emitValue()
        return
      }

      let numberString = zenkaku2hankaku(this.searchHour)
      const yokuMatch = this.yokuMatch(numberString)
      if (yokuMatch) {
        numberString = yokuMatch
      }

      numberString = numberString.padStart(2, '0')

      if (this.hourRange.includes(numberString)) {
        this.selectedHour = numberString
        this.emitValue()
      }
    },

    updateSearchInputMinute() {
      if (!this.searchMinute) {
        this.selectedMinute = ''
        this.emitValue()
        return
      }

      const numberString = zenkaku2hankaku(this.searchMinute).padStart(2, '0')

      if (this.minuteRange.includes(numberString)) {
        this.selectedMinute = numberString
        this.emitValue()
      }
    },

    filterHours(item, queryText, itemText) {
      if (queryText === '翌') {
        return itemText.startsWith('翌')
      }

      queryText = zenkaku2hankaku(queryText)

      const yokuMatch = this.yokuMatch(queryText)
      if (yokuMatch) {
        queryText = yokuMatch
      }

      return itemText.includes(queryText)
    },

    filterMinutes(item, queryText, itemText) {
      queryText = zenkaku2hankaku(queryText)
      return itemText.includes(queryText)
    },

    focus() {
      this.$refs['hour-input'].focus()
    },
  },
}
</script>

<style scoped>
.time-hours,
.time-minutes {
  width: 80px;
}
.time-hours >>> .v-select__selections,
.time-minutes >>> .v-select__selections {
    flex-wrap: nowrap;
  };

.time-hours >>> .v-select__selections,
.time-minutes >>> input {
    padding: 0px !important;
  };
</style>
