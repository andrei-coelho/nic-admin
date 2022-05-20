<template>
    <v-container>
        
        <v-dialog
            v-model="openWindow"
            fullscreen
            style="z-index: 999999999;"
            >   
            <component 
                :is="componentPop"
                :objSend="objToSend"
                @refresh="refreshList"
                @closeThis="onCloseWindow"
                :key="atualizar"
            />
        </v-dialog>
        
        <v-row>
            <v-col>
                <v-btn 
                    @click="window('DropboxNew')"
                    icon>
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        
        <component 
            :is="component"
            :lista="list"
            @clickAction="window"
        />

    </v-container>
</template>

<script>

import ListDropbox   from './configuracoes/ListDropbox.vue'
import DropboxEdit   from './configuracoes/DropboxEdit.vue'
import DropboxNew    from './configuracoes/DropboxNew.vue'
import LoadComponent from '../components/LoadComponent.vue'

export default {

    data() {
        return {
            atualizar:0,
            componentPop: "",
            component:"LoadComponent",
            list:[],
            openWindow:false,
            objToSend:{},
        }
    },

    components:{ ListDropbox, LoadComponent, DropboxNew, DropboxEdit },

    created() {
        this.$emit('active_page', 'configuracoes')
        this.listar()
    },

    methods: {

        onCloseWindow(){
            this.openWindow = false
        },
        
        window(componentName, obj = {}){
            this.atualizar++;
            this.objToSend = obj
            this.componentPop = componentName
            this.openWindow = true
        },

        async listar(){
            this.component = "LoadComponent"
            let resp = await this.$request('admin@config/list_dropbox_tokens');
            if(!resp.error){
                this.list = resp.data
            }
            this.component = "ListDropbox"
        },
        
        refreshList(){
            this.listar()
        }
    },
}
</script>