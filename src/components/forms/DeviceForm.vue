<template>
  <div>
    <v-card-title class="form-title">{{
      this.formTitle | capitalize
    }}</v-card-title>
    <ValidationObserver v-slot="{ invalid }">
      <v-card-text>
        <v-text-field
          :label="$t('forms.devices.mac_address')"
          v-model="form.mac_address"
          :disabled="true"
        ></v-text-field>
        <v-container>
          <v-row>
            <v-col cols="6">
              <ValidationProvider :name="$t('forms.devices.device_name')" immediate rules="required" v-slot="{ errors }">
                <v-text-field
                  :label="$t('forms.devices.device_name')"
                  v-model="form.device_name"
                ></v-text-field>
                <span class="form-error">{{ errors[0] }}</span>
              </ValidationProvider>
            </v-col>
            <v-col cols="6">
              <ValidationProvider :name="$t('forms.devices.device_type')" immediate rules="required" v-slot="{ errors }">
                <v-combobox
                  v-model="form.device_type"
                  :items="device_types"
                  :label="$t('forms.devices.device_type')"
                ></v-combobox>
                <span class="form-error">{{ errors[0] }}</span>
              </ValidationProvider>
            </v-col>
          </v-row>
        </v-container>
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
        device_name: "",
        device_type: ""
      },
      device_types: [
        'fccs',
        'sensor',
        'gw',
        'camera',
      ],
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
      let current_name=this.form.device_name+"-"+this.form.device_type;
      let res=await this.updateWithCheck(this.$dbapp_url,current_name,this.form.mac_address);
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
        this.form.device_name = this.split(row.current_name,0);
        this.form.device_type = this.split(row.current_name,1);
      } else if (row == null) {
        this.form.device_id = "";
        this.form.mac_address = "";
        this.form.device_name = "";
        this.form.device_type = "";
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
