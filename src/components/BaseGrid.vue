<template>
  <div>
    <div class="custom-header">
      <div class="total">
        {{totalLength}} 
        <span v-if="totalLength==1">{{$t('baseGrid.found')}}</span>
        <span v-if="totalLength!=1">{{$t('baseGrid.founds')}}</span>
      </div>
      <div class="paginator">
        <v-progress-circular
          v-if="loading"
          indeterminate
          size="32"
          class="mr-2"
        ></v-progress-circular>
        {{$t('baseGrid.rowsPerPage')}}:
        <div class="per-page-selector">
          <v-select
            v-model="paginationOpts.itemsPerPage"
            :items="[10, 25, 50, 100]"
            @change="handlePerPageChange"
          ></v-select>
        </div>
        {{
          paginationOpts.page * paginationOpts.itemsPerPage +
          1 -
          paginationOpts.itemsPerPage
        }}-{{
          Math.min(
            paginationOpts.page * paginationOpts.itemsPerPage,
            totalLength
          )
        }}
        {{$t('baseGrid.of')}} {{ totalLength }}
        <v-btn icon large color="primary" @click="handleLeft">
          <v-icon dark>{{enums.ICONS.LEFT}}</v-icon>
        </v-btn>
        <v-btn icon large color="primary" @click="handleRight">
          <v-icon dark>{{enums.ICONS.RIGHT}}</v-icon>
        </v-btn>
      </div>
    </div>
    <v-data-table
      ref="dTable"
      :headers="tableHeaders"
      :items="items"
      :server-items-length="serverItems ? totalLength : -1"
      :options.sync="paginationOpts"
      :must-sort="true"
      hide-default-footer
      dense
    >
      <template v-slot:body="{ items }">
        <tbody>
          <template v-for="(item, i) in items">
            <tr :key="i" @click="handleClick(item,item.click_action)" :class="{'cursor-pointer': 'click_action' in item && !item.click_action.hide}">
              <td
                v-for="(v, fieldName, j) in item.fields"
                :key="fieldName"
                :class="v.css + ' ' + tableName + '-' + j.toString()"
              >
                <v-chip v-if="v.dataType == 'chip'" :class="v.chipClass">
                  {{ v.data }}
                </v-chip>
                <span v-if="v.dataType == 'text'">
                  {{ v.data }}
                </span>
                <span v-if="v.dataType == 'datetime'">
                  {{ v.data | datetime }}
                </span>
                <span v-if="v.dataType == 'date'">
                  {{ v.data | date }}
                </span>
                <a v-if="v.dataType == 'link'" :href="v.data">
                  {{ v.data }}
                </a>
              </td>

              <td class="text-center actions-td" v-if="withActions">
                <slot :item="item" name="actions"></slot>
                <template v-for="(v, index) in item.actions">
                  <v-btn
                    :key="index"
                    v-if="v.actionType == 'router-link'"
                    v-show="!v.hide"
                    :title="v.tooltip"
                    :disabled="v.disable"
                    icon
                    color="primary"
                    @click.stop="goto({ name: v.namedRoot, params: v.namedRootParams })"
                  >
                    <span v-if="v.icon_text">{{ v.icon_text }}</span>
                    <v-icon v-if="!v.icon_text" dark>{{ v.icon }}</v-icon>
                  </v-btn>
                  <v-btn
                    :key="index"
                    v-if="v.actionType == 'custom'"
                    v-show="!v.hide"
                    :title="v.tooltip"
                    :disabled="v.disabled"
                    icon
                    color="primary"
                    @click.stop="v.callback(item)"
                    slot="activator"
                  >
                    <span v-if="v.loading"><v-progress-circular indeterminate /></span>
                    <span v-if="!v.loading && v.icon_text">{{ v.icon_text }}</span>
                    <v-icon v-if="!v.loading && !v.icon_text" dark>{{ v.icon }}</v-icon>
                  </v-btn>
                </template>
                <v-btn
                  v-if="withEdit"
                  icon
                  color="primary"
                  @click.stop="onEdit(item)"
                >
                  <v-icon dark>{{enums.ICONS.EDIT}}</v-icon>
                </v-btn>

                <v-btn
                  v-if="withDelete"
                  icon
                  color="primary"
                  @click.stop="onDelete(item)"
                >
                  <v-icon dark>{{enums.ICONS.DELETE}}</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
          <v-alert v-if="totalLength==0 && !loading" icon="warning">{{
            $t("baseGrid.noResults")
          }}</v-alert>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import _ from "lodash";
import enums from "@/enums";

export default {
  props: {
    headers: {},
    items: {},
    totalLength: {},
    loading: {},
    injectOpts: {},
    withActions: {},
    withEdit: {},
    withDelete: {},
    serverItems: {
      default: true,
      type: Boolean
    },
    tableName: {
      default: "noname",
      type: String
    }
  },

  computed: {
    tableHeaders() {
      let headersComputed=_.clone(this.headers);
      headersComputed.forEach((val) => {
        val.text=this.$t('headers.'+this.tableName+'.'+val.value);
      });
      if (this.withActions) {
        headersComputed.push({
          text: this.$t('baseGrid.actions'),
          value: "actions",
          align: "center",
          sortable: false
        });
      }
      headersComputed.forEach((val,i) => {
        val.class=this.tableName + "-" + i.toString();
      });
      return headersComputed;
    },
    enums() {
      return enums;
    }
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
    };
  },
  watch: {
    injectOpts(val) {
      this.paginationOpts = _.cloneDeep(val);
    },
  },

  components: {  },
  methods: {
    debounceEmit: _.debounce(function() {
      this.$emit("onPaginationChanged", this.paginationOpts);
    }, process.env.VUE_APP_DEBOUNCE_TIME),
    handlePagination() {
      this.debounceEmit();
    },
    handleLeft: function () {
      if (this.paginationOpts.page > 1) {
        this.paginationOpts.page--;
        this.debounceEmit();
      }
    },
    handleRight: function () {
      if (
        this.paginationOpts.page <
        this.totalLength / this.paginationOpts.itemsPerPage
      ) {
        this.paginationOpts.page++;
        this.debounceEmit();
      }
    },
    handlePerPageChange: function () {
      this.paginationOpts.page = 1;
      this.debounceEmit();
    },
    handleClick: function(item,v) {
      if (!v) return;
      if (v.hide) return;
      if (v.actionType == 'router-link')
        this.goto({ name: v.namedRoot, params: v.namedRootParams });
      else if (v.actionType == 'custom')
        v.callback(item);
    },
    goto: function(dst) {
      console.log("dst");
      console.log(dst);
      this.$router.push(dst).catch(()=>{});
    },
    onEdit: function(item) {
      this.$emit('onEdit', item);
    },
    onDelete: function(item) {
      this.$emit('onDelete', item);
    }
  },
  created() {
    this.paginationOpts = _.cloneDeep(this.$props.injectOpts);
  },
  mounted() {
    this.$refs.dTable.$on("update:sort-by", this.handlePagination);
    this.$refs.dTable.$on("update:sort-desc", this.handlePagination);
  },
};
</script>

<style >
th {
  white-space: nowrap;
}
.actions-td {
  white-space: nowrap;
}
.custom-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
}
.total {
  width: 50%;
  text-align: left;
  display: inline-block;
}
.paginator {
  font-size: 0.85rem !important;
  width: 50%;
  text-align: right;
  display: inline-block;
}

.per-page-selector {
  display: inline-block;
  height: 58px;
  margin-bottom: 8px;
  width: 64px;
  margin-left: 8px;
  margin-right: 8px;
}

.cursor-pointer {
  cursor: pointer;
}
</style>