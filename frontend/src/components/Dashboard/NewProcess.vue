<template>
    <v-container>
        <v-row no-gutters class="ml-md-5">
            <v-col cols="1">                
                <v-avatar size="55px"><img src="../../assets/images/NewProcess.png" alt="Avatar para o processo"/></v-avatar>
            </v-col>
            <v-col class="ml-8">
                <h3 style="color: #187653">Registar Novo Processo Equivalência</h3>
                <h5>* Campos de preenchimento obrigatório</h5>
            </v-col>
        </v-row>
        <v-form class="my-12">
            <v-row class="d-none d-sm-flex">
                <v-col cols="6" sm="6">
                    <v-text-field 
                        color="#187653" 
                        placeholder="Identificador do Processo *" 
                        type="text" v-model="student.processo" 
                        class="ml-md-5" 
                        dense 
                        filled 
                        rounded 
                        hide-details
                        clearable
                    />
                </v-col>
                <v-col cols="6" sm="6">
                    <v-text-field 
                        color="#187653" 
                        placeholder="Identificador do Aluno *" 
                        type="text" 
                        v-model="student.idAluno" 
                        class="ml-md-5" 
                        dense 
                        filled 
                        rounded 
                        hide-details 
                        clearable
                    />
                </v-col>
            </v-row>
            <v-text-field 
                color="#187653" 
                placeholder="Identificador do Processo *" 
                type="text" v-model="student.processo" 
                class="ml-md-5 d-flex d-sm-none" 
                dense 
                filled 
                rounded 
                hide-details
                clearable
            />
            <v-text-field 
                color="#187653" 
                placeholder="Identificador do Aluno *" 
                type="text" 
                v-model="student.idAluno" 
                class="ml-md-5 mt-3 d-flex d-sm-none" 
                dense 
                filled 
                rounded 
                hide-details 
                clearable
            />
            <v-text-field
                color="#187653"
                placeholder="Nome Completo do Aluno *" 
                type="text" v-model="student.nomeAluno" 
                class="ml-md-5 mt-3 d-flex d-sm-none" 
                dense 
                filled 
                rounded 
                hide-details
                clearable 
            />
            <v-text-field
                color="#187653"
                placeholder="Nome Completo do Aluno *" 
                type="text" v-model="student.nomeAluno" 
                class="ml-md-5 d-none d-sm-flex" 
                dense 
                filled 
                rounded 
                hide-details
                clearable 
            />
            <v-autocomplete 
                color="#187653" 
                v-model="student.instProv" 
                placeholder="Instituição Proveniente *" 
                type="text" 
                :items="universities" 
                item-text="nomeInstit" 
                @change="universityChosen" 
                class="ml-md-5 mt-3" 
                dense 
                filled 
                rounded 
                hide-details
                clearable
            />
            <v-autocomplete 
                color="#187653" 
                v-if="!course.enableInput && !course.doesntExist" 
                v-model="student.cursoProv" 
                placeholder="Curso Proveniente *" 
                :items="course.courses" 
                item-text="cursoProv" 
                :disabled="course.disableAutocomplete" 
                class="ml-md-5 mt-3" 
                dense 
                filled 
                rounded
                clearable
            />
            <v-text-field color="#187653" v-else-if="course.enableInput || course.doesntExist" placeholder="Curso Proveniente" v-model="student.cursoProv" class="ml-md-5 mt-3" dense filled rounded/>
            <v-row class="text-right d-none d-sm-flex">
                <v-col>
                    <v-switch color="#187653" v-model="course.doesntExist" class="ml-md-5 my-2" label="Curso Inexistente"/>
                </v-col>
                <v-col class="my-2">
                    <v-btn rounded class="ml-5" color="#187653" dark @click="handleSubmit">
                        <div class="text-capitalize mx-1">
                            <strong>Criar Processo</strong>
                        </div>
                    </v-btn>
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn rounded class="ml-5" color="#34ac80" dark fab small v-on="on" @click="resetForm">
                                <v-icon>mdi-delete-empty</v-icon>
                            </v-btn>
                        </template>
                        <span>Limpar Dados</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row class="text-right d-flex d-sm-none">
                <v-col>
                    <v-switch color="#187653" v-model="course.doesntExist" class="ml-md-5 my-2" label ="Curso Inexistente"/>
                </v-col>
                <v-col class="my-2">
                    <v-btn rounded class="ml-5" color="#187653" dark fab small @click="handleSubmit">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    <v-btn rounded class="ml-5" color="#34ac80" dark fab small @click="resetForm">
                        <v-icon>mdi-delete-empty</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>

        <v-dialog v-model="alert.display" retain-focus persistent max-width="350">
            <v-card style="font-family: Rubik, sans-serif;">
                <v-card-title style="font-weight: bold;" class="justify-center">
                    {{alert.title}}
                </v-card-title>
                <v-card-text  class="text-justify">{{alert.message}}</v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn color="#187653" text @click="alert.hideAlert()"><b>Fechar</b></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>

    import Processo from '../../models/processo';
    import UserService from '../../services/user.service';
    import Alert from "../../models/alert";

    export default {
        name: "NewProcess",
        data() {
            return {
                alert: new Alert(0, "", "", {}, false),
                course: {
                    disableAutocomplete: true,
                    doesntExist: false,
                    enableInput: false,
                    courses: []
                },
                universities: null,
                student: new Processo('', '', '', '', '')
            }
        },
        mounted() {
            this.init();

        },
        methods: {
            init() {
                UserService.listUniversities()
                    .then(result => this.universities = result.data)
                    .catch(err => console.log(err));
            },

            handleSubmit(e) {
                e.preventDefault();

                UserService.newProcess(this.student)
                    .then(response => {
                        console.log(response);
                        this.createAlert("Novo Processo Criado",`O Processo ${this.student.processo} foi submetido com sucesso.`);

                        this.$root.$emit('newProcess', response.data);
                        this.resetForm();
                    })
                    .catch(err => {
                        console.log(err.response);
                        this.createAlert("Oops!...","Houve um erro ao criar o Novo Processo. Tente novamente mais tarde, verifique se o Processo já existe ou se todos os campos estão preenchidos.");
                    });
            },
            universityChosen() {
                console.log(`${this.student.instProv}`);

                UserService.getUniversityCourses(this.student.instProv)
                    .then(result => {
                        console.log(result);
                        this.course.courses = result.data;

                        if(this.course.courses.length > 0) {
                            this.course.disableAutocomplete = false;
                        } else {
                            this.course.disableAutocomplete = false;
                            this.course.enableInput = true;
                        }
                    }).catch(err => console.log(err));

            },
            resetForm() {
                this.student = new Processo();
                this.course.courses = [];
                this.course.disableAutocomplete = true;
                this.course.enableInput = false;
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