<template>
    <v-container class="border" style="height: 100%; overflow:auto;" fluid>
        <v-row class="bg-info">
            <v-col><h5 class="text-center">Novo Cliente</h5></v-col>
            <v-btn
                icon="mdi-close-box-outline"
                color="error"
                @click="close()"
            ></v-btn>
        </v-row>
        <v-row class="justify-center" style="min-height: 300px; background-color:white;">
            
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

            <v-col cols="12">
                <h3 class="text-center">Escolha uma conta dropbox</h3>
            </v-col>

            <v-col cols="12" lg="3" v-for="token,k in tokens" :key="k">
                <v-card
                    class="mx-auto"
                    @click="selectToken(k)"
                    :style="`cursor:pointer; ${ token.selected ? 'border: 1px solid blue;': '' }`"
                >
                    <v-card-header>
                        <div style="width: 100%;">
                            <div class="text-h6 mb-1">
                            {{ token.email }}
                            </div>
                            <p>Livre: {{ token.livre }} gigas</p>
                            <v-progress-linear
                                :model-value="token.percent"
                                :color="token.color"
                                height="20"
                                striped
                            ></v-progress-linear>
                        </div>
                    </v-card-header>
                </v-card>
            </v-col>

            <v-col v-show="showAddOns" cols="12">
                
                <v-row>
                    <v-col class="mx-auto" cols="12" lg="6">
                        <h5>Total: {{ used }} gigas</h5>
                        <v-slider
                            v-model="percent"
                            track-color="blue"
                        ></v-slider>
                    </v-col>
                    <v-col cols="12">
                        <v-btn 
                        @click="salvar()"
                        class="mx-auto d-block" 
                        color="info">
                            salvar cliente
                        </v-btn>
                    </v-col>
                </v-row>
                
            </v-col>

        </v-row>
    </v-container>
</template>

<script>

export default {

    data() {
        return {
            nome:"",
            slug:"",
            tokens:[],
            lastK:-1,
            showAddOns:false,
            percent:0,
            livre:0,
            used:0,
        }
    },

    created() {
        this.tokens = [];
        this.load_dropbox_tokens()
    },

    methods: {
        close(){
            this.$emit('closeThis')
        },

        async load_dropbox_tokens(){
            
            let resp = await this.$request('admin@config/list_dropbox_tokens');
            if(resp.error) return;
            
            for (let i = 0; i < resp.data.length; i++) {
                
                const element = resp.data[i];
                let limit   = element.limit_size / 1073741824;
                let used    = element.total_used / 1073741824;
                let livre   = Math.floor(limit - used);
                let percent = Math.floor((used * 100) / limit);
                let color   = percent > 75 ? "error" : "light-blue"

                this.tokens.push({
                    token_id: element.token_id,
                    email:    element.email,
                    percent:  percent,
                    livre:    livre,
                    selected: false,
                    color:    color
                })
            }
        },

        selectToken(k){
            if(this.lastK > -1)
                this.tokens[this.lastK].selected = false

            this.lastK = k;
            this.tokens[this.lastK].selected = true
            this.livre = this.tokens[this.lastK].livre
            this.percent = 0
            this.used = 0
            this.showAddOns = true
        },

        async salvar(){
            if(    
                   this.used > 0 
                && this.nome != "" 
                && this.slug != ""
            ){
                
                let token = this.tokens[this.lastK];
                
                let resp = await this.$request('admin@clients/save_client', {
                    token_id: token.token_id,
                    used: this.used * 1073741824,
                    nome: this.nome,
                    slug: this.slug
                })

                if(!resp.error){
                    this.$emit('refresh')
                    this.close()
                }
            }
        }

    },

    watch:{
        percent(value){
            this.used = Math.floor((this.livre * value) / 100)
        },
        nome(value){

            value = value.trim().toLowerCase();
        
            var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
            var to   = "aaaaeeeeiiiioooouuuunc------";
            for (var i=0, l=from.length ; i<l ; i++) 
                value = value.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));

            value = value.replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-'); 
            this.slug = value;
        }
    }
}
</script>