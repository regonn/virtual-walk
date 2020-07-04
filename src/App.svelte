<script>
    import './mystyles.scss'
    import Register from './Components/Auth/Register.svelte'
    import GoogleMap from './Components/GoogleMap.svelte'
    import { Router, Link, Route } from 'svelte-routing'
    import Login from './Components/Auth/Login.svelte'
    import { user } from './store.js'
    import { auth } from './firebase.js'

    const classActive = 'active'
    const classInactive = 'inactive'

    const handleLogOut = () => {
        auth.signOut().then(
            function() {
                // Sign-out successful.
                user.set({ ...$user, loggedIn: false })
                console.log('logout', $user)
            },
            function(error) {
                // An error happened.
                console.warn('error on logout', error.message)
            }
        )
    }

    function getProps({ location, href, isPartiallyCurrent, isCurrent }) {
        const isActive =
            href === '/' ? isCurrent : isPartiallyCurrent || isCurrent
        // The object returned here is spread on the anchor element's attributes
        if (isActive) {
            return { class: classActive }
        }
        return { class: classInactive }
    }
</script>

<svelte:head>
    <script
        defer
        async
        src=`https://maps.googleapis.com/maps/api/js?key={process.env.GOOGLE_MAP_API_KEY}&callback=initMap`>

    </script>
</svelte:head>

<Router>
    <ul>
        {#if $user.loggedIn}
            <li>
                <Link to="google_map" {getProps}>GoogleMap</Link>
            </li>
            <li>
                <a class="inactive" href="/" on:click="{handleLogOut}">
                    Logout
                </a>
            </li>
        {:else}
            <li>
                <Link to="/" {getProps}>Home</Link>
            </li>
            <li>
                <Link to="register" {getProps}>Register</Link>
            </li>
        {/if}
    </ul>

    <Route path="register" component="{Register}" />
    <Route path="google_map" component="{GoogleMap}" />
    <Route path="/" component="{Login}" />
</Router>
