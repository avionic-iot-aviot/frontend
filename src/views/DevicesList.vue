<template>
  <v-card>
    <BaseGrid
      :headers="tableData.headers"
      :items="tableData.items"
      :totalLength="total"
      :injectOpts="injectOpts"
      :loading="loading"
      :withActions="true"
      :withEdit="true"
      :serverItems="false"
      tableName="devices"
      @onEdit="handleEdit"
    ></BaseGrid>
    <v-dialog
      v-model="formDialog"
      content-class="edit-form-dialog"
    >
      <DeviceForm
        v-if="formDialog"
        @formClose="formDialog=false"
        @formSucceed="fetch()"
        :mode="enums.FORM_MODE.UPDATE"
        :selectedItem="selectedItem"
      />
    </v-dialog>
  </v-card>
</template>

<script>
import BaseGrid from "@/components/BaseGrid";
import _ from "lodash";
import helper from "@/mixins/helper";
import DeviceForm from "@/components/forms/DeviceForm";

export default {
  name: 'DevicesList',

  components: {
    BaseGrid,
    DeviceForm
  },

  mixins: [helper],

  methods: {
    mapHeaders() {
      let tableHeaders=[];

      tableHeaders.push({
        value: "Device_id",
        align: "start",
        sortable: true
      });
      tableHeaders.push({
        value: "Mac",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "Default_Name",
        align: "start",
        sortable: true
      });
      tableHeaders.push({
        value: "Current_Name",
        align: "start",
        sortable: true
      });
      tableHeaders.push({
        value: "Created_at",
        align: "start",
        sortable: true
      });
      tableHeaders.push({
        value: "Updated_at",
        align: "start",
        sortable: true
      });
      return tableHeaders;
    },
    mapItems() {
      let tableItems = _.map(this.items, item => {
        item.fields = {
          Device_id: { data: item.Device_id, dataType: "text" },
          Mac: { data: item.Mac, dataType: "text" },
          Default_Name: { data: item.Default_Name, dataType: "text" },
          Current_Name: { data: item.Current_Name, dataType: "text" },
          Created_at: { data: item.Created_at, dataType: "text" },
          Updated_at: { data: item.Updated_at, dataType: "text" },
        };
        /*item.click_action = {
          actionType: "custom",
          callback: () => {

          },
        };*/
        /*item.actions = [
          {
            actionType: "router-link",
            namedRoot: "userDetails",
            namedRootId: item.id,
            icon: "gps_fixed",
          }
        ];*/
        return item;
      });
      return tableItems;
    },
    async fetch() {
      let res=await this.fetchWithCheck(localStorage.ip,localStorage.port);
      if (res) {
        [this.items,this.total]=res;
        this.tableData.items=this.mapItems();
      }
    },
    handleEdit(item) {
      this.selectedItem=item;
      this.formDialog=true;
    }
  },

  created() {
    this.fetch();
    this.tableData.headers=this.mapHeaders();
  },

  data() {
    return {
      injectOpts: {
        sortBy: ["Device_id"],
        sortDesc: [false],
      },
      tableData: { headers: [], items: [] },
      items: [],
      total: 0,
      loading: false,
      formDialog: false,
      selectedItem: null
    };
  }
};
</script>
