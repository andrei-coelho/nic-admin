<template>
    <v-container class="border" style="height: 100%; overflow:auto;" fluid>
        <v-row class="bg-info">
            <v-overlay
                v-model="overlay"
            >
            </v-overlay>
            <v-col><h5 class="text-center">Informações do Cliente</h5></v-col>
            <v-btn
                icon="mdi-close-box-outline"
                color="error"
                @click="close()"
            ></v-btn>
        </v-row>
        <v-row style="min-height: 300px; background-color:white;">

            <v-col cols="12">
                <v-row>
                    <v-col cols="12" lg="6" class="mx-auto">
                        <v-form>

                            <v-text-field
                                v-model="nome"
                                label="Nome"
                                required
                            ></v-text-field>

                            <v-text-field
                                v-model="slug"
                                label="Slug"
                                required
                            ></v-text-field>
                            

                        </v-form>
                    </v-col>
                </v-row>
            </v-col>

            <v-col v-show="showInfo" cols="12">
                <v-row>
                    <v-col cols="12" lg="6" class="mx-auto">
                        <v-card-header>
                            <div style="width: 100%;">
                                <p>Espaço Total: {{ total }} gigas</p>
                                <p>Espaço Livre: {{ livre }} gigas</p>
                                <v-progress-linear
                                    :model-value="percent"
                                    :color="color"
                                    height="20"
                                    striped
                                ></v-progress-linear>
                                <v-btn
                                @click="updateInfo = !updateInfo"
                                ><v-icon>mdi-lead-pencil</v-icon></v-btn>
                            </div>
                        </v-card-header>
                    </v-col>
                </v-row>

                <v-row v-show="updateInfo">
                    <v-col cols="12" lg="6" class="mx-auto">
                        <h5>Conta Dropbox: {{ dropbox_acc }}</h5>
                        <h5>Espaço Total: {{ total_dropbox }} gigas</h5>
                        <h5>Espaço Livre: {{ livre_dropbox }} gigas</h5>
                        <v-slider
                            v-model="percentByDropbox"
                            track-color="blue"
                        ></v-slider>
                        
                    </v-col>
                </v-row>
            </v-col>

            <v-col cols="12">
                <v-row>
                    <v-col cols="12" lg="6" class="mx-auto">
                        <v-btn 
                        @click="salvar()"
                        class="mx-auto d-block" 
                        color="info">
                            salvar alterações
                        </v-btn>
                    </v-col>
                </v-row>
            </v-col>

            <v-col cols="12">
                <h5 class="text-center">Status: {{ ativo ? "ativo" : "bloqueado" }}</h5>
                
            </v-col>

            <v-col cols="12">
                        
                <div v-if="ativo">
                    <v-btn 
                        @click="bloquear()"
                        class="mx-auto d-block" 
                        color="error">
                        BLOQUEAR
                    </v-btn>
                </div>

                <div v-else>
                    <v-btn 
                        @click="ativar()"
                        class="mx-auto d-block" 
                        color="success">
                        ATIVAR
                    </v-btn>
                </div>
                <br><br><br><br><br>
                <br><br><br><br><br>
                
            </v-col>

            <v-col cols="12">
                <small class="mx-auto text-center d-block">Para excluir o cliente, digite a slug dele</small>
                <input 
                    v-model="slugDigitado"
                    type="text" 
                    class="border pa-2 mx-auto d-block" 
                    placeholder="slug" 
                />
            </v-col>

            <v-col cols="12">
                <v-btn 
                    class="mx-auto d-block"
                    @click="exluir()"
                    color="error">
                    EXCLUIR CLIENTE
                </v-btn>
            </v-col>

        </v-row>
    </v-container>
</template>

<script>
export default {

    props:{
        objSend:{
            Object,
            require
        }
    },

    data() {
        return {
            overlay:false,
            showInfo: false,
            updateInfo:true,
            ativo:false,
            id:0,
            client: this.objSend,
            nome: '',
            slug: '',
            slugDigitado:'',

            total:0,
            livre:0,

            total_dropbox:0,
            livre_dropbox:0,
            used_dropbox_fixed:0,

            percent:0,
            percentByDropbox:0,
            percentByDropboxMin:0,
            dropbox_acc:'',

            limit_dropbox:0,
            used_dropbox:0,

            limit_user_ini:0,
            limit_user:0,
            used_user:0
        }
    },

    created() {
        this.getInfo()
    },

    mounted() {
        this.nome  = this.objSend.nome
        this.slug  = this.objSend.slug
        this.id    = this.objSend.id
        this.ativo = this.objSend.ativo == 1
    },

    methods: {

        async getInfo(){
            let res1 = await this.$request('admin@clients/get_info',{
                client_id:this.client.id
            })

            if(res1.error) return;
            
            let res2 = await this.$request('admin@config/list_dropbox_tokens',{
                dropbox_tk_id:res1.data.token_id
            });
            
            if(res2.error) return;

            this.used_user  = Math.floor(res1.data.total_used / 1073741824);
            let lim_u = Math.floor(res1.data.max_used / 1073741824);
            this.limit_user = lim_u
            this.limit_user_ini = lim_u
            this.dropbox_acc = res1.data.email;

            this.total_dropbox = Math.floor(res2.data.limit_size / 1073741824);
            
            let used_drop = Math.floor(res2.data.total_used / 1073741824)
            this.used_dropbox  = used_drop
            this.used_dropbox_fixed = used_drop
            this.livre_dropbox = this.total_dropbox - this.used_dropbox
            
            let percentDrop =  (this.used_dropbox * 100) / this.total_dropbox;
            this.percentByDropbox = percentDrop

            this.percentByDropboxMin = this.limit_user 

            this.showInfo = true;

        },

        async exluir(){
            if(this.slugDigitado == this.slug){
                
                this.overlay = true;
                let resp = await this.$request('admin@clients/exluir', {
                    client_id:this.id
                })
                this.overlay = false;
                
                if(!resp.error){
                    this.$emit('refresh')
                    this.close()
                }
            } else {
                console.log(this.slugDigitado);
                console.log(this.slug);
            }
        },

        async bloquear(){
            this.overlay = true;
            let resp = await this.$request('admin@clients/bloquear', {
                client_id:this.id
            })
            this.overlay = false;
            this.ativo = !(!resp.error);
        },

        async ativar(){
            this.overlay = true;
            let resp = await this.$request('admin@clients/ativar', {
                client_id:this.id
            })
            this.overlay = false;
            this.ativo = !resp.error;
        },

        close(){
            this.$emit('closeThis')
        },

        async salvar(){
            
            let resp = await this.$request('admin@clients/update_client', {
                client_id: this.client.id,
                nome: this.nome,
                slug: this.slug,
                size: Math.floor(this.limit_user * 1073741824)
            })

            if(!resp.error){
                this.$emit('refresh')
                this.close()
            }
        }

    },

    watch:{

        used_dropbox(value){

            this.livre_dropbox = Math.floor(this.total_dropbox - value)
            let limt = this.limit_user_ini + ( value - this.used_dropbox_fixed);
            
            if(limt >= 0)
                this.limit_user = limt
        },

        percentByDropbox(value){
            this.used_dropbox = Math.floor((value * this.total_dropbox) / 100);
        },

        limit_user(value){

            let lvr = Math.floor(value - this.used_user);
            if(lvr < 0) return;
            
            this.livre   = lvr;
            this.total   = Math.floor(value);
            this.percent = Math.floor((this.used_user * 100) / value);

        }
    },

}
</script>