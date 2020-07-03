import tt_Table from "@/components/table.vue";
export default {
    data: () => ({
        isloading: false,
        //Tabs Variable
        tab: null,
        tabs: [
            { tab: "Table", icon: "mdi-table-large" },
            { tab: "Form", icon: "mdi-file" }
        ],
        //Table Variable
        dataTable: [],
        headers: [
            { text: "Nama Pelanggan", value: "namapelanggan.nama", filterable: true },
            { text: "Telepon", value: "namapelanggan.telepon", filterable: true },
            { text: "Jenis Barang", value: "jenisbarang", filterable: true },
            { text: "Nama Barang", value: "namabarang", filterable: true },
            { text: "Seri Barang", value: "seribarang", filterable: true },
            { text: "Garansi", value: "statusgaransi", filterable: true, align: "center" },
            { text: "Kelengkapan", value: "kelengkapan", filterable: true },
            { text: "Masalah", value: "masalah", filterable: true },
            { text: "Keterarangan teknisi", value: "keteranganteknisi", filterable: true },
            { text: "Tanggal", value: "tanggal", filterable: true },
            { text: "Status", value: "status", sortable: false, align: "center" }
        ],
        selected: [],
        //Form Variable
        kelengkapans: ["Chager", "Kabel Power", "Kabel USB", "Tas", "Kotak"],
        jenisbarangs: ["Laptop", "Komputer", "Printer", "ETC"],
        pelanggans: [],
        tandaTerima: {},
        ttvalid: false,
        timemodal: false,
        status: [
            {
                label: "Dalam Perbaikan", value: 0, style: "baretonprogress", kid: [
                    { label: "CEK", value: 0 },
                    { label: "Konfirmasi", value: 1 },
                    { label: "Perbaikan", value: 2 },
                ]
            },
            {
                label: "Selesai", value: 1, style: "baretfinish", kid: [
                    { label: "Selesai", value: 0 },
                    { label: "Canceled", value: 1 },
                ]
            },
            { label: "Sudah Diambil", style: "baretclosed", value: 2 },
        ],
        //Pelanggan variable
        modalsupel: false,
        supelvalid: false,
        supel: {},
        supelsearch: '',
        //form validate
        required: [v => !!v || "This Input is required"],
        teleponrule: [v => !!v || "This Input is required", v => /^[0-9]*$/.test(v) || "Telepon tidak valid"],
    }),
    methods: {
        //Table Methods
        create() {
            this.reinit();
            this.tab = 1;
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
                    this.formreinit();
                    this.message("Delete Success", "success")
                    this.selected = [];
                })
                .catch(err => {
                    this.isloading = false;
                    this.message("Delete Failed , Error: ".concat(err.response.data,), "error")
                });
        },
        cetak(value) {
            this.$api.tandaterima.cetak(value.id)
        },
        //Form Methods
        cancel() {
            this.reinit();
            this.tab = 0;
        },
        update() {
            this.$api.tandaterima
                .update(this.tandaTerima)
                .then(() => {
                    this.formreinit()
                    this.message("Update Success", "success")
                })
                .catch(err => {
                    this.isloading = false;
                    this.message("Save Failed - ERROR: " + err.response.data, "error")
                });
        },
        save() {
            if (this.ttvalid) {
                this.isloading = true;
                if (this.tandaTerima.id) {
                    this.update()
                } else {
                    this.$api.tandaterima
                        .save(this.tandaTerima)
                        .then(() => {
                            this.formreinit()
                            this.message("Save Success", "success")
                        })
                        .catch(err => {
                            this.isloading = false;
                            this.message("Save Failed - ERROR: " + err.response.data, "error")
                        });
                }
            } else {
                this.isloading = false;
                this.$refs.ttform.validate();
                this.message("Save Failed Input need to be filled", "error")
            }
        },
        formreinit() {
            this.isloading = false;
            this.refresh();
            this.reinit();
            this.tab = 0;
        },
        reinit() {
            this.tandaTerima = {
                namapelanggan: "",
                jenisbarang: "",
                namabarang: "",
                seribarang: "",
                statusgaransi: false,
                urgent: false,
                kelengkapan: "",
                masalah: "",
                keteranganteknisi: "",
                tanggal: new Date().toISOString().substr(0, 10),
                tanggalkonfirmasi: null
            };
            if (this.$refs.ttform) this.$refs.ttform.resetValidation();
            this.reinitsupel();
        },
        supelcontrol(ev) {
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
        },
        cek(event){
            if(this.tandaTerima.status === 0 && event === 1){
                this.tandaTerima.tanggalkonfirmasi = new Date()
            }
        },
        resetdetailstatus(){
            this.tandaTerima.tanggalkonfirmasi = null
            this.tandaTerima.statusdetail = 0
        },
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
                        this.tandaTerima.namapelanggan = res.data
                        this.pelanggans.push(res.data);
                        this.reinitsupel();
                        this.modalsupel = false;
                        this.message("Save Success", "success")
                    })
                    .catch(err => {
                        this.isloading = false;
                        this.message("Save Failed - ERROR: " + err.response.data, "error")
                    });
            } else {
                this.$refs.supelform.validate()
                this.message("Save Failed -> Input need to be filled", "error")
            }
        },
        reinitsupel() {
            this.supel = {
                nama: "",
                telepon: ""
            };
            if (this.$refs.supelform) this.$refs.supelform.resetValidation();
        },
        //Global Methods
        message(msg, type) {
            this.$store.commit("message", {
                status: true,
                text: msg,
                timeout: 1000,
                type: type
            });
        },
        refresh() {
            this.$api.tandaterima.getDataALL().then(res => {
                this.dataTable = res.data;
            });
        }
    },
    created() {
        this.refresh();
        this.$api.tandaterima.getPelanggans().then(res => {
            this.pelanggans = res.data;
        });
        this.reinit();
    },
    computed: {
        confirmdate(){
            return this.tandaTerima.tanggalkonfirmasi?new Date(this.tandaTerima.tanggalkonfirmasi):new Date()
        }
    },
    components: {
        'tt-table': tt_Table
    }
}