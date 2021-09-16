<template>
  <div class="wrapper">

    <v-container fluid>  
      <v-row>
        <v-col cols="12" sm="12" md="7">
          <v-card elevation="0" :disabled="finishedTransaction">
            <v-card-text>
              <CardForm
                :form-data="formData"
                @input-card-number="updateCardNumber"
                @input-card-name="updateCardName"
                @input-card-month="updateCardMonth"
                @input-card-year="updateCardYear"
                @input-card-cvv="updateCardCvv"
                @cardNumberValidated="callPerformPayment"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="12" md="5">
          <TestCards />
          <v-container>
            <v-row style="margin-top: 20%;">
              <v-col >
                <h2>Amount</h2>
                <p>{{ transactionAmount }}</p>
              </v-col>
              <v-col>
                <h2>Currency</h2>
                <p>{{ transactionCurrency }}</p>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col align="center">
          <v-btn icon color="primary" :disabled="!finishedTransaction" @click.native="refreshTransaction">
            Perform another payment
            <v-icon>mdi-autorenew</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-dialog
        v-model="dialogEnabled"
        z-index="100000000000"
        max-width="500px"
        height="auto"
        transition="dialog-transition"
      >
        <div id="iframe-dialog" :style="'height: 600px;'"></div>
      </v-dialog>

      <FinishedTransactionDialog v-if="finishedTransaction"/>

      <ApplicationLoader :overlay="appIsLoading">
        <template v-slot:mainoverlay>
          <v-row>
            <v-col cols="12"></v-col>
          </v-row>
          <div>
            <h3 class="headline mb-0">{{ currentActionTitle }}</h3>
            <div>{{ currentActionDescription }}</div>
          </div>
        </template>
      </ApplicationLoader>

      <PopupMessage />

    </v-container>
  </div>
</template>

<script>
import CardForm from '@/components/CardForm';
import TestCards from '@/components/TestCards.vue';
import ApplicationLoader from "@/components/reuse/ApplicationLoader.vue";
import PopupMessage from "@/components/reuse/PopupMessage.vue";
import FinishedTransactionDialog from "@/components/FinishedTransactionDialog.vue";
import { ProviderActions, ProviderTexts } from "../models/provider-actions";
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'CardView',
  components: {
    CardForm,
    TestCards,
    ApplicationLoader,
    PopupMessage,
    FinishedTransactionDialog
  },
  watch: {
    iframeDialog(newVal, oldVal) {
      this.dialogEnabled = !!newVal;
      if (oldVal && !newVal) {
        console.log("Calling ACSChallengeCompleted")
        // ACS is completed
        this.acsChallengeCompleted();
      }
    }
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
      dialogEnabled: false
    }
  },
  computed: {
    ...mapGetters(["appIsLoading", "currentAction", "iframeDialog", "transactionAmount", "transactionCurrency", "finishedTransaction"]),
    currentActionTitle() {
      return this.currentAction && ProviderActions[this.currentAction];
    },
    currentActionDescription() {
      return this.currentAction && ProviderTexts[this.currentAction];
    }
  },
  methods: {
    ...mapActions(["startThreeDSProcess", "performPayment", "acsChallengeCompleted", "setFinishedTransaction"]),
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
    refreshTransaction() {
      this.setFinishedTransaction(false);
    },
    async callPerformPayment(card_details) {
      console.log("callPerformPayment - calling ThreeDS/startThreeDSProcess");
      await this.startThreeDSProcess();
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
