<template>
  <v-container grid-list-lg fluid>
    <v-row justify="center">
      <v-col v-for="(col, colidx) in testCardColumns" :key="`column-${colidx}`">{{ col["label"] }}</v-col>
    </v-row>
    <v-row justify="center" v-for="(row, rowidx) in testCardRows" :key="`row-${rowidx}`">
      <v-col cols="6" v-for="(col, colidx) in testCardColumns" :key="`column-${colidx}`">{{ row[col["field"]] }}</v-col>
    </v-row>
  </v-container>
</template>



<script>

export default {
  name: 'TestCards',
  computed: {
    testCardRows() {
      return Object.keys(this.testCards).reduce((arr, key) => [...arr, this.testCards[key]], []);
    }
  },
  data(){
    return{
      testCardColumns: [
        { field: "Card Number", label: "Card Number", type: "String", sortable: false },
        { field: "Flow Type", label: "Flow Type", type: "String", sortable: false }
      ],
      testCards: {
        AUTHENTICATION_SUCCESSFUL: {
            "Card Number": "4263970000005262",
            "Flow Type": "Frictionless - Success",
            "Transaction Result": "AUTHENTICATION_SUCCESSFUL",
            "ECI*": "05"
        },
        AUTHENTICATION_SUCCESSFUL_NO_METHOD_URL: {
            "Card Number": "4222000006724235",
            "Flow Type": "Frictionless - Success - No payment method verification",
            "Transaction Result": "AUTHENTICATION_SUCCESSFUL - No Method URL",
            "ECI*": "05"
        },
        AUTHENTICATION_ATTEMPTED_BUT_NOT_SUCCESSFUL: {
            "Card Number": "4012001037167778",
            "Flow Type": "Frictionless - Authentication attempted but failed",
            "Transaction Result": "AUTHENTICATION_ATTEMPTED_BUT_NOT_SUCCESSFUL",
            "ECI*": "06"
        },
        AUTHENTICATION_FAILED: {
            "Card Number": "4012001037461114",
            "Flow Type": "Frictionless - Authentication failed",
            "Transaction Result": "AUTHENTICATION_FAILED",
            "ECI*": "07"
        },
        AUTHENTICATION_ISSUER_REJECTED: {
            "Card Number": "4012001038443335",
            "Flow Type": "Frictionless - Card issuer rejected",
            "Transaction Result": "AUTHENTICATION_ISSUER_REJECTED",
            "ECI*": "07"
        },
        AUTHENTICATION_COULD_NOT_BE_PERFORMED: {
            "Card Number": "4012001037484447",
            "Flow Type": "Frictionless - Authentication could not be performed",
            "Transaction Result": "AUTHENTICATION_COULD_NOT_BE_PERFORMED",
            "ECI*": "07"
        },
        CHALLENGE_REQUIRED: {
            "Card Number": "4012001038488884",
            "Flow Type": "Challenge - ACS challenge required",
            "Transaction Result": "CHALLENGE_REQUIRED",
            "ECI*": "N/A"
        }
      }
    }
  }
}

</script>
