<template>
  <v-dialog
    v-model="dialog"
    z-index="100000000000"
    max-width="900px"
    height="auto"
    transition="dialog-transition"
  >
    <v-container>
      <v-card>
        <v-card-title class="headline">{{ currentActionTitle }}</v-card-title>
        <v-card-text>
          <v-row justify="center">
            <v-col cols="12">
              <v-alert dense prominent :type="messageType" :value="true">
                <p>Message:</p>
                <span>{{ reasonToText }}</span>
              </v-alert>
            </v-col>
            <v-col cols="8">
              <v-alert type="info" dense text>
                <p>Provider's status code:</p>
                <span>{{ popupMessage }}</span>
              </v-alert>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click.native="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-dialog>
</template>


<script>
import { ProviderPaymentStatuses, ProviderActions, ProviderTexts } from "../models/provider-actions";
import { mapGetters } from 'vuex';
import TransactionMessage from '@/models/provider-transaction-message';
export default {
  name: 'FinishedTransactionDialog',
  computed: {
    ...mapGetters(["currentAction", "popupMessage", "messageType"]),
    alertType() {
      return this.currentAction === ProviderPaymentStatuses.PaymentSuccessful ? 'success' : 'error';
    },
    currentActionTitle() {
      return this.currentAction && ProviderActions[this.currentAction];
    },
    currentActionDescription() {
      return this.currentAction && ProviderTexts[this.currentAction];
    },
    reasonToText() {
      const providerText = TransactionMessage.statusReasonToProviderText(this.popupMessage);
      console.log("changing reasonToText:", this.popupMessage, providerText)
      return providerText;
    }
  },
  data () {
    return {
      dialog: true
    }
  }
}
</script>

