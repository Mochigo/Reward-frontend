<template></template>
<script setup>
import { useRoute } from 'vue-router';

const route = useRoute()
const applicationId = parseInt(route.params.id)
</script>
