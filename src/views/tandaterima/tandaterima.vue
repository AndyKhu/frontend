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
        <tt-table
          v-model="selected"
          :dataTable="dataTable"
          :headers="headers"
          :isloading="isloading"
          class="tttable"
          @edit="edit"
          @create="create"
          @trash="trash"
          @refresh="refresh"
        >
          <template v-slot:item.status="{item}">
            <v-icon
              dense
              :color="item.status===0?'baretonprogress':item.status===1?'baretfinish':item.status===2?'baretclosed':''"
            >mdi-circle</v-icon>
          </template>
          <template v-slot:item.tanggal="{ item }">
            <span>{{new Date(item.tanggal) | dateFormat('DD.MM.YYYY')}}</span>
          </template>
          <template v-slot:item.statusgaransi="{ item }">
            <v-icon dense>{{item.statusgaransi?'mdi-checkbox-marked-circle':'mdi-close-circle'}}</v-icon>
          </template>
        </tt-table>
      </v-tab-item>
      <v-tab-item key="Form">
        <v-card class="item-container pa-2">
          <v-form v-model="ttvalid" ref="ttform" @submit.prevent="save">
            <v-container>
              <v-row class="px-3 baretcolor--text">
                <v-icon class="mr-2" small color="baretcolor">mdi-account-circle</v-icon>Kasir
              </v-row>
              <v-divider class="my-4" />
              <v-row>
                <v-col cols="12" md="3">
                  <v-combobox
                    v-model="tandaTerima.namapelanggan"
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
                <v-col cols="12" md="3">
                  <v-menu
                    v-model="timemodal"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    disabled
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="new Date(tandaTerima.tanggal) | dateFormat('DD/MM/YYYY') "
                        label="Tanggal"
                        append-icon="mdi-calendar-month"
                        readonly
                        dense
                        v-bind="attrs"
                        v-on="on"
                        outlined
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      disabled
                      v-model="tandaTerima.tanggal"
                      @input="timemodal = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    :items="jenisbarangs"
                    v-model="tandaTerima.jenisbarang"
                    label="Jenis Barang"
                    outlined
                    dense
                    required
                    :rules="required"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="tandaTerima.namabarang"
                    label="Nama Barang"
                    required
                    dense
                    outlined
                    :rules="required"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field dense v-model="tandaTerima.seribarang" label="Seri Barang" outlined></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="tandaTerima.kelengkapan"
                    :items="kelengkapans"
                    multiple
                    label="Kelengkapan"
                    dense
                    outlined
                  />
                  <!-- <v-text-field
                    dense
                    v-model="tandaTerima.kelengkapan"
                    label="Kelengkapan"
                    outlined
                  ></v-text-field>-->
                </v-col>
                <v-col cols="12" md="3">
                  <v-switch
                    v-model="tandaTerima.statusgaransi"
                    color="baretradio"
                    class="mx-2 mt-0"
                    label="Status Garansi"
                  ></v-switch>
                </v-col>
                <v-col cols="12" md="3">
                  <v-switch
                    v-model="tandaTerima.urgent"
                    color="error"
                    class="mx-2 mt-0"
                    label="Urgent"
                  ></v-switch>
                </v-col>
                <v-col class="py-0" cols="12" md="12">
                  <v-textarea
                    rows="3"
                    outlined
                    label="Masalah"
                    v-model="tandaTerima.masalah"
                    required
                    :rules="required"
                  ></v-textarea>
                </v-col>
              </v-row>
              <template v-if="tandaTerima.id">
                <v-row class="px-3 baretcolor--text">
                  <v-icon class="mr-2" small color="baretcolor">mdi-account-cog</v-icon>Teknisi
                </v-row>
                <v-divider class="my-4" />
                <v-row>
                  <v-col cols="12" md="6" class="py-0">
                    <header class="mb-2">Status</header>
                    <v-radio-group v-model="tandaTerima.status" row class="mt-0" @change="resetdetailstatus">
                      <template v-for="item in status">
                        <v-radio
                          :label="item.label"
                          :value="item.value"
                          :color="item.style"
                          :key="item.label"
                        ></v-radio>
                      </template>
                    </v-radio-group>
                    <header class="mb-2" v-if="tandaTerima.status!=2">Status Detail</header>
                    <template v-for="item in status">
                      <v-radio-group
                        v-if="tandaTerima.status === item.value"
                        v-model="tandaTerima.statusdetail"
                        class="mt-0"
                        :key="'head '+item.label"
                        @change="cek"
                      >
                        <v-radio
                          v-for="ikid in item.kid"
                          :key="ikid.label"
                          :color="item.style"
                          :label="ikid.label"
                          :value="ikid.value"
                        ></v-radio>
                      </v-radio-group>
                    </template>
                  </v-col>
                  <v-col col="12" md="6" class="py-0">
                    <v-textarea
                      outlined
                      label="Keterangan Teknisi"
                      v-model="tandaTerima.keteranganteknisi"
                      rows="3"
                    ></v-textarea>
                    <v-text-field
                        v-if="tandaTerima.status === 0 && tandaTerima.statusdetail === 1"
                        :value="confirmdate | dateFormat('DD/MM/YYYY')"
                        label="Tanggal Konfirmasi"
                        append-icon="mdi-calendar-month"
                        readonly
                        dense
                        outlined
                      ></v-text-field>
                  </v-col>
                </v-row>
              </template>
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
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<style lang="scss" src="./tandaterima.scss" scoped></style>
<script src="./tandaterima.js"/>