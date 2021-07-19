<template>
  <div>
    <div class="my-container">
      <v-card :class="{ 'center-panel': false }">
        <Toolbar
          title="Devices"
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
          title="Microservices"
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
const io = require('socket.io-client');

export default {
  name: 'DevicesList',

  components: {
    BaseGrid,
    DeviceForm,
    Toolbar
  },

  mixins: [helper],

  methods: {
    mapHeaders(is_devices) {
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
        value: "copter_id",
        align: "start",
        sortable: true
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
      if (is_devices)
        tableHeaders.push({
          value: "rtt",
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
          copter_id: { data: item.copter_id, dataType: "text" },
          default_name: { data: item.default_name, dataType: "text" },
          current_name: { data: item.current_name, dataType: "text" },
          created_at: { data: item.created_at, dataType: "text" },
          updated_at: { data: item.updated_at, dataType: "text" },
          rtt: { data: item.rtt, dataType: "text" },
        };
        /*item.click_action = {
          actionType: "custom",
          callback: () => {

          },
        };*/

        // retrieve device type
        let device_type=this.split(item.current_name)[1];

        switch (device_type) {
          case "gw": {
            // retrieve fccs
            let fccs=null;
            items.forEach(i => {
              if (i.copter_id==item.copter_id && this.split(i.current_name)[1]=="fccs")
                fccs=i;
            });
            if (!fccs)
              fccs=item;

            item.actions = [
              {
                actionType: "router-link",
                namedRoot: "Drone",
                namedRootQuery: {
                  copter_id: "gw_"+item.mac_address.replace(/:/g,""),
                  fccs_id: "fccs_"+fccs.mac_address.replace(/:/g,""),
                },
                icon: "gps_fixed",
              }
            ];
            break;
          }
          case "sensor": {
            item.actions = [
              {
                actionType: "router-link",
                namedRoot: "Controller",
                icon: "gps_fixed",
              }
            ];
            break;
          }
          default: {
            item.actions = [
              {
                actionType: "router-link",
                icon: "gps_fixed",
                disable: true,
              }
            ];
            break;
          }
        }

        return item;
      });
      return tableItems;
    },
    async fetch() {
      let temp_items=await this.fetchWithCheck(this.$dbapp_url);
      if (temp_items) {
        // filter the elements on the basis of the is_device flag
        this.items1=_.filter(temp_items, (item) => {
          return item.is_device==true;
        });
        this.items2=_.filter(temp_items, (item) => {
          return item.is_device==false;
        });
        this.total1=this.items1.length;
        this.total2=this.items2.length;
        
        this.rttUpdate();
        this.tableData1.items=this.mapItems(this.items1);
        this.tableData2.items=this.mapItems(this.items2);
      }
    },
    sendRttTest(copter_id) {
      this.rtt[copter_id].rtt_ts1=Date.now();
      console.log('Sending rtt_test to copter '+copter_id);
      this.socket.emit('rtt_test', {copterId: copter_id});
    },
    rttUpdate() {
      // update the rtt field for all the devices
      this.items1.forEach(item => {
        let device_type=this.split(item.current_name)[1];
        if (device_type=="gw" && item.copter_id in this.rtt)
          item.rtt=this.rtt[item.copter_id].rtt_diff;
        else item.rtt="";
      });
    },
    rttTest() {
      if (!this.connected) return;

      let filteredItems=_.uniqBy(this.items1,'copter_id');
      filteredItems.forEach(item => {
        if (!(item.copter_id in this.rtt)) {
          this.rtt[item.copter_id]={};

          // connect to copter
          console.log("Connecting to copter "+item.copter_id);
          this.socket.emit('connect_to_copter', item.copter_id);
          
          // send rtt test to copter
          this.sendRttTest(item.copter_id);
          
          // handle rtt response message
          this.socket.on(`/${item.copter_id}/rtt_resp`, () => {
            console.log('Received rtt_resp from copter '+item.copter_id);

            let rtt_record=this.rtt[item.copter_id];
            rtt_record.rtt_ts2=Date.now();
            rtt_record.rtt_diff=rtt_record.rtt_ts2-rtt_record.rtt_ts1;

            this.rttUpdate();
            this.tableData1.items=this.mapItems(this.items1);
          });
        }
        else {
          // send rtt test to copter
          this.sendRttTest(item.copter_id);
        }
      });
    },
    handleEdit(item) {
      this.editItem=item;
      this.formDialog=true;
    },
    onConnect(){
      console.log("Connected to wss");
      this.connected=true;
    },
    onDisconnect(){
      console.log("Disconnected from wss");
      this.connected=false;
    },
  },

  created() {
    this.fetch().then(this.rttTest);
    this.tableData1.headers=this.mapHeaders(true);
    this.tableData2.headers=this.mapHeaders(false);
  },
  mounted() {
    this.updateTimer=setInterval(() => {
      this.fetch().then(this.rttTest);
    }, 10000);

    // connect to wss
    this.socket = io(this.$wss_url)
    this.socket.on('connect', this.onConnect)
    this.socket.on('disconnect', this.onDisconnect)
  },
  beforeRouteLeave (to, from, next) {
    clearInterval(this.updateTimer);
    this.socket.disconnect();
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

      updateTimer: null,

      // connection with wss through socket.io
      // for rtt test
      socket: null,
      connected: false,
      rtt: {}
    };
  }
};
</script>
