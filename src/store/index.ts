import { defineStore } from 'pinia'
import L from 'leaflet'
import { Feature, Point, Polygon } from 'geojson'
interface Dialog {
    type: 'error' | 'success',
    messenge: string
}
interface State {
    map?: L.Map,
    searchPolygon?: L.GeoJSON,
    filteredFeaturesGroup?: L.FeatureGroup,
    isShowDrawer: boolean
    dialogList: Dialog[]
}
export const useMapStore = defineStore('map', {
    state: () => {
        return {
            map: undefined,
            searchPolygon: undefined,
            filteredFeaturesGroup: undefined,
            isShowDrawer: false,
            dialogList: []
        } as State
    },
    actions: {
        setIsShowDrawer(val: boolean) {
            if (this.isShowDrawer === val) {
                return
            }
            this.isShowDrawer = val
        },
        setMap(map: L.Map) {
            this.map = map
        },
        setSearchPolygon(polygon: Feature<Polygon>) {
            this.cleanSearchPolygon()
            const map = this.map as L.Map
            const feature = L.geoJson(polygon, {
                style: {
                    color: 'blue',
                    weight: 5,
                    opacity: 1,
                    fill: false
                }
            }).addTo(map)
            this.searchPolygon = feature
        },
        cleanSearchPolygon() {
            if (!this.searchPolygon) {
                return
            }
            this.searchPolygon.remove()
            this.searchPolygon = undefined
        },
        setFilteredFeatures(features: Feature<Point>[]) {
            this.cleanFilteredFeatures()
            this.filteredFeaturesGroup = new L.FeatureGroup()
            this.filteredFeaturesGroup.addTo(this.map as L.Map)
            features.forEach(f => {
                const [lon, lat] = f.geometry.coordinates
                L.marker([lat, lon])
                    .bindPopup(`${lat},${lon}`)
                    .addTo(this.filteredFeaturesGroup as L.FeatureGroup)
            })
        },
        cleanFilteredFeatures() {
            if (!this.filteredFeaturesGroup) {
                return
            }
            this.filteredFeaturesGroup.remove()
            this.filteredFeaturesGroup = undefined
        },
        pushDialog(dialog: Dialog) {
            console.log('push', dialog)
            this.dialogList.push(dialog)
            setTimeout(this.deleteDialog, 3000)
        },
        deleteDialog() {
            console.log('del', this.dialogList)

            if (this.dialogList.length === 0) {
                return
            }
            this.dialogList.shift()
        }
    },
})