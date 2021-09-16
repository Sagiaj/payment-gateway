<template>
  <v-container grid-list-xl>
    <div class="text-center">
      <v-snackbar
        v-model="messageModel"
        :multi-line="true"
        :timeout="-1"
      >
        {{ popupMessage }}

        <template v-slot:action="{ attrs }">
          <v-btn
            :color="messageType"
            text
            v-bind="attrs"
            @click="messageModel = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "PopupMessage",
  watch: {
    popupMessage: {
      handler(oldVal, newVal) {
        this.messageModel = true;
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(["messageType", "popupMessage"]),
    hasMessage() {
      return this.messageType && this.popupMessage;
    }
  },
  data () {
    return {
      messageModel: false
    }
  }
}
</script>
