<template>
    <section>
        <div>
            <span>選擇線段</span>
            <select name="mrtLine" v-model="mrtLine" :disabled="!props.isActivated">
                <option v-for="line in MrtData" :value="line" :key="line.line" :selected="line.line === mrtLine.line">
                    {{ line.line }}
                </option>
            </select>
        </div>
        <div>
            <span>選擇起點</span>
            <select name="targetDistrictSelect" :disabled="!props.isActivated" v-model="status.startIndex">
                <option v-for="station, index in mrtLine.stations" :value="index" :key="station.name"
                    :selected="station.name === mrtLine.stations[status.startIndex].name">
                    {{ station.name }}
                </option>
            </select>
        </div>
        <div>
            <span>選擇終點</span>
            <select name="targetDistrictSelect" :disabled="!props.isActivated" v-model="status.endIndex">
                <option v-for="station, index in mrtLine.stations" :value="index" :key="station.name"
                    :selected="station.name === mrtLine.stations[status.endIndex].name">
                    {{ station.name }}
                </option>
            </select>
        </div>
        <div>
            <span>直徑</span>
            <input class="kmInput" type="number" :disabled="!props.isActivated" v-model.number="radius" step="0.1" min="0.1"
                max="1">
            <span>公里</span>
            <div :style="{ color: hasRadiusError ? 'red' : 'inherit', fontSize: 8 }">
                <div>最大1、最小0.1</div>
                <div>不能含有非數字</div>
            </div>
        </div>
    </section>
</template>
<script setup lang="ts">
import { ref, watch, reactive, computed, toRaw } from 'vue';
import MrtData from '@/data/mrt.json'
import * as turf from "@turf/turf"
import { useMapStore } from '@/store';
const props = defineProps<{ isActivated: boolean }>()
const mrtLine = ref(MrtData[0])
const status = reactive({
    startIndex: 0,
    endIndex: 1,
    radius: 0.1
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
const testRadius = (val: number | string) => {
    const num = typeof val === 'number' ? val : Number(val)
    if (isNaN(num) || num < 0.1) {
        hasRadiusError.value = true
        return false
    } else if (num > 1) {
        hasRadiusError.value = true
        return false
    } else {
        hasRadiusError.value = false
        return num
    }
}
const isSameStation = () => status.startIndex === status.endIndex
const getStationsLineBuffer = () => {
    const min = Math.min(status.startIndex, status.endIndex)
    const max = Math.max(status.startIndex, status.endIndex)
    if (isSameStation()) {
        const target = mrtLine.value.stations[min]
        const point = turf.point([target.lon, target.lat]);
        const buffer = turf.buffer(point, status.radius);
        const store = useMapStore()
        store.setSearchPolygon(buffer)
        return
    }
    const stationsArr = []
    for (let i = min; i <= max; i++) {
        const target = mrtLine.value.stations[i]
        stationsArr.push([target.lon, target.lat])
    }
    const lineString = turf.lineString(stationsArr);
    const buffer = turf.buffer(lineString, status.radius);
    const store = useMapStore()
    store.setSearchPolygon(buffer)
}
watch(mrtLine, () => {
    status.startIndex = 0
    status.endIndex = 0
    getStationsLineBuffer()
})
watch(status, () => {
    getStationsLineBuffer()
})
watch(() => props.isActivated, () => {
    if (props.isActivated) {
        testRadius(status.radius)
        getStationsLineBuffer()
    } else {
        hasRadiusError.value = false
    }
})
</script>
<style scoped>
.kmInput {
    width: 64px;
}
</style>
