<template>
    <v-container class="border" style="height: 100%; overflow:auto;" fluid>
        <v-row class="bg-info">
            <v-col><h5 class="text-center">Editar Dropbox Account</h5></v-col>
            <v-btn
                icon="mdi-close-box-outline"
                color="error"
                @click="close()"
            ></v-btn>
        </v-row>
        <v-row class="justify-center" style="min-height: 300px; background-color:white;">
            <v-col cols="12" lg="6">
                <small>Conta:</small>
                <h4>{{ drop.email }}</h4>
                <v-form>
                    <v-text-field
                        v-model="limiteAtual"
                        label="Espaço em Gigas"
                        required
                    ></v-text-field>
                </v-form>
            </v-col>
            <v-col cols="12">
                <v-btn 
                    color="info"
                    class="mx-auto d-block"
                    @click="salvar()">
                    salvar alterações
                </v-btn>
            </v-col>
            <v-col cols="12">
                <v-btn 
                    color="error"
                    @click="excluir()"
                    icon="mdi-delete-forever">
                    
                </v-btn>
                
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {

    props:{
        objSend: Object
    },

    data() {
        return {
            limiteAtual: Math.floor(this.objSend.limit_size / 1073741824),
            drop: this.objSend
        }
    },

    methods: {
        close(){
            this.$emit('closeThis')
        },

        async salvar(){
            await this.$request('admin@config/editar_espaco', {
                dropbox_tk_id: this.drop.token_id,
                espaco: Math.floor(this.limiteAtual * 1073741824)
            })
            this.$emit('refresh');
            this.close();
        },

        async excluir(){
            await this.$request('admin@config/excluir_dropbox_token', {
                dropbox_tk_id: this.drop.token_id
            })
            this.$emit('refresh');
            this.close();
        }
    },

}
</script>