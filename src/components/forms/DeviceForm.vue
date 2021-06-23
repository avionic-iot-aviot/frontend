<template>
  <div>
    <v-card-title class="form-title">{{
      this.formTitle | capitalize
    }}</v-card-title>
    <ValidationObserver v-slot="{ invalid }">
      <v-card-text>
        <v-text-field
          :label="$t('headers.devices.mac_address')"
          v-model="form.mac_address"
          :disabled="true"
        ></v-text-field>
        <ValidationProvider :name="$t('headers.devices.current_name')" immediate rules="required" v-slot="{ errors }">
          <v-text-field
            :label="$t('headers.devices.current_name')"
            v-model="form.current_name"
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
        device_id: "",
        mac_address: "",
        current_name: ""
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
      let res=await this.updateWithCheck(this.$dbapp_url,this.form.current_name,this.form.mac_address);
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
        this.form.device_id = row.device_id;
        this.form.mac_address = row.mac_address;
        this.form.current_name = row.current_name;
      } else if (row == null) {
        this.form.device_id = "";
        this.form.mac_address = "";
        this.form.current_name = "";
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
            resourceName: this.form.device_id || "-"
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
