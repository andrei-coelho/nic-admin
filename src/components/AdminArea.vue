<template>

    <v-container
        class="pa-0 ma-0"
        fill-height
        fluid="true"
    >
        <v-row class="pa-0 ma-0">
            <v-col
                cols="1"
                class=" ma-0 pa-0 d-none d-lg-block"
                style="width: 70px; z-index:100;"
                fixed
            >
               <MainMenuArea :key="atualizarMenu" :pages="pages" @changePageAction="changePageListener"/>
            </v-col>
            <div style="width:140px;" class="d-none d-lg-block"></div>
            

            <v-col
            class="pa-0 ma-0"
            cols="12"
            >
                <v-row class="pa-0 ma-0">
                    <div style="width:70px" class="d-none d-lg-block">
                    </div>
                    <v-col class="pa-0 ma-0">
                        <TopMenuArea :pages="pages" :user="user" @actionCloseApp="closeApp" @changePageActionByTop="changePageByTopListener"/>
                    </v-col>  
                </v-row>
            </v-col>
            
        </v-row>

        <!-- <v-row style="height: 60px;"></v-row> -->

        <v-row >
            <div style="width:70px" class="d-none d-lg-block "></div>
            <v-col class="ps-lg-3">
                <div v-if="showPage">
                    <v-container fuild>
                        <router-view @alert="showAlert" @active_page="onPageLoaded" ></router-view>
                    </v-container>
                </div>
                <div v-else>
                    <LoadComponent/>
                </div>
            </v-col>
        </v-row>

        <v-snackbar
            v-model="snackbarError"
            color="red"
            top="true"
        >
            <span class="text-white">{{ messageError }}</span>
            <template v-slot:actions>
                <v-btn
                color="white"
                variant="text"
                @click="snackbarError = false"
                >
                X
                </v-btn>
            </template>
        </v-snackbar>

        <v-snackbar
            v-model="snackbarSuccess"
            color="green"
            top="true"
        >
            <span class="text-white">{{ messageSuccess }}</span>
            <template v-slot:actions>
                <v-btn
                color="white"
                variant="text"
                @click="snackbarSuccess = false"
                >
                X
                </v-btn>
            </template>
        </v-snackbar>

    </v-container>

</template>

<script>

import MainMenuArea from './MainMenuArea.vue';
import TopMenuArea from './TopMenuArea.vue';
import LoadComponent from './LoadComponent.vue'

export default {
    
    name: 'ClientAdminArea',
    components:{MainMenuArea, TopMenuArea, LoadComponent},
    
    async created(){
        
        this.$set_responses_on_request(this)
        let resp = await this.$request('@auth/load_me');

        if(resp.error){
            this.closeApp()
            return;
        }
        
        this.user = resp.data.user;
        this.showPage = true;

    },
    
    data() {
        return {

            showPage:false,
            user:null,
            pages:[
                {
                    nome:"Clientes",
                    icon:"mdi-hexagon-multiple",
                    slug:"clientes",
                    active:false,
                },
                {
                    nome:"Configurações",
                    icon:"mdi-power",
                    slug:"configuracoes",
                    active:false
                }
            ],
            routesUser: [],
            routeActive: '',

            pageKey:0,
            pageSlug:'',
            subpageSlug:'',

            snackbarError: false,
            messageError:'',

            snackbarSuccess: false,
            messageSuccess:'',
        }
    },

    methods: {

        showApiError(code, message){
            this.messageError = `Erro: ${code} - ${message}`;
            this.snackbarError = true;
        },
        showApiSuccess(message){
            this.messageSuccess = message;
            this.snackbarSuccess = true;    
        },
        closeApp(){
            this.$close_session();
            this.$emit('restartApp');
        },

        onPageLoaded(slug){
            for (let i = 0; i < this.pages.length; i++) {
                this.pages[i].active = this.pages[i].slug == slug;
            }
        },

        showSnackBarMessage(message, type = 'success', code = 404){
            if(type == 'error'){
                this.showApiError(code, message)
            } else {
                this.showApiSuccess(message)
            }
        },

        changePageListener(key){
            if(this.pages && this.pages.length > 0){
                this.subpages = this.pages[key].subpages;
                this.pageSlug = this.pages[key].slug;
            }
        },
        changeSubpageListener(key){
            this.subpageSlug = this.pages[this.pageKey].subpages[key].slug;
            this.routeActive = this.pageSlug+'@'+this.subpageSlug;
        },
        changePageByTopListener(route){
            this.routeActive = route
        }

    },
}
</script>