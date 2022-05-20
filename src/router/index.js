import { createRouter, createWebHistory } from 'vue-router'
import ClientesView from '../views/ClientesView.vue'
import ConfiguracoesView from '../views/ConfiguracoesView.vue'
import DevelopmentView from '../views/DevelopmentView.vue'


const routes = [

  {
    path: '/',
    name: 'clientes',
    component: ClientesView
  },

  {
    path: '/clientes',
    name: 'clientes',
    component: ClientesView
  },

  {
    path: '/configuracoes',
    name: 'configuracoes',
    component: ConfiguracoesView
  },
  {
    path:'/development',
    name:'development',
    component: DevelopmentView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
