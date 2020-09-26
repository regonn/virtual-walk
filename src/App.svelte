<style>
    .navbar-title {
        font-family: 'VT323', monospace;
        font-size: 2rem;
    }
</style>

<script>
    import './mystyles.scss'
    import Register from './Components/Auth/Register.svelte'
    import GoogleMap from './Components/GoogleMap.svelte'
    import { Router, Link, Route } from 'svelte-routing'
    import Login from './Components/Auth/Login.svelte'
    import { user } from './store.js'
    import { auth } from './firebase.js'

    export const api_key = process.env.GOOGLE_MAP_API_KEY

    const classActive = 'active navbar-item'
    const classInactive = 'inactive navbar-item'

    const handleLogOut = () => {
        auth.signOut().then(
            function () {
                // Sign-out successful.
                user.set({ ...$user, loggedIn: false })
            },
            function (error) {
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
        src="https://maps.googleapis.com/maps/api/js?key={api_key}&callback=initMap&libraries=places">
    </script>
    <link
        href="https://fonts.googleapis.com/css2?family=VT323&display=swap"
        rel="stylesheet"
    />
</svelte:head>
<Router>
    <nav class="navbar">
        <div class="navbar-brand">
            <a class="navbar-item navbar-title" href="/" style="">
                Virtual Walker
            </a>
        </div>
        {#if $user.loggedIn}
            <div class="navbar-menu is-active">
                <div class="navbar-start">
                    <a
                        class="inactive navbar-item"
                        href="/"
                        on:click="{handleLogOut}"
                    >
                        Logout
                    </a>
                </div>
            </div>
        {:else}
            <div class="navbar-menu is-active">
                <div class="navbar-start">
                    <Link to="/" getProps="{getProps}">Home</Link>
                    <Link to="register" getProps="{getProps}">Register</Link>
                </div>
            </div>
        {/if}
    </nav>
    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column">
                    <Route path="register" component="{Register}" />
                    <Route path="google_map" component="{GoogleMap}" />
                    <Route path="/" component="{Login}" />
                </div>
            </div>
        </div>
    </section>
</Router>
