<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
      </v-col>

      <v-col class="mb-4">
        <h3 class="display-2 font-weight-bold mb-3">
          Input Time Select
        </h3>

        <p class="subheading font-weight-regular">
          Thanks for your interest in this time selector!
        </p>
      </v-col>
    </v-row>

    <v-container>
      <v-row class="justify-center">
        <v-col class="col-sm-4">
          <input-time-select
            label="開始時刻"
            v-model="beginAt"></input-time-select>
          <input-time-select
            label="終了時刻"
            range48
            v-model="endAt"
          ></input-time-select>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import InputTimeSelect from './InputTimeSelect.vue'

  export default {
    name: 'HelloWorld',

    components: {
      InputTimeSelect,
    },

    data: () => ({
      beginAt: null,
      endAt: null,
    }),
  }
</script>
