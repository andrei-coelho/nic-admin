<template>
    
    <v-container fluid>

        <v-row>

            <v-col cols="12" md="4" lg="3" v-for="client, k in list_clients" :key="k">
                <v-card>
                    <v-card-title class="text-h5">
                        {{ client.nome }}
                    </v-card-title>

                    <v-card-subtitle>{{ client.slug }}</v-card-subtitle>

                    <v-card-actions>
                        <v-btn
                            icon="mdi-image-filter-vintage"
                            color="primary"
                            @click="clickOption('ClientConfig', k)"
                        ></v-btn>
                        <v-col class="text-right">
                            <v-btn
                                class="float-end"
                                icon="mdi-ghost"
                                color="primary"
                                @click="createGhost(k)"
                            ></v-btn>
                        </v-col>
                        
                    </v-card-actions>
                </v-card>
            </v-col>

        </v-row>

    </v-container>

</template>

<script>
export default {
    
    props:{
        list:{
            Array
        }
    },

    data() {
        return {
            list_clients: this.list
        }
    },

    methods: {
        clickOption(option, key){
            this.$emit('clickAction', option, this.list_clients[key])
        },
        createGhost(key){
            let client = this.list_clients[key];
            console.log(client);
            // abrir
        }
    },
}
</script>