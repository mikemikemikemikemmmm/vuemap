<template>
    <button class="hamburgerBtn" @click="() => clickMenuBtn()">
        <div>---</div>
        <div>---</div>
        <div>---</div>
    </button>
</template>
<script setup lang="ts">
import { useMapStore } from '@/store';
const store = useMapStore()
const clickMenuBtn = () => {
    store.setIsShowDrawer(true)
}
</script>
<style lang="scss" scoped>
.hamburgerBtn {
    width: 34px;
    line-height: 5px;
    height: 34px;
    background-color: #fff;
    box-sizing: border-box;
    border: 2px solid;
    border-color: rgba(0, 0, 0, 0.2);
    background-clip: padding-box;
    color: black;
    cursor: pointer;
    z-index: 1000;
    position: absolute;
    left: 10px;
    top: 10px;
    outline: none;
    border-radius: 4px;
}
</style>