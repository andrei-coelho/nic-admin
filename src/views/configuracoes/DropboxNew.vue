<template>
    <v-container class="border" style="height: 100%; overflow:auto;" fluid>
        <v-row class="bg-info">
            <v-col><h5 class="text-center">Nova Conta DropBox</h5></v-col>
            <v-btn
                icon="mdi-close-box-outline"
                color="error"
                @click="close()"
            ></v-btn>
        </v-row>
        <v-row class="justify-center" style="min-height: 300px; background-color:white;">
            <v-col cols="12" lg="6">
                 <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                    <v-text-field
                        v-model="email"
                        label="E-mail"
                        required
                    ></v-text-field>

                    <v-text-field
                        v-model="senha"
                        label="senha (opicional)"
                    ></v-text-field>

                    <v-text-field
                        v-model="appKey"
                        label="App Key"
                        required
                    ></v-text-field>
                    
                    <v-text-field
                        v-model="appSecret"
                        label="App Secret"
                        required
                    ></v-text-field>

                    <h5>{{ link }}</h5>

                    <v-text-field
                        v-model="refreshToken"
                        label="Refresh Token"
                        required
                    ></v-text-field>

                    <v-text-field
                        v-model="espaceGigas"
                        label="Espaço em Gigas"
                        required
                    ></v-text-field>

                    <v-btn
                        color="primary"
                        @click="salvar()"
                    >SALVAR</v-btn>

                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    
    data() {
        return {
            email:'',
            senha:'',
            appKey:'',
            appSecret:'',
            refreshToken:'',
            link:'',
            espaceGigas:0,
        }
    },
    
    methods: {
        close(){
            this.$emit('closeThis')
        },

        async salvar(){

            if(this.email == "" || this.appKey == "" || this.appSecret == ""
                || this.refreshToken == "" || this.espaceGigas == 0) return;

            let resp = await this.$request('admin@config/salvar_dropbox_token', {
                email:  this.email,
                senha:  this.senha,
                key:    this.appKey,
                secret: this.appSecret,
                token:  this.refreshToken,
                espaco: this.espaceGigas * 1073741824
            });

            if(!resp.error){
                this.$emit('refresh');
                this.close();
            }

        },
    },

    watch:{

        appKey(value){
            value = value.trim();
            this.appKey = value;
            if(value !== ""){
                this.link = `https://www.dropbox.com/oauth2/authorize?client_id=${this.appKey}&response_type=code&token_access_type=offline`
            } else {
                this.link = '';
            }
        },

        appSecret(value){
            value = value.trim();
            this.appSecret = value;
        }
    }
}
</script>