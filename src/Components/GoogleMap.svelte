<style>
    .fill-screen {
        height: 80vh;
    }
</style>

<script>
    import { user, situation } from './../store.js'
    import { db } from './../firebase.js'
    import firebase from 'firebase/app'

    let container
    let point
    let zoom = 0

    import { onMount } from 'svelte'

    onMount(async () => {
        db.collection('users')
            .doc($user.uid)
            .get()
            .then(doc => {
                point = doc.data()['point']

                if (!point) {
                    console.log('undef')
                    // Mt. Fuji
                    point = new firebase.firestore.GeoPoint(
                                35.3606322,
                                138.7273284
                            )
                    db.collection('users')
                        .doc($user.uid)
                        .update({
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
                myPano.setVisible(true)
                const interval = setInterval(function() {
                    console.log('interval')
                    if ($situation.status === 'walking') {
                        console.log('step')
                        let links = myPano.getLinks()
                        let target = 0
                        console.log(links)
                        let val = 360
                        let currentPov = myPano.getPov()
                        links.forEach(function(element, index) {
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
                        })
                    } else if ($situation.status === 'turningRight') {
                        console.log('turn right')
                        let heading = ($situation.heading + 15) % 360
                        myPano.setPov({
                            heading: heading,
                            pitch: 0,
                        })
                        situation.set({
                            status: $situation.status,
                            heading: heading,
                        })
                    } else if ($situation.status === 'turningLeft') {
                        console.log('turn left')
                        let heading = ($situation.heading + 345) % 360
                        myPano.setPov({
                            heading: heading,
                            pitch: 0,
                        })
                        situation.set({
                            status: $situation.status,
                            heading: heading,
                        })
                    }
                }, 2000)
            })
        db.collection('conditions')
            .doc($user.uid)
            .onSnapshot(doc => {
                let { status } = doc.data()
                console.log(status)
                situation.set({ status, heading: $situation.heading })
            })
    })
</script>

<ul>
    <li>status: {$situation.status}</li>
    <li>heading: {$situation.heading}</li>
</ul>
<div class="columns mt-2">
    <div class="column fill-screen" bind:this="{container}"></div>
</div>
