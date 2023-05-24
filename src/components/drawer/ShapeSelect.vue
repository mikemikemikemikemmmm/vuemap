<template>
    <section>
        <div>
            <span>直徑</span>
            <input class="kmInput" type="number" :disabled="!props.isActivated" v-model.number="radius" step="0.1" max="3"
                min="0.1">
            <span>公里</span>
        </div>
        <div :style="{ color: hasRadiusError ? 'red' : 'inherit', fontSize: 8 }">
            <div>最大3、最小0.1</div>
            <div>不能含有非數字</div>
        </div>
    </section>
</template>
<script setup lang="ts">
import * as turf from "@turf/turf"
import { useMapStore } from '@/store';
import { reactive, watch, computed, ref } from 'vue';
const props = defineProps<{ isActivated: boolean }>()
const store = useMapStore()
const status = reactive({
    radius: 0.5,
    lon: 1,
    lat: 2
})
const hasRadiusError = ref(false)
const radius = computed({
    get: () => status.radius,
    set: (val) => {
        const test = testRadius(val)
        if (typeof test === 'number') {
            status.radius = test
        }
    }
})
const setCenterCoord = () => {
    if (!store.map) {
        return
    }
    const center = store.map.getCenter()
    status.lon = center.lng as number
    status.lat = center.lat as number
}
const setFeature = () => {
    store.cleanSearchPolygon()
    const feature = turf.circle([status.lon, status.lat], status.radius)
    store.setSearchPolygon(feature)
}
const testRadius = (val: number | string) => {
    const num = typeof val === 'number' ? val : Number(val)
    if (isNaN(num) || num < 0.1) {
        hasRadiusError.value = true
        return false
    } else if (num > 3) {
        hasRadiusError.value = true
        return false
    } else {
        hasRadiusError.value = false
        return num
    }
}
watch(() => props.isActivated, () => {
    if (!store.map) {
        return
    }
    if (!props.isActivated) {
        hasRadiusError.value = false
        store.map.removeEventListener('moveend', setCenterCoord)
        store.map.removeEventListener('zoomend', setCenterCoord)
        return
    }
    store.map.addEventListener('moveend', setCenterCoord)
    store.map.addEventListener('zoomend', setCenterCoord)
    testRadius(status.radius)
    setCenterCoord()
    setFeature()
})
watch(status, () => {
    setFeature()
})
</script>
<style scoped>
.kmInput {
    width: 48px;
}
</style>
