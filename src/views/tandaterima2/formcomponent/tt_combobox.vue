<template>
  <div>
    <v-combobox
      v-model="data"
      :items="pelanggans"
      :filter="filterpelanggan"
      label="Nama Pelanggan"
      auto
      dense
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
        <v-btn class="mx-2 no-uppercase" small depressed color="success" @click="createSupel" dark>
          <v-icon small class="mr-1">mdi-plus-circle</v-icon>Create
        </v-btn>
      </template>
    </v-combobox>
    <!-- Form Supel -->
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
                  :rules="teleponrule"
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
<script>
export default {
  props: {
    value: [Object, String]
  },
  data: () => ({
    //Pelanggan variable
    modalsupel: false,
    supelvalid: false,
    supel: {},
    pelanggans: [],
    supelsearch: "",
    required: [v => !!v || "This Input is required"],
    teleponrule: [
      v => !!v || "This Input is required",
      v => /^[0-9]*$/.test(v) || "Telepon tidak valid"
    ],
    isloading: false
  }),
  methods: {
    //Supel Methods
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
            this.$emit("input", res.data);
            this.pelanggans.push(res.data);
            this.reinitsupel();
            this.modalsupel = false;
            this.message("Save Success", "success");
          })
          .catch(err => {
            this.isloading = false;
            this.message("Save Failed - ERROR: " + err.response.data, "error");
          });
      } else {
        this.$refs.supelform.validate();
        this.message("Save Failed -> Input need to be filled", "error");
      }
    },
    reinitsupel() {
      this.supel = {
        nama: "",
        telepon: ""
      };
      if (this.$refs.supelform) this.$refs.supelform.resetValidation();
    },
    supelcontrol(ev) {
      this.supelsearch = ev;
    },
    filterpelanggan(item, queryText) {
      return (
        item.nama.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) >
          -1 ||
        item.telepon
          .toLocaleLowerCase()
          .indexOf(queryText.toLocaleLowerCase()) > -1
      );
    },
    message(msg, type) {
      this.$store.commit("message", {
        status: true,
        text: msg,
        timeout: 1000,
        type: type
      });
    }
  },
  created() {
    this.reinitsupel();
    this.$api.tandaterima.getPelanggans().then(res => {
      this.pelanggans = res.data;
    });
  },
  computed: {
    data: {
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