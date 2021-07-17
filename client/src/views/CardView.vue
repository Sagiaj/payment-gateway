<template>
  <div class="wrapper" id="app">

    <TestCards />

    <CardForm
      :form-data="formData"
      @input-card-number="updateCardNumber"
      @input-card-name="updateCardName"
      @input-card-month="updateCardMonth"
      @input-card-year="updateCardYear"
      @input-card-cvv="updateCardCvv"
      @cardNumberValidated="callPerformPayment"
    />
    <!-- <div id="dropin-container" /> -->
    <!-- backgroundImage="https://images.unsplash.com/photo-1572336183013-960c3e1a0b54?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80" -->
  </div>
</template>

<script>
import CardForm from '@/components/CardForm';
import TestCards from '@/components/TestCards.vue';
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'CardView',
  components: {
    CardForm,
    TestCards
  },
  data () {
    return {
      formData: {
        cardName: '',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: ''
      },
      testCards: {
        
        AUTHENTICATION_SUCCESSFUL: {
            "Card Number": "4263970000005262",
            "Flow Type": "Frictionless",
            "Transaction Result": "AUTHENTICATION_SUCCESSFUL",
            "ECI*": "05"
        },
        AUTHENTICATION_SUCCESSFUL_NO_METHOD_URL: {
            "Card Number": "4222000006724235",
            "Flow Type": "Frictionless",
            "Transaction Result": "AUTHENTICATION_SUCCESSFUL - No Method URL",
            "ECI*": "05"
        },
        AUTHENTICATION_ATTEMPTED_BUT_NOT_SUCCESSFUL: {
            "Card Number": "4012001037167778",
            "Flow Type": "Frictionless",
            "Transaction Result": "AUTHENTICATION_ATTEMPTED_BUT_NOT_SUCCESSFUL",
            "ECI*": "06"
        },
        AUTHENTICATION_FAILED: {
            "Card Number": "4012001037461114",
            "Flow Type": "Frictionless",
            "Transaction Result": "AUTHENTICATION_FAILED",
            "ECI*": "07"
        },
        AUTHENTICATION_ISSUER_REJECTED: {
            "Card Number": "4012001038443335",
            "Flow Type": "Frictionless",
            "Transaction Result": "AUTHENTICATION_ISSUER_REJECTED",
            "ECI*": "07"
        },
        AUTHENTICATION_COULD_NOT_BE_PERFORMED: {
            "Card Number": "4012001037484447",
            "Flow Type": "Frictionless",
            "Transaction Result": "AUTHENTICATION_COULD_NOT_BE_PERFORMED",
            "ECI*": "07"
        },
        CHALLENGE_REQUIRED: {
            "Card Number": "4012001038488884",
            "Flow Type": "Challenge",
            "Transaction Result": "CHALLENGE_REQUIRED",
            "ECI*": "N/A"
        }
        /*"4530910000012345": {
          "Card Number": "4530910000012345",
          "Flow Type": "3DS Not Supported"
        },
        "4510150000000321": {
          "Card Number": "4510150000000321",
          "Flow Type": "3DS Not Supported"
        },
        "4500030000000004": {
          "Card Number": "4500030000000004",
          "Flow Type": "3DS Supported"
        },
        "4003440000000007": {
          "Card Number": "4003440000000007",
          "Flow Type": "3DS Supported"
        },
        "4515031000000005": {
          "Card Number": "4515031000000005",
          "Flow Type": "3DS Supported"
        },
        "4538261230000003": {
          "Card Number": "4538261230000003",
          "Flow Type": "3DS Supported"
        },
        "4037112233000001": {
          "Card Number": "4037112233000001",
          "Flow Type": "3DS Not Supported"
        },
        "4037111111000000": {
          "Card Number": "4037111111000000",
          "Flow Type": "3DS Supported"
        },
        "4107857757053670": {
          "Card Number": "4107857757053670",
          "Flow Type": "3DS Supported"
        },*/
      }
    }
  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    ...mapActions(["startThreeDSProcess", "performPayment", "tokenizeHostedFields", "createHostedFieldsInstance"]),
    updateCardNumber (val) {
    },
    updateCardName (val) {
    },
    updateCardMonth (val) {
    },
    updateCardYear (val) {
    },
    updateCardCvv (val) {
    },
    async callPerformPayment(card_details) {
      await this.startThreeDSProcess();
      // await this.requestPaymentMethod();
      // const hostedFieldsInstance = await this.createHostedFieldsInstance();
      // console.log("callPerformPayment. instance=", hostedFieldsInstance);
      // this.performPayment(card_details);
      // console.log("calling tokenizeHostedFields")
      // await this.tokenizeHostedFields();
      
    }
  }
}
</script>

<style lang="scss" scoped>

  .flex-table {
    display: flex;
    flex-flow: row wrap;
    transition: 0.5s;
    .flex-row {
      border: 1px solid;
      margin: 5px;
    }
    &:first-of-type .flex-row {
      font-weight: bold;
    }
  }
  .flex-cell {
    border: 1px solid;
    margin: 5px;
  }
</style>
