<template>
  <MapContainer />
  <!-- <DialogContainer /> -->
  <HamburgerBtn />
  <Drawer />
</template>

<script setup lang="ts">
import '@/assets/reset.css'
// import DialogContainer from '@/components/dialogContainer.vue'
import HamburgerBtn from '@/components/hamburgerBtn.vue'
import Drawer from '@/components/drawer/index.vue'
import MapContainer from './components/mapContainer.vue'
</script>
<style>
* {
  box-sizing: border-box;
}

button:hover {
  cursor: pointer;
}
</style>