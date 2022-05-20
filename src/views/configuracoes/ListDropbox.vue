<template>
    <v-row>
        
        <v-overlay
            v-model="overlay"
        >
        </v-overlay>
        
        <v-col cols="12">
            <h1>Lista de Contas do Dropbox</h1>
        </v-col>

        <v-col cols="12" md="4" lg="3"  v-for="drop, k in list" :key="k">
            <v-card>

                <v-card-title class="text-h5 text-truncate">
                    <small>{{ drop.email }}</small>
                </v-card-title>

                <v-card-subtitle>
                    <p class="w-100">Livre: {{ Math.floor((drop.limit_size - drop.total_used) / 1073741824) }} gigas</p>
                    <v-progress-linear
                        :model-value="Math.floor((100 * drop.total_used) / drop.limit_size)"
                        color="blue"
                        height="20"
                        striped
                    ></v-progress-linear>
                </v-card-subtitle>

                <v-card-actions>
                    <v-btn
                        icon="mdi-pencil"
                        color="primary"
                        @click="clickEdit(k)"
                    ></v-btn>
                </v-card-actions>
            </v-card>
        </v-col>

    </v-row>
</template>

<script>
export default {

    props:{
        lista:{
            Array
        }
    },

    data() {
        return {
            overlay:false,
            list:this.lista
        }
    },

    methods: {
        clickEdit(k){
            this.$emit('clickAction', 'DropboxEdit', this.list[k])
        }
    },
}
</script>