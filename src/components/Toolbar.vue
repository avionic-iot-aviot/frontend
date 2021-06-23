<template>
  <v-container fluid class="my-toolbar">
    <v-row align="center">
      <v-col :cols="withSearch?4:8" class="align-left">
        <v-btn class="mr-4 align-middle" v-if="withBack" fab small @click="goTo()">
          <v-icon>{{ enums.ICONS.BACK }}</v-icon>
        </v-btn>
        <span class="align-middle text-h4" v-if="title">{{ title }}</span>
      </v-col>
      <v-col cols="4" v-if="withSearch">
        <v-text-field
          :label="$t('misc.search')"
          v-model="searchText"
          @input="onSearch"
          clearable
          single-line
        ></v-text-field>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="4" class="align-right">
        <v-btn
          v-if="withFilter"
          @click="onFilter"
          small
          outlined
          color="secondary"
          :class="{ 'colored-button': !allClear, 'ml-2': true }"
        >
          {{ $t("buttons.filter") }}
        </v-btn>
        <v-btn
          v-if="withAdd"
          @click="onAdd"
          small
          color="accent"
          class="ml-2"
        >
          <v-icon>{{ enums.ICONS.ADD }}</v-icon>
          <span>{{ $t("buttons.create") }}</span>
        </v-btn>
        <v-btn
          v-if="withEdit"
          class="ml-2"
          icon
          large
          @click="onEdit"
        >
          <v-icon>{{ enums.ICONS.EDIT }}</v-icon>
        </v-btn>
        <v-btn
          v-if="withDelete"
          class="ml-2"
          icon
          large
          @click="onDelete"
        >
          <v-icon>{{ enums.ICONS.DELETE }}</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import enums from "@/enums";
import _ from "lodash";

export default {
  props: {
    title: String,
    withSearch: Boolean,
    withAdd: Boolean,
    withFilter: Boolean,
    withBack: Boolean,
    withEdit: Boolean,
    withDelete: Boolean,
    allClear: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchText: "",
      mainPage: null
    };
  },
  computed: {
    enums() {
      return enums;
    }
  },
  methods: {
    goTo() {
      this.$emit("onBack");
      this.$router.push({ path: this.mainPage });
    },    
    onAdd() {
      this.$emit("onAdd");
    },
    onFilter() {
      this.$emit("onFilter");
    },
    onEdit() {
      this.$emit("onEdit");
    },
    onDelete() {
      this.$emit("onDelete");
    },
    onSearch: _.debounce(function() {
      this.$emit("onSearch", this.searchText);
    }, process.env.VUE_APP_DEBOUNCE_TIME)
  },
  created() {
    let array = this.$route.path.split("/");
    let test = array[array.length - 2].split("#")[0];
    if (!isNaN(test)) {
      array.splice(array.length - 1, 1);
      array.splice(array.length - 1, 1);
    } else {
      array.splice(array.length - 1, 1);
    }
    this.mainPage = "/"+array[array.length - 1];
  }
};
</script>

<style scoped>
.colored-button {
  background-color: var(--v-secondary-lighten5);
}
.my-toolbar {
  min-height: 96px;
}
.my-toolbar .row {
  min-height: 96px;
}
</style>
