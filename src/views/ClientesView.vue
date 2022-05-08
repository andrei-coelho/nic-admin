<template>
    <div>Clientes</div>
</template>

<script>
export default {
    created() {
        this.$emit('active_page', 'clientes')
    },
}
</script>