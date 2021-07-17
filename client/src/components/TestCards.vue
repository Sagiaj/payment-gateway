<template>
    <div>
      <TableView
        :headers="testCardColumns"
        :rows="testCardRows"
      >
        <template v-slot:items="{ row }">
          <td>{{ row["Card Number"] }}</td>
          <td>{{ row["Flow Type"] }}</td>
        </template>

        <template v-slot:no-data>
          <span>No data</span>
        </template>
      </TableView>
    </div>
</template>



<script>

import TableView from "@/components/reuse/TableView.vue"

export default {
  name: 'TestCards',
  components:{
    TableView
  },
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
  }
}

</script>
