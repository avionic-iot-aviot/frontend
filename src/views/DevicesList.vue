<template>
  <div>
    <div class="my-container">
      <v-card :class="{ 'center-panel': false }">
        <Toolbar
          title="Drones"
        />
        <BaseGrid
          tableName="devices"
          :headers="tableData1.headers"
          :items="tableData1.items"
          :totalLength="total1"
          :injectOpts="paginationOpts1"
          :loading="loading1"
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
        <Toolbar
          title="Nodes"
        />
        <BaseGrid
          tableName="devices"
          :headers="tableData2.headers"
          :items="tableData2.items"
          :totalLength="total2"
          :injectOpts="paginationOpts2"
          :loading="loading2"
          :withActions="false"
          :withEdit="true"
          :serverItems="false"
          @onEdit="handleEdit"
        ></BaseGrid>
      </v-card>
    </div>
  </div>
</template>

<script>
import BaseGrid from "@/components/BaseGrid";
import Toolbar from "@/components/Toolbar";
import _ from "lodash";
import helper from "@/mixins/helper";
import DeviceForm from "@/components/forms/DeviceForm";

export default {
  name: 'DevicesList',

  components: {
    BaseGrid,
    DeviceForm,
    Toolbar
  },

  mixins: [helper],

  methods: {
    mapHeaders() {
      let tableHeaders=[];

      tableHeaders.push({
        value: "device_id",
        align: "start",
        sortable: true
      });
      tableHeaders.push({
        value: "mac_address",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "ip",
        sortable: true,
        align: "start"
      });
      tableHeaders.push({
        value: "default_name",
        align: "start",
        sortable: true
      });
      tableHeaders.push({
        value: "current_name",
        align: "start",
        sortable: true
      });
      tableHeaders.push({
        value: "created_at",
        align: "start",
        sortable: true
      });
      tableHeaders.push({
        value: "updated_at",
        align: "start",
        sortable: true
      });
      return tableHeaders;
    },
    mapItems(items) {
      let tableItems = _.map(items, item => {
        item.fields = {
          device_id: { data: item.device_id, dataType: "text" },
          mac_address: { data: item.mac_address, dataType: "text" },
          ip: { data: item.ip, dataType: "text" },
          default_name: { data: item.default_name, dataType: "text" },
          current_name: { data: item.current_name, dataType: "text" },
          created_at: { data: item.created_at, dataType: "text" },
          updated_at: { data: item.updated_at, dataType: "text" },
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
            namedRootParams: {copter_id: "drone_"+item.mac_address.replace(/:/g,"")},
            icon: "gps_fixed",
          }
        ];
        return item;
      });
      return tableItems;
    },
    async fetch() {
      let temp_items=await this.fetchWithCheck(this.$dbapp_url);
      if (temp_items) {
        // filter the elements on the basis of the is_drone flag
        this.items1=_.filter(temp_items, (item) => {
          return item.is_drone==true;
        });
        this.items2=_.filter(temp_items, (item) => {
          return item.is_drone==false;
        });
        this.total1=this.items1.length;
        this.total2=this.items2.length;
        
        this.tableData1.items=this.mapItems(this.items1);
        this.tableData2.items=this.mapItems(this.items2);
      }
    },
    handleEdit(item) {
      this.editItem=item;
      this.formDialog=true;
    }
  },

  created() {
    this.fetch();
    this.tableData1.headers=this.mapHeaders();
    this.tableData2.headers=this.mapHeaders();
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
      paginationOpts1: {
        sortBy: ["device_id"],
        sortDesc: [false],
      },
      paginationOpts2: {
        sortBy: ["device_id"],
        sortDesc: [false],
      },

      tableData1: { headers: [], items: [] },
      tableData2: { headers: [], items: [] },
      items1: [],
      items2: [],
      total1: 0,
      total2: 0,
      loading1: false,
      loading2: false,

      formDialog: false,
      editItem: null,

      updateTimer: null
    };
  }
};
</script>
