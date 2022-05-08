import { createRouter, createWebHistory } from 'vue-router'
import ClientesView from '../views/ClientesView.vue'
import ConfiguracoesView from '../views/ConfiguracoesView.vue'

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
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
