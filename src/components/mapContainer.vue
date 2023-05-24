<template>
    <div id="mapContainer"></div>
</template>
  
<script setup lang="ts">
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { onMounted } from "vue";
import { useMapStore } from "@/store/index";

onMounted(() => {
    const map = L.map('mapContainer', {
        center: [23.611, 120.768],
        zoom: 8,
        zoomAnimation: false
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    const store = useMapStore()
    store.setMap(map)
});
</script>
<style>
#mapContainer {
    height: 100vh;
    width: 100vw;
}

.leaflet-control-zoom {
    top: 40px;
}
</style>