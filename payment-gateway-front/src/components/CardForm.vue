<template>
  <div class="card-form">
    <div class="card-list">
      <Card
        :fields="fields"
        :labels="formData"
        :cardType="cardType"
        :isCardNumberMasked="isCardNumberMasked"
        :randomBackgrounds="randomBackgrounds"
        :backgroundImage="backgroundImage"
      />
    </div>
    <div class="card-form__inner">
      <div class="card-input">
        <label for="cardNumber" class="card-input__label">{{ cardForm.cardNumber }}</label>
        <input
          :disabled="finishedTransaction"
          type="tel"
          :id="`${fields.cardNumber}`"
          @input="changeNumber"
          @focus="focusCardNumber"
          @blur="blurCardNumber"
          class="card-input__input"
          :value="formData.cardNumber"
          :maxlength="cardNumberMaxLength"
          data-card-field
          autocomplete="off"
        />
        <button
          class="card-input__eye"
          :class="{ '-active' : !isCardNumberMasked }"
          title="Show/Hide card number"
          tabindex="-1"
          :disabled="formData.cardNumber === ''"
          @click="toggleMask"
        ></button>
      </div>
      <div class="card-input">
        <label for="cardName" class="card-input__label">{{ cardForm.cardName }}</label>
        <input
          :disabled="finishedTransaction"
          type="text"
          :id="`${fields.cardName}`"
          v-letter-only
          @input="changeName"
          class="card-input__input"
          :value="formData.cardName"
          data-card-field
          autocomplete="off"
        />
      </div>
      <div class="card-form__row">
        <div class="card-form__col">
          <div class="card-form__group">
            <label for="cardMonth" class="card-input__label">{{ cardForm.expirationDate }}</label>
            <select
              class="card-input__input -select"
              :id="`${fields.cardMonth}`"
              v-model="formData.cardMonth"
              @change="changeMonth"
              :disabled="finishedTransaction"
              data-card-field
            >
              <option value disabled selected>{{ cardForm.month }}</option>
              <option
                v-bind:value="n < 10 ? '0' + n : n"
                v-for="n in 12"
                v-bind:disabled="n < minCardMonth"
                v-bind:key="n"
              >{{generateMonthValue(n)}}</option>
            </select>
            <select
              :disabled="finishedTransaction"
              class="card-input__input -select"
              :id="`${fields.cardYear}`"
              v-model="formData.cardYear"
              @change="changeYear"
              data-card-field
            >
              <option value disabled selected>{{ cardForm.year }}</option>
              <option
                v-bind:value="$index + minCardYear"
                v-for="(n, $index) in 12"
                v-bind:key="n"
              >{{$index + minCardYear}}</option>
            </select>
          </div>
        </div>
        <div class="card-form__col -cvv">
          <div class="card-input">
            <label for="cardCvv" class="card-input__label">{{ cardForm.CVV }}</label>
            <input
              :disabled="finishedTransaction"
              type="tel"
              class="card-input__input"
              v-number-only
              :id="`${fields.cardCvv}`"
              maxlength="4"
              :value="formData.cardCvv"
              @input="changeCvv"
              data-card-field
              autocomplete="off"
            />
          </div>
        </div>
      </div>

      <button class="card-form__button" v-on:click="validateCardNumber" :disabled="finishedTransaction">{{ cardForm.submit }}</button>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'CardForm',
  directives: {
    'number-only': {
      bind (el) {
        function checkValue (event) {
          event.target.value = event.target.value.replace(/[^0-9]/g, '')
          if (event.charCode >= 48 && event.charCode <= 57) {
            return true
          }
          event.preventDefault()
        }
        el.addEventListener('keypress', checkValue)
      }
    },
    'letter-only': {
      bind (el) {
        function checkValue (event) {
          if (event.charCode >= 48 && event.charCode <= 57) {
            event.preventDefault()
          }
          return true
        }
        el.addEventListener('keypress', checkValue)
      }
    }
  },
  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          cardName: '',
          cardNumber: '',
          cardNumberNotMask: '',
          cardMonth: '',
          cardYear: '',
          cardCvv: ''
        }
      }
    },
    backgroundImage: [String, Object],
    randomBackgrounds: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Card
  },
  data () {
    return {
      cardType: "",
      cardForm: {
        cardNumber: "Card Number",
        cardName: "Card Name",
        expirationDate: "Expiration Date",
        month: "Month",
        year: "Year",
        CVV: "CVV",
        submit: "Authorize payment",
        invalidCardNumber: "Invalid Card Number",
      },
      fields: {
        cardNumber: 'v-card-number',
        cardName: 'v-card-name',
        cardMonth: 'v-card-month',
        cardYear: 'v-card-year',
        cardCvv: 'v-card-cvv'
      },
      hostedFieldsContainers: {
        cardNumber: 'v-card-number-provider',
        cardName: 'v-card-name-provider',
        cardMonth: 'v-card-month-provider',
        cardYear: 'v-card-year-provider',
        cardCvv: 'v-card-cvv-provider'
      },
      minCardYear: new Date().getFullYear(),
      isCardNumberMasked: true,
      mainCardNumber: this.cardNumber,
      cardNumberMaxLength: 19
    }
  },
  computed: {
    ...mapGetters(["finishedTransaction"]),
    minCardMonth () {
      if (this.formData.cardYear === this.minCardYear) return new Date().getMonth() + 1
      return 1
    }
  },
  watch: {
    cardYear () {
      if (this.formData.cardMonth < this.minCardMonth) {
        this.formData.cardMonth = ''
      }
    }
  },
  mounted () {
    this.maskCardNumber()
  },
  created () {
    this.initializeCardDataBinding(this.formData);
  },
  methods: {
    ...mapActions(["initializeCardDataBinding"]),
    generateMonthValue (n) {
      return n < 10 ? `0${n}` : n
    },
    changeName (e) {
      this.formData.cardName = e.target.value
      this.$emit('input-card-name', this.formData.cardName)
    },
    changeNumber (e) {
      this.formData.cardNumber = e.target.value
      let value = this.formData.cardNumber.replace(/\D/g, '')
      // american express, 15 digits
      if ((/^3[47]\d{0,13}$/).test(value)) {
        this.formData.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
        this.cardNumberMaxLength = 17
      } else if ((/^3(?:0[0-5]|[68]\d)\d{0,11}$/).test(value)) { // diner's club, 14 digits
        this.formData.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
        this.cardNumberMaxLength = 16
      } else if ((/^\d{0,16}$/).test(value)) { // regular cc number, 16 digits
        this.formData.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{4})/, '$1 $2 ').replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ')
        this.cardNumberMaxLength = 19
      }
      // eslint-disable-next-line eqeqeq
      if (e.inputType == 'deleteContentBackward') {
        let lastChar = this.formData.cardNumber.substring(this.formData.cardNumber.length, this.formData.cardNumber.length - 1)
        // eslint-disable-next-line eqeqeq
        if (lastChar == ' ') { this.formData.cardNumber = this.formData.cardNumber.substring(0, this.formData.cardNumber.length - 1) }
      }
      this.$emit('input-card-number', this.formData.cardNumber)
    },
    changeMonth () {
      this.$emit('input-card-month', this.formData.cardMonth)
    },
    changeYear () {
      this.$emit('input-card-year', this.formData.cardYear)
    },
    changeCvv (e) {
      this.formData.cardCvv = e.target.value
      this.$emit('input-card-cvv', this.formData.cardCvv)
    },
    validateCardNumber () { /**Luhn algorithm */
      let number = this.formData.cardNumberNotMask.replace(/ /g, '')
      var sum = 0
      for (var i = 0; i < number.length; i++) {
        var intVal = parseInt(number.substr(i, 1))
        if (i % 2 === 0) {
          intVal *= 2
          if (intVal > 9) {
            intVal = 1 + (intVal % 10)
          }
        }
        sum += intVal
      }
      if (sum % 10 !== 0) {
        alert(this.cardForm.invalidCardNumber)
      } else {
        this.$emit("cardNumberValidated", this.formData);
      }
    },
    blurCardNumber () {
      if (this.isCardNumberMasked) {
        this.maskCardNumber()
      }
    },
    maskCardNumber () {
      this.formData.cardNumberNotMask = this.formData.cardNumber
      this.mainCardNumber = this.formData.cardNumber
      let arr = this.formData.cardNumber.split('')
      arr.forEach((element, index) => {
        if (index > 4 && index < 14 && element.trim() !== '') {
          arr[index] = '*'
        }
      })
      this.formData.cardNumber = arr.join('')
    },
    unMaskCardNumber () {
      this.formData.cardNumber = this.mainCardNumber
    },
    focusCardNumber () {
      this.unMaskCardNumber()
    },
    toggleMask () {
      this.isCardNumberMasked = !this.isCardNumberMasked
      if (this.isCardNumberMasked) {
        this.maskCardNumber()
      } else {
        this.unMaskCardNumber()
      }
    }
  }
}
</script>
