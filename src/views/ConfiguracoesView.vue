<template>
    <div>Configurações</div>
</template>

<script>
export default {
    created() {
        this.$emit('active_page', 'configuracoes')
    },
}
</script>