<template>
    <v-container class="border" style="height: 100%;" fluid>
        <v-row class="bg-info">
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
            showInfo: false,
            updateInfo:true,
            client: this.objSend,
            nome: '',
            slug: '',

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
        this.nome = this.objSend.nome
        this.slug = this.objSend.slug
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
            this.percentByDropboxMin = percentDrop

            this.showInfo = true;

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
            this.limit_user = this.limit_user_ini + ( value - this.used_dropbox_fixed)
        },

        percentByDropbox(value){
            if(value < this.percentByDropboxMin){
                this.percentByDropbox = this.percentByDropboxMin
                return
            }
            this.used_dropbox = Math.floor((value * this.total_dropbox) / 100);
        },

        limit_user(value){
            if(value < this.used_user) return;
            this.total   = Math.floor(value);
            this.livre   = Math.floor(value - this.used_user);
            this.percent = Math.floor((this.used_user * 100) / value);
        }
    },

}
</script>