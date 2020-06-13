<style>
    .full-screen {
        width: 50vw;
        height: 50vh;
    }
</style>

<script>
    import { user } from './../store.js'

    let container
    let map
    let zoom = 8
    let center = { lat: -34.397, lng: 150.644 }

    import { onMount } from 'svelte'

    onMount(async () => {
        var center = new google.maps.LatLng(35.308191, 139.487196)
        var opts = {
            position: center,
            pov: {
                heading: 278.3,
                pitch: 30,
                zoom: 0,
            },
        }
        var myPano = new google.maps.StreetViewPanorama(container, opts)
        myPano.setVisible(true)
    })
</script>

<h1>Welcome</h1>

<p>Your email address is {$user.email}</p>

<p>Your protected content here.</p>
<div class="full-screen" bind:this="{container}"></div>
