<template>
    <v-container>
        <v-row>
            <v-col>
                <img class="mx-auto d-block" :src="logo"/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import logo from '../assets/img-alone.jpg';

export default {
    data() {
        return {
            logo: logo
        }
    },
}
</script>

