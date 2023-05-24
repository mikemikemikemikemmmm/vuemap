<template>
    <section class="dialogContainer">
        <li class="dialog" v-for="dialog in store.dialogList">
            <span :style="{ color: dialog.type === 'error' ? 'red' : 'green' }">{{ dialog.messenge }}</span>
        </li>
    </section>
</template>
<script lang="ts" setup>
import { useMapStore } from '@/store';
const store = useMapStore()
</script>
<style scoped>
.dialogContainer {
    position: absolute;
    right: 30px;
    bottom: 0;
    z-index: 1001;
}

.dialog {
    background-color: #fff;
    margin: 8px 0;
    list-style: none;
}
</style>