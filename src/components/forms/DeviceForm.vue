<template>
  <div>
    <v-card-title class="form-title">{{
      this.formTitle | capitalize
    }}</v-card-title>
    <ValidationObserver v-slot="{ invalid }">
      <v-card-text>
        <v-text-field
          :label="$t('headers.devices.Mac')"
          v-model="form.Mac"
          :disabled="true"
        ></v-text-field>
        <ValidationProvider :name="$t('headers.devices.Current_Name')" immediate rules="required" v-slot="{ errors }">
          <v-text-field
            :label="$t('headers.devices.Current_Name')"
            v-model="form.Current_Name"
          ></v-text-field>
          <span class="form-error">{{ errors[0] }}</span>
        </ValidationProvider>
      </v-card-text>
      <FormButtons
        @onSave="onSubmit"
        @onCancel="onCancel"
        :disabled="invalid"
      />
    </ValidationObserver>
  </div>
</template>

<script>
import enums from "@/enums";
import FormButtons from "@/components/FormButtons";
import _ from "lodash";
import helper from "@/mixins/helper";

export default {
  name: "DeviceForm",
  props: {
    mode: {
      default: enums.FORM_MODE.CREATE,
      type: String
    },
    selectedItem: Object,
    withModelId: {
      type: String,
      required: false
    },
    withModelType: {
      type: String,
      required: false
    }
  },

  data() {
    return {
      resourceType: this.$t("resource_types.device"),
      formDialog: true,
      form: {
        Device_id: "",
        Mac: "",
        Current_Name: ""
      },
    };
  },
  
  mixins: [helper],
  
  components: { FormButtons },

  watch: {
    async selectedItem() {
      this.setForm(this.$props.selectedItem);
    },
  },
  
  methods: {
    async onSubmit() {
      let res=await this.updateWithCheck(localStorage.ip,localStorage.port,this.form.Current_Name,this.form.Mac);
      if (res) {
        this.$emit("formSucceed");
        this.$emit("formClose");
      }
    },
    async onCancel() {
      this.$emit("formCancel");
      this.$emit("formClose");
    },
    setForm(row = null) {
      if (row && !_.isEmpty(row)) {
        this.form.Device_id = row.Device_id;
        this.form.Mac = row.Mac;
        this.form.Current_Name = row.Current_Name;
      } else if (row == null) {
        this.form.Device_id = "";
        this.form.Mac = "";
        this.form.Current_Name = "";
      }
    },
  },

  computed: {
    enums() {
      return enums;
    },
    formTitle() {
      var title = "";
      switch (this.mode) {
        case enums.FORM_MODE.CREATE:
          title = this.$t("form_labels.createResource", {
            resourceType: this.resourceType
          });
          break;
        case enums.FORM_MODE.UPDATE:
          title = this.$t("form_labels.updateResource", {
            resourceType: this.resourceType,
            resourceName: this.form.Device_id || "-"
          });
          break;
        default:
          break;
      }
      return title;
    }
  },

  created() {
    if (this.mode == enums.FORM_MODE.CREATE) {
      this.setForm();
    } else {
      this.setForm(this.$props.selectedItem);
    }
  },
};
</script>
