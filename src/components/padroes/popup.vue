<template>
    <v-container class="border" style="height: 100%; overflow:auto;" fluid>
        <v-row class="bg-info">
            <v-col><h5 class="text-center">Nome</h5></v-col>
            <v-btn
                icon="mdi-close-box-outline"
                color="error"
                @click="close()"
            ></v-btn>
        </v-row>
        <v-row style="min-height: 300px; background-color:white;">

        </v-row>
    </v-container>
</template>

<script>
export default {
    methods: {
        close(){
            this.$emit('closeThis')
        }
    },
}
</script>