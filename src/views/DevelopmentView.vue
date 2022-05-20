<template>
    <div>development</div>
</template>

<script>
export default {
    created() {
        this.$emit('active_page', 'development')
    },
}
</script>