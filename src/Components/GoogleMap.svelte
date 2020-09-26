<style>
    .fill-screen {
        height: 80vh;
    }
</style>

<script>
    import { user, situation } from './../store.js'
    import { db } from './../firebase.js'
    import firebase from 'firebase/app'
    import Search from './Search.svelte'
    import SearchResults from './SearchResults.svelte'
    import LoadingIndicator from './LoadingIndicator.svelte'

    let container
    let point
    let zoom = 0
    let searchQuery = ''
    let searchTerm = null
    let searchResults = []
    let currentPano = null
    let isNoContents = false
    let isLoading = false

    import { onMount } from 'svelte'

    function handleSubmit() {
        isLoading = true
        searchTerm = searchQuery.trim()
        searchResults = []
        isNoContents = false

        if (!searchTerm) return

        searchUnsplash()
    }

    function handleClick(point) {
        let warpPoint = new firebase.firestore.GeoPoint(
            point.lat(),
            point.lng()
        )

        db.collection('users').doc($user.uid).update({
            point: warpPoint,
        })

        currentPano.setPosition(
            new google.maps.LatLng(point.lat(), point.lng())
        )
    }

    function searchUnsplash() {
        var center = new google.maps.LatLng(point.latitude, point.longitude)

        var request = {
            query: searchTerm,
            fields: ['name', 'geometry'],
        }

        var map = new google.maps.Map(document.getElementById('map'), {
            center: center,
            zoom: 15,
        })

        var service = new google.maps.places.PlacesService(map)

        service.findPlaceFromQuery(request, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                searchResults = results
            } else {
                isNoContents = true
            }
        })

        isLoading = false
    }

    function convertStatus(status) {
        switch (status) {
            case 'resting':
                return '停止'
            case 'walking':
                return '歩行'
            case 'turningRight':
                return '右回転'
            case 'turningLeft':
                return '左回転'
            default:
                return 'エラー'
        }
    }

    onMount(async () => {
        db.collection('users')
            .doc($user.uid)
            .get()
            .then((doc) => {
                point = doc.data()['point']

                if (!point) {
                    // Mt. Fuji
                    point = new firebase.firestore.GeoPoint(
                        35.3606322,
                        138.7273284
                    )
                    db.collection('users').doc($user.uid).update({
                        point: point,
                    })
                }

                var center = new google.maps.LatLng(
                    point.latitude,
                    point.longitude
                )
                var opts = {
                    position: center,
                    pov: {
                        heading: $situation.heading,
                        pitch: 0,
                        zoom: zoom,
                    },
                }
                var myPano = new google.maps.StreetViewPanorama(container, opts)
                currentPano = myPano
                myPano.setVisible(true)
                const interval = setInterval(function () {
                    if ($situation.status === 'walking') {
                        let links = myPano.getLinks()
                        let target = 0

                        let val = 360
                        let currentPov = myPano.getPov()
                        links.forEach(function (element, index) {
                            let ans = Math.abs(
                                currentPov.heading - element.heading
                            )
                            if (val > ans) {
                                val = ans
                                target = index
                            }
                        })
                        let heading = links[target].heading
                        myPano.setPov({
                            heading: heading,
                            pitch: 0,
                        })
                        myPano.setPano(links[target]['pano'])
                        situation.set({
                            status: $situation.status,
                            heading: heading,
                            statusJa: convertStatus($situation.status),
                        })
                    } else if ($situation.status === 'turningRight') {
                        let heading = ($situation.heading + 20) % 360
                        myPano.setPov({
                            heading: heading,
                            pitch: 0,
                        })
                        situation.set({
                            status: $situation.status,
                            heading: heading,
                            statusJa: convertStatus($situation.status),
                        })
                    } else if ($situation.status === 'turningLeft') {
                        let heading = ($situation.heading + 340) % 360
                        myPano.setPov({
                            heading: heading,
                            pitch: 0,
                        })
                        situation.set({
                            status: $situation.status,
                            heading: heading,
                            statusJa: convertStatus($situation.status),
                        })
                    }
                }, 2000)
            })
        db.collection('conditions')
            .doc($user.uid)
            .onSnapshot((doc) => {
                let { status } = doc.data()
                situation.set({
                    status,
                    heading: $situation.heading,
                    statusJa: convertStatus(status),
                })
            })
    })
</script>

<Search bind:query="{searchQuery}" handleSubmit="{handleSubmit}" />

{#if isLoading}
    <div class="loading-indicator">
        <LoadingIndicator />
    </div>
{:else}
    <SearchResults
        results="{searchResults}"
        handleClick="{handleClick}"
        isNoContents="{isNoContents}"
    />
{/if}

<div class="field is-grouped is-grouped-multiline">
    <div class="control">
        <div class="tags has-addons">
            <span class="tag is-dark">状態</span>
            <span class="tag is-info">{$situation.statusJa}</span>
        </div>
    </div>

    <div class="control">
        <div class="tags has-addons">
            <span class="tag is-dark">方角</span>
            <span class="tag is-success">{$situation.heading}°</span>
        </div>
    </div>
</div>
<div class="columns mt-2">
    <div class="column fill-screen" bind:this="{container}"></div>
</div>

<div id="map"></div>
