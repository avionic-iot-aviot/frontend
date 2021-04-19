<template>
  <div>
    <div class="my-container">
      <v-card :class="{ 'center-panel': false }">
        <BaseGrid
          tableName="devices"
          :headers="tableData.headers"
          :items="tableData.items"
          :totalLength="total"
          :injectOpts="paginationOpts"
          :loading="loading"
          :withActions="true"
          :withEdit="true"
          :serverItems="false"
          @onEdit="handleEdit"
        ></BaseGrid>
        <v-dialog
          v-model="formDialog"
          content-class="edit-form-dialog"
        >
          <v-card>
            <DeviceForm
              v-if="formDialog"
              :mode="enums.FORM_MODE.UPDATE"
              :selectedItem="editItem"
              @formSucceed="fetch()"
              @formClose="formDialog=false"
            />
          </v-card>
        </v-dialog>
      </v-card>
    </div>
  </div>
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
        item.actions = [
          {
            actionType: "router-link",
            namedRoot: "VideoRoom",
            namedRootParams: {copter_id: item.Mac.replace(/:/g,"")},
            icon: "gps_fixed",
          }
        ];
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
      this.editItem=item;
      this.formDialog=true;
    }
  },

  created() {
    this.paginationOpts = {...this.paginationOpts, ...this.mergeOpts };
    this.fetch();
    this.tableData.headers=this.mapHeaders();
  },
  mounted() {
    this.updateTimer=setInterval(this.fetch, 10000);
  },
  beforeRouteLeave (to, from, next) {
    clearInterval(this.updateTimer);
    next();
  },


  data() {
    return {
      paginationOpts: {
        page: 1,
        itemsPerPage: 25,
        sortDesc: [false],
        multiSort: false,
        mustSort: true
      },
      tableData: { headers: [], items: [] },
      items: [],
      total: 0,
      loading: false,

      formDialog: false,
      editItem: null,

      mergeOpts: {
        sortBy: ["Device_id"],
        sortDesc: [false],
      },
      updateTimer: null
    };
  }
};
</script>
