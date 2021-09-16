<template>
  <div class="text-center">
    <v-overlay :value="overlay">

      <slot name="mainoverlay"></slot>
          <v-progress-linear
            indeterminate
            height="6"
          ><slot name="circleinside"></slot></v-progress-linear>
    </v-overlay>
  </div>
</template>

<script>
  export default {
    name: "ApplicationLoader",
    props: ["overlay"]
  }
</script>
