<template>
    <div>development</div>
</template>

<script>
export default {
    created() {
        console.log("DEVELOPMENT");
        this.$emit('active_page', 'development')
    },
}
</script>