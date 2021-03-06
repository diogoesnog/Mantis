<template>
    <v-container>
        <div v-if="files.length > 0">
            <div class="text-center align-self-center my-5">
                <span style="color:#187653; font-weight: bold">
                    Gerar Novo Documento do Processo
                </span>
                <v-btn
                    class="mx-2"
                    fab
                    small
                    rounded
                    color="#187653"
                    dark
                    @click="generatePdf"
                >
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </div>
            <v-card class="my-5">
                <v-list two-line >
                    <template v-for="(file, index) in visibleFiles">
                        <v-list-item
                            class="d-none d-sm-flex"
                            :key="file.filename" 
                            @click="downloadFile(file)"
                        >
                            <v-list-item-avatar>
                                <v-icon>mdi-file-pdf</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>

                                <v-list-item-subtitle>
                                    <span style="font-weight: bold">Data e Hora de Criação: </span>
                                    {{ file.generatedAt | moment('DD/MM/YYYY, HH:mm')}}
                                </v-list-item-subtitle>
                                <v-list-item-subtitle>
                                    <span 
                                        style="font-weight: bold"
                                    >
                                        Utilizador Responsável:
                                    </span>
                                    {{ file.generatedBy }}
                                </v-list-item-subtitle>

                            </v-list-item-content>

                            <div 
                                class="text-right align-self-center"
                            >
                                <span
                                    style="color:#187653; font-weight: bold"
                                >
                                    Download
                                </span>
                                <v-list-item-avatar>
                                    <v-icon color="#187653">mdi-download</v-icon>
                                </v-list-item-avatar>
                            </div>
                        </v-list-item>

                        <v-list-item
                            class="d-flex d-sm-none"
                            :key="file.filename" 
                            @click="downloadFile(file)"
                        >
                            <v-list-item-avatar>
                                <v-icon>mdi-file-pdf</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-subtitle>
                                    <span style="font-weight: bold">Data e Hora: </span>
                                    {{ file.generatedAt | moment('DD/MM/YYYY, HH:mm')}}
                                </v-list-item-subtitle>
                                <v-list-item-subtitle>
                                    <span 
                                        style="font-weight: bold"
                                    >
                                        Utilizador:
                                    </span>
                                    {{ file.generatedBy }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <div
                                class="text-right align-self-center"
                            >
                                <v-list-item-avatar>
                                    <v-icon color="#187653">mdi-download</v-icon>
                                </v-list-item-avatar>
                            </div>
                        </v-list-item>
                        <v-divider :key="index"></v-divider>
                    </template>
                </v-list>
            </v-card>
            <div class="my-5 text-center pt-2">
                <v-pagination
                    color="#187653" 
                    v-model="page"
                    :length="Math.ceil(files.length/itemsPerPage)"
                    circle
                ></v-pagination>
            </div>
        </div>
        <div v-else>
            <div class="text-center align-self-center my-5">
                <span>
                    Não existem Documentos para o Processo
                </span>
                <p/>
                <p style="color:#187653; font-weight: bold">
                    Gerar Novo Documento do Processo
                </p>
                <v-btn
                    class="mx-2"
                    fab
                    small
                    rounded
                    color="#187653"
                    dark
                    @click="generatePdf"
                >
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </div>
        </div>

        <v-dialog v-model="alert.display" retain-focus persistent max-width="350">
            <v-card style="font-family: Rubik, sans-serif;">
                <v-card-title style="font-weight: bold;" class="justify-center">
                    {{alert.title}}
                </v-card-title>
                <v-card-text class="text-justify">{{alert.message}}</v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn color="#187653" text @click="alert.hideAlert()"><b>Fechar</b></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
    import UserService from '../../services/user.service';
    import Alert from "../../models/alert";

    export default {
        name: "ProcessFiles",
        data() {
            return {
                alert: new Alert(0, "", "", {}, false),

                page: 1,
                itemsPerPage: 5,
                files: [],
                url: process.env.VUE_APP_API_SERVER,
                processId: this.$route.params.id
            }
        },
        mounted() {
            this.getFiles();
        },
        computed: {
            visibleFiles () {
                return this.files.slice((this.page - 1)* this.itemsPerPage, this.page* this.itemsPerPage)
            }
        },
        methods: {
            generatePdf() {
                UserService.generatePdf( this.processId )
                    .then(response => {
                        this.files.push(response.data.file);
                    })
                    .catch(err => {
                        this.createAlert("Oops!...", "Não foi possível gerar a documentação para o processo.");
                        console.log(err.response)
                    });
            },

            getFiles() {
                UserService.getProcessFiles( this.processId )
                    .then(response => this.files.push(...response.data))
                    .catch(err => {
                        // let { title, message } = err.data;
                        console.log(err.response)
                    });
            },

            downloadFile(file) {
                console.log("downloadFile");
                UserService.downloadFile(this.processId, file.filename)
                    .then(response => {
                        let blob = new Blob([response.data], { type:   'application/pdf' } );
                        let link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = `${file.filename}.pdf`;
                        link.click();
                    })
                    .catch(err => {
                        let status = err.response.status;
                        console.log(status);

                        this.createAlert("Oops!...", "Houve um problema ao descarregar o ficheiro e/ou o ficheiro não existe. Por favor, tente novamente mais tarde.");

                    });
            },

            createAlert(title, message) {
                this.alert.setTitle(title);
                this.alert.setMessage(message);

                this.alert.displayAlert();
            }
        }
    }
</script>

<style scoped>

</style>