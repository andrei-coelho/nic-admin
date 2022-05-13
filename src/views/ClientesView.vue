<template>
    <div>
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
            />
        </v-dialog>

        <v-container>
            <v-row>
                <v-col>
                    <v-btn 
                        @click="window('ClientNew')"
                    icon>
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>

        <component 
            :is="component"
            :list="list"
            @clickAction="window"
        />

    </div>
</template>

<script>

import LoadComponent from '../components/LoadComponent.vue'
import EmptyList     from '../components/EmptyList.vue'
import ListClients   from './clientes/ListClients.vue';
import ClientConfig  from './clientes/ClientConfig.vue';
import ClientNew     from './clientes/ClientNew.vue';

export default {

    components:{ListClients, LoadComponent, EmptyList,

        ClientConfig, ClientNew
    },

    data() {
        return {
            componentPop:"ClientNew",
            component:"LoadComponent",
            list:[],
            openWindow:false,
            objToSend:{},
        }
    },

    created() {
        this.$emit('active_page', 'clientes')
        this.listar()
    },

    methods: {
        async listar(){
            this.component = "LoadComponent";
            let resp = await this.$request('admin@clients/list_clients')
            if(!resp.error) {
                this.list = resp.data;
                this.component = "ListClients";
            } else {
                this.component = "EmptyList";
            }
        },
        onCloseWindow(){
            this.openWindow = false
        },
        window(componentName, obj = {}){
            this.objToSend = obj
            this.componentPop = componentName
            this.openWindow = true
        },
        refreshList(){
            this.listar()
        }
    },
}
</script>