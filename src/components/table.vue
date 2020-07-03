<template>
  <v-card class="item-container">
    <v-row no-gutters class="pa-3" align="center">
      <v-col class="col-12 col-md-3">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          placeholder="Search.."
          class="cst-textfield"
          outlined
          dense
          single-line
          hide-details
        >
          <template v-slot:append-outer>
            <v-btn small icon @click="refresh">
              <v-icon color="success">mdi-refresh-circle</v-icon>
            </v-btn>
            <v-tooltip right color="#fff">
              <template v-slot:activator="{ on, attrs }">
                <v-btn small icon v-bind="attrs" v-on="on">
                  <v-icon color="info">mdi-help-circle</v-icon>
                </v-btn>
              </template>
              <span class="grey--text text--darken-4">
                <v-row class="pa-2">
                  <v-icon dense class="mr-2" color="error">mdi-circle</v-icon>Urgent
                </v-row>
                <v-row class="pa-2">
                  <v-icon dense class="mr-2" color="baretonprogress">mdi-circle</v-icon>Dalam Perbaikan
                </v-row>
                <v-row class="pa-2">
                  <v-icon dense class="mr-2" color="baretfinish">mdi-circle</v-icon>Selesai
                </v-row>
                <v-row class="pa-2">
                  <v-icon dense class="mr-2" color="baretclosed">mdi-circle</v-icon>Sudah Diambil
                </v-row>
              </span>
            </v-tooltip>
          </template>
        </v-text-field>
      </v-col>
      <v-col class="col-12 col-md-9" align="end">
        <v-btn color="success no-uppercase mr-2" @click="create" :disabled="isloading">
          <v-row no-gutters align="center">
            <v-icon small class="mr-1">mdi-plus-circle</v-icon>Create
          </v-row>
        </v-btn>
        <v-btn
          color="error no-uppercase"
          v-if="selected.length != 0"
          @click="trash"
          :disabled="isloading"
        >
          <v-row no-gutters align="center">
            <v-icon small class="mr-1">mdi-delete-circle</v-icon>Delete
          </v-row>
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      height="400px"
      dense
      v-model="selected"
      :headers="headers"
      :items="dataTable"
      :search="search"
      @click:row="edit"
      item-key="id"
      :item-class="(item)=>{return item.urgent? 'row-urgent': item.status === 1? 'row-finish': item.status ===2 ? 'row-closed': item.status ===0 ?'row-onprogress': ''}"
      show-select
    >
      <template v-for="(index,name) in $scopedSlots" v-slot:[name]="data">
        <slot :name="name" v-bind="data"></slot>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
export default {
  props: {
    dataTable: {
      type: Array,
      required: true
    },
    headers: {
      type: Array,
      required: true
    },
    isloading: {
      type: Boolean,
      default: false
    },
    value: Array
  },
  data: () => ({
    search: ""
  }),
  methods: {
    create() {
      this.$emit("create");
    },
    edit(value) {
      this.$emit("edit", value);
    },
    trash() {
      this.$emit("trash");
    },
    refresh() {
      this.$emit("refresh");
    }
  },
  computed: {
    selected: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  }
};
</script>