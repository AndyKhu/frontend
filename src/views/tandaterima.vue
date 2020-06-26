<template>
  <div>
    <v-tabs v-model="tab" background-color="transparent" color="baretcolor">
      <v-tab v-for="item in tabs" :key="item.tab">
        <v-icon small class="mr-3">{{item.icon}}</v-icon>
        {{ item.tab }}
        <v-chip
          dark
          v-if="item.tab == 'Table'"
          x-small
          class="ml-3 pa-1"
          :color="tab==0?'baretcolor':'grey'"
          :disabled="tab!=0"
        >{{dataTable.length}}</v-chip>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item key="Table">
        <v-card class="item-container">
          <v-row no-gutters class="pa-3" align="center">
            <v-col class="col-12 col-md-3">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                placeholder="Search.."
                class="cst-textfield"
                outlined
                rounded
                dense
                single-line
                hide-details
              >
                <template v-slot:append class="pa-0 ma-0">
                  <v-dialog v-model="filter" width="500">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        fab
                        depressed
                        color="blue-grey lighten-4"
                        class="pa-0"
                        height="35"
                        width="55"
                        style="border-radius: 25px;margin-right:3px"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon small color="baretcolor">mdi-filter</v-icon>
                      </v-btn>
                    </template>

                    <v-card>
                      <v-card-title class="headline grey lighten-2" primary-title>Select Filter</v-card-title>

                      <v-card-text>
                        <v-switch
                          v-for="item in headers"
                          :key="item.value"
                          v-model="item.filterable"
                          class="ma-1"
                          :label="item.text"
                        ></v-switch>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </template>
              </v-text-field>
            </v-col>
            <v-col class="col-12 col-md-9" align="end">
              <v-btn color="success no-uppercase mr-2" @click="create">
                <v-row no-gutters align="center">
                  <v-icon small class="mr-1">mdi-plus-circle</v-icon>Create
                </v-row>
              </v-btn>
              <v-btn color="primary no-uppercase mr-2" v-if="selected.length != 0" @click="editbtn">
                <v-row no-gutters align="center">
                  <v-icon small class="mr-1">mdi-file-edit</v-icon>Edit
                </v-row>
              </v-btn>
              <v-btn color="error no-uppercase" v-if="selected.length != 0" @click="trash">
                <v-row no-gutters align="center">
                  <v-icon small class="mr-1">mdi-delete-circle</v-icon>Delete
                </v-row>
              </v-btn>
            </v-col>
          </v-row>
          <v-data-table
            height="400px"
            dense
            class="tttable"
            v-model="selected"
            :headers="headers"
            :items="dataTable"
            :search="search"
            @click:row="edit"
            item-key="id"
            :item-class="(item)=>{return item.status === 1? 'row-finish': item.status ===2 ? 'row-closed': ''}"
            show-select
          >
            <template v-slot:item.actions="{item}">
              <v-btn icon color="warning" @click="edit(item)">
                <v-icon>mdi-file-edit</v-icon>
              </v-btn>
            </template>
            <template v-slot:item.tanggal="{ item }">
              <span>{{new Date(item.tanggal) | dateFormat('DD.MM.YYYY')}}</span>
            </template>
            <template v-slot:item.statusgaransi="{ item }">
              <v-icon >{{item.statusgaransi?'mdi-checkbox-marked-circle':'mdi-close-circle'}}</v-icon>
              <!-- <v-simple-checkbox v-model="item.statusgaransi" disabled></v-simple-checkbox> -->
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>
      <v-tab-item key="Form">
        <v-card class="item-container pa-2">
          <v-form v-model="ttvalid" ref="ttform" @submit.prevent="save">
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <v-combobox
                    v-model="tandaTerima.namapelanggan"
                    :items="pelanggans"
                    :filter="filterpelanggan"
                    label="Nama Pelanggan"
                    auto
                    @update:search-input="supelcontrol"
                    auto-select-first
                    required
                    :rules="required"
                    outlined
                  >
                    <template v-slot:selection="{ attrs, item }">{{item.nama}}</template>
                    <template v-slot:item="{index,item}">
                      {{item.nama}}
                      <span v-if="item.telepon" class="ml-1">- {{item.telepon}}</span>
                    </template>
                    <template v-slot:no-data>
                      <v-btn
                        class="mx-2 no-uppercase"
                        small
                        depressed
                        color="success"
                        @click="createSupel"
                        dark
                      >
                        <v-icon small class="mr-1">mdi-plus-circle</v-icon>Create
                      </v-btn>
                    </template>
                  </v-combobox>
                </v-col>
                <v-col cols="12" md="4">
                  <v-menu
                    v-model="timemodal"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="new Date(tandaTerima.tanggal) | dateFormat('DD/MM/YYYY') "
                        label="Tanggal"
                        append-icon="mdi-calendar-month"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        outlined
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="tandaTerima.tanggal" @input="timemodal = false"></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    :items="jenisbarangs"
                    v-model="tandaTerima.jenisbarang"
                    label="Jenis Barang"
                    outlined
                    required
                    :rules="required"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="tandaTerima.namabarang"
                    label="Nama Barang"
                    required
                    outlined
                    :rules="required"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="tandaTerima.seribarang" label="Seri Barang" outlined></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="tandaTerima.kelengkapan" label="Kelengkapan" outlined></v-text-field>
                </v-col>
                <v-col cols="12" :md="tandaTerima.id?'6':'12'" class="py-0">
                  <v-switch
                    v-model="tandaTerima.statusgaransi"
                    class="mx-2 mt-0"
                    label="Status Garansi"
                  ></v-switch>
                </v-col>
                <v-col cols="12" md="6" class="py-0" v-if="tandaTerima.id">
                  <v-radio-group v-model="tandaTerima.status" row class="mt-0">
                    <v-radio label="On Progress" :value="0"></v-radio>
                    <v-radio label="Finish" :value="1"></v-radio>
                    <v-radio label="Closed" :value="2"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col class="py-0" cols="12" :md="tandaTerima.id?'6':'12'">
                  <v-textarea
                    rows="3"
                    outlined
                    label="Masalah"
                    v-model="tandaTerima.masalah"
                    required
                    :rules="required"
                  ></v-textarea>
                </v-col>
                <v-col class="py-0" cols="12" md="6" v-if="tandaTerima.id">
                  <v-textarea
                    outlined
                    label="Keterangan Teknisi"
                    v-model="tandaTerima.keteranganteknisi"
                    rows="3"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row justify="end">
                <v-col col="12" md="2">
                  <v-btn block color="error" @click="cancel">
                    <v-row no-gutters align="center">
                      <v-icon small class="mr-1">mdi-close-circle</v-icon>cancel
                    </v-row>
                  </v-btn>
                </v-col>
                <v-col col="12" md="2">
                  <v-btn block color="primary" @click="save" type="submit" :disabled="isloading">
                    <v-row no-gutters align="center">
                      <v-icon small class="mr-1">mdi-content-save</v-icon>Save
                    </v-row>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
    <v-dialog v-model="modalsupel" persistent max-width="450">
      <v-card>
        <v-toolbar dark color="success" dense>
          <v-toolbar-title>Create Pelanggan</v-toolbar-title>
        </v-toolbar>
        <v-form v-model="supelvalid" class="pa-4" ref="supelform">
          <v-container>
            <v-row justify="end">
              <v-col col="12" sm="12" class="py-0">
                <v-text-field
                  v-model="supel.nama"
                  label="Nama Pelanggan"
                  :rules="required"
                  required
                  outlined
                ></v-text-field>
              </v-col>
              <v-col col="12" sm="12" class="py-0">
                <v-text-field
                  v-model="supel.telepon"
                  label="Telepon"
                  :rules="required"
                  required
                  outlined
                ></v-text-field>
              </v-col>
              <v-btn class="mr-3" color="error" @click="cancelSupel">cancel</v-btn>
              <v-btn class="mr-3" color="primary" @click="saveSupel" :disabled="isloading">save</v-btn>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>
<style lang="scss" scoped>
.tttable::v-deep {
  .row-finish {
    background: #43A047 !important;
    color: #fff;
    &:hover{
      background: #388E3C !important;
    }
    i {
      color: #fff !important;
    }
  }
  .row-closed {
    background: #9e9e9e !important;
    color: #424242;
    &:hover{
      background: #757575 !important;
    }
    i {
      color: #424242 !important;
    }
  }
}
.cst-textfield ::v-deep {
  .v-input__slot {
    padding-right: 0 !important;
  }
  .v-input__append-inner {
    margin-top: 3px !important;
  }
}
.v-tab {
  background: #e2e2e2;
  &--active {
    background: #ffffff;
  }
}
.no-uppercase {
  text-transform: none;
}
.item-container {
  &::v-deep {
    .v-data-table__checkbox i,
    .v-data-table-header i {
      color: #fb8c00;
    }
    .v-data-table-header {
      background-color: #f3f4fb;
    }
  }
}
</style>
<script>
export default {
  data: () => ({
    //Tabs Variable
    tab: null,
    tabs: [
      { tab: "Table", icon: "mdi-table-large" },
      { tab: "Form", icon: "mdi-file" }
    ],
    //Table Variable
    filter: false,
    selected: [],
    search: "",
    headers: [
      { text: "Nama Pelanggan", value: "namapelanggan.nama", filterable: true },
      { text: "Telepon", value: "namapelanggan.telepon", filterable: true },
      { text: "Jenis Barang", value: "jenisbarang", filterable: true },
      { text: "Nama Barang", value: "namabarang", filterable: true },
      { text: "Seri Barang", value: "seribarang", filterable: true },
      {
        text: "Garansi",
        align: "center",
        value: "statusgaransi",
        filterable: true
      },
      { text: "Kelengkapan", value: "kelengkapan", filterable: true },
      { text: "Masalah", value: "masalah", filterable: true },
      {
        text: "Keterarangan teknisi",
        value: "keteranganteknisi",
        filterable: true
      },
      { text: "Tanggal", value: "tanggal", filterable: true },
      { text: "Actions", value: "actions", sortable: false }
    ],
    dataTable: [],
    //Form Variable
    jenisbarangs: ["Laptop", "Komputer", "Printer", "ETC"],
    pelanggans: [],
    tandaTerima: {},
    ttvalid: false,
    timemodal: false,
    isloading: false,
    //Pelanggan variable
    modalsupel: false,
    supelvalid: false,
    supel: {},
    supelsearch: '',
    //form validate
    required: [v => !!v || "This Input is required"]
  }),
  methods: {
    create() {
      this.reinit();
      this.tab = 1;
    },
    editbtn() {
      if (this.selected.length === 1) {
        this.edit(this.selected[0]);
        this.selected = [];
      } else {
        this.$store.commit("message", {
          status: true,
          text: "Pilih Satu Data untuk Edit",
          timeout: 1000,
          type: "error"
        });
      }
    },
    edit(value) {
      this.tandaTerima = value;
      this.tandaTerima.tanggal = new Date(this.tandaTerima.tanggal)
        .toISOString()
        .substr(0, 10);
      this.tab = 1;
      this.selected = [];
    },
    trash() {
      this.isloading = true;
      this.$api.tandaterima
        .deletett(this.selected)
        .then(() => {
          this.isloading = false;
          this.$store.commit("message", {
            status: true,
            text: "Delete Success",
            timeout: 1000,
            type: "success"
          });
          this.reinit();
          this.tab = 0;
          this.refresh();
          this.selected = [];
        })
        .catch(err => {
          this.isloading = false;
          this.$store.commit("message", {
            status: true,
            text: "Delete Failed , Error: " + err.response.data,
            timeout: 1000,
            type: "error"
          });
        });
    },
    cancel() {
      this.reinit();
      this.tab = 0;
    },
    save() {
      if (this.ttvalid) {
        this.isloading = true;
        if (this.tandaTerima.id) {
          this.$api.tandaterima
            .update(this.tandaTerima)
            .then(() => {
              this.isloading = false;
              this.refresh();
              this.reinit();
              this.tab = 0;
              this.$store.commit("message", {
                status: true,
                text: "Update Success",
                timeout: 1000,
                type: "success"
              });
            })
            .catch(err => {
              this.isloading = false;
              this.$store.commit("message", {
                status: true,
                text: "Save Failed - ERROR: " + err.response.data,
                timeout: 1000,
                type: "error"
              });
            });
        } else {
          this.$api.tandaterima
            .save(this.tandaTerima)
            .then(() => {
              this.isloading = false;
              this.refresh();
              this.reinit();
              this.tab = 0;
              this.$store.commit("message", {
                status: true,
                text: "Save Success",
                timeout: 1000,
                type: "success"
              });
            })
            .catch(err => {
              this.isloading = false;
              this.$store.commit("message", {
                status: true,
                text: "Save Failed - ERROR: " + err.response.data,
                timeout: 1000,
                type: "error"
              });
            });
        }
      } else {
        this.isloading = false;
        this.$refs.ttform.validate();
        this.$store.commit("message", {
          status: true,
          text: "Save Failed",
          timeout: 1000,
          type: "error"
        });
      }
    },
    createSupel() {
      this.modalsupel = true;
      this.reinitsupel();
      this.supel.nama = this.supelsearch;
    },
    cancelSupel() {
      this.modalsupel = false;
      this.reinitsupel();
    },
    saveSupel() {
      if (this.supelvalid) {
        this.isloading = true;
        this.$api.tandaterima
          .savePelanggan(this.supel)
          .then(res => {
            this.isloading = false;
            this.$store.commit("message", {
              status: true,
              text: "Save Success",
              timeout: 1000,
              type: "success"
            });
            this.tandaTerima.namapelanggan = res.data
            this.pelanggans.push(res.data);
            this.reinitsupel();
            this.modalsupel = false;
          })
          .catch(err => {
            this.isloading = false;
            this.$store.commit("message", {
              status: true,
              text: "Save Failed - ERROR: " + err.response.data,
              timeout: 1000,
              type: "error"
            });
          });
      } else {
        this.$store.commit("message", {
          status: true,
          text: "Save Failed",
          timeout: 1000,
          type: "error"
        });
      }
    },
    refresh() {
      this.$api.tandaterima.getDataALL().then(res => {
        this.dataTable = res.data;
      });
    },
    reinitsupel() {
      this.supel = {
        nama: "",
        telepon: ""
      };
      if (this.$refs.supelform) this.$refs.supelform.resetValidation();
    },
    reinit() {
      this.tandaTerima = {
        namapelanggan: "",
        jenisbarang: "",
        namabarang: "",
        seribarang: "",
        statusgaransi: false,
        kelengkapan: "",
        masalah: "",
        keteranganteknisi: "",
        tanggal: new Date().toISOString().substr(0, 10)
      };
      if (this.$refs.ttform) this.$refs.ttform.resetValidation();
      this.reinitsupel();
    },
    supelcontrol(ev){
      this.supelsearch = ev
    },
    filterpelanggan(item, queryText) {
      return (
        item.nama.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) >
          -1 ||
        item.telepon
          .toLocaleLowerCase()
          .indexOf(queryText.toLocaleLowerCase()) > -1
      );
    }
  },
  created() {
    this.refresh();
    this.$api.tandaterima.getPelanggans().then(res => {
      this.pelanggans = res.data;
    });
    this.reinit();
  }
};
</script>