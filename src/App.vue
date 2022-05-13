<template>
    <v-app>
        <component 
        :is="component"
        @restartApp="onRestart"
        ></component>
    </v-app>
</template>

<script>

import AuthArea from './components/AuthArea.vue'
import AdminArea from './components/AdminArea.vue'
import LoadingPage from './components/LoadingPage.vue'

export default {
    name: 'App',

    created() {
        this.start_app()
    },

    components:{AuthArea, AdminArea, LoadingPage},
    
    data() {
        return {
            component:'LoadingPage'
        }
    },
    methods: {

        async start_app(){
            if(this.$has_session()){
                let status = await this.$request('@auth/refresh_user_admin');
                this.component = !status.error ? 'AdminArea' : 'AuthArea';
            } else {
                this.component = 'AuthArea'
            }
        },

        onRestart(){
            location.reload();
            return false;
        }
    },
}
</script>