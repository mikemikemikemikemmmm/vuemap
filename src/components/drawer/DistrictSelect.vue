<template>
    <section ref="container">
        <div>
            <span>選擇城市</span>
            <select name="targetCitySelect" :disabled="!props.isActivated" v-model="currentCity">
                <option v-for="city in cityData" :value="city" :key="city.name" :selected="city.name === currentCity.name">
                    {{ city.name }}
                </option>
            </select>
        </div>
        <div>
            <span>選擇行政區</span>
            <select name="targetDistrictSelect" :disabled="!props.isActivated" v-model="currentDistrict">
                <option v-for="_district in currentCity.district" :value="_district" :key="_district"
                    :selected="_district === currentDistrict">
                    {{ _district }}
                </option>
            </select>
        </div>
    </section>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { cityData } from '@/const/index'
import { PolygonFeature } from '@/types';

import { useMapStore } from '@/store/index';
import districtGeoJson from "@/data/districtGeoJson.json"
const props = defineProps<{ isActivated: boolean }>()
const container = ref()
const currentCity = ref(cityData[0])
const currentDistrict = ref(currentCity.value.district[0])
watch(currentCity, () => {
    currentDistrict.value = currentCity.value.district[0]
})
watch([currentDistrict, () => props.isActivated], () => {
    if (!props.isActivated) {
        return
    }
    const targetDistrictGeoJson = districtGeoJson.features.find(f => f.properties["T_Name"] === currentDistrict.value)
    const store = useMapStore()
    store.setSearchPolygon(targetDistrictGeoJson as PolygonFeature)
})
</script>
<style scoped></style>
