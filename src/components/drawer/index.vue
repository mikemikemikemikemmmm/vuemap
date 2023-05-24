<template>
    <div style="padding: 16px;" class="drawer" @dblclick="stopZoom" :class="{ show: store.isShowDrawer }">
        <div class="closeBtnContainer">
            <button class="closeBtn" @click="clickCloseBtn">X</button>
        </div>
        <div class="selectArea">
            <input type="radio" id="none" @click="e => handleClickActivated(e, 'none')"
                :checked="currentActivated === 'none'">
            <label for="none">不篩選</label>
        </div>
        <div class="selectArea">
            <div>
                <input type="radio" id="district" @click="e => handleClickActivated(e, 'district')"
                    :checked="currentActivated === 'district'">
                <label for="district">用市區篩選</label>
            </div>
            <div class="selectComponentContainer">
                <DistrictSelect :is-activated="currentActivated === 'district'" />
            </div>
        </div>
        <div class="selectArea">
            <div>
                <input type="radio" id="mrt" @click="e => handleClickActivated(e, 'mrt')"
                    :checked="currentActivated === 'mrt'">
                <label for="mrt">用捷運篩選</label>
            </div>
            <div class="selectComponentContainer">
                <MrtSelect :is-activated="currentActivated === 'mrt'" />
            </div>

        </div>
        <div class="selectArea">
            <div>
                <input type="radio" id="shape" @click="e => handleClickActivated(e, 'shape')"
                    :checked="currentActivated === 'shape'">
                <label for="shape">用圓形篩選</label>
            </div>
            <div class="selectComponentContainer">
                <ShapeSelect :is-activated="currentActivated === 'shape'" />
            </div>

        </div>
        <div class="selectArea searchBtnContainer">
            <button @click="handleSearch">送出</button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import * as  geojson from 'geojson';
import DistrictSelect from './DistrictSelect.vue';
import MrtSelect from './MrtSelect.vue';
import ShapeSelect from './ShapeSelect.vue';
import { PolygonFeature, PointFeature } from '@/types';
import { useMapStore } from '@/store';
import fakeFeatures from '@/data/fakeFeatures.json'
import * as  turf from '@turf/turf'
type ActivatedType = 'none' | 'mrt' | 'district' | 'shape'
const store = useMapStore()
const currentActivated = ref<ActivatedType>('none')
watch(() => store.isShowDrawer, () => {
    currentActivated.value = 'none'
})
const stopZoom = (e: MouseEvent) => {
    e.stopPropagation();
}
const clickCloseBtn = () => {
    store.setIsShowDrawer(false)
    store.cleanSearchPolygon()

}
const handleSearch = () => {
    if (currentActivated.value === 'none') {
        const features = fakeFeatures.features as PointFeature[]
        store.setFilteredFeatures(features)
        store.cleanSearchPolygon()
        return
    }
    if (!store.searchPolygon) {
        return
    }
    const geojson = store.searchPolygon.toGeoJSON() as geojson.FeatureCollection<geojson.GeometryObject, any>
    const polygon = geojson.features[0] as PolygonFeature
    const filtered = (fakeFeatures.features as PointFeature[]).filter(f => turf.booleanPointInPolygon(f.geometry.coordinates, polygon))
    store.setFilteredFeatures(filtered)
}
const handleClickActivated = (e: Event, type: ActivatedType) => {
    e.stopPropagation()
    if (currentActivated.value !== type) {
        store.cleanSearchPolygon()
        currentActivated.value = type
    } else if (currentActivated.value === 'none') {
        store.cleanSearchPolygon()

    }
}
</script>
<style lang="scss" scoped>
.drawer {
    position: absolute;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1001;
    background: white;
    overflow-x: scroll;
    display: none;

    &.show {
        display: block;
    }

    label:hover {
        cursor: pointer;
    }

    .closeBtnContainer {
        text-align: right;
    }

    .selectArea {
        padding: 8px 0;

        input[type=radio] {
            margin: 4px;
            padding: 0;
            width: 14px;
            height: 14px;
        }

        .selectComponentContainer {
            padding-left: 22px;
        }

        &.searchBtnContainer {
            text-align: center;
        }

    }
}
</style>