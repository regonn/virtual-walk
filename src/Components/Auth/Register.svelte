<style>

</style>

<script>
    import { auth, provider } from './../../firebase.js'
    import { navigate } from 'svelte-routing'
    import { user } from './../../store.js'

    const handleGoogleLogin = () => {
        auth.signInWithPopup(provider)
            .then(function(result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken
                // The signed-in user info.
                var firebaseuser = result.user

                if (firebaseuser) {
                    let { email } = firebaseuser
                    console.log('first', $user)
                    user.set({ ...$user, loggedIn: true, email })
                    console.log('then', $user)
                    navigate('/google_map')
                }
                // ...
            })
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code
                var errorMessage = error.message
                // The email of the user's account used.
                var email = error.email
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential
                // ...
            })
    }

    // Destructuring to obtain email and password from form via Event
    const handleRegisterForm = ({
        target: {
            elements: { email, password },
        },
    }) => {
        auth.createUserWithEmailAndPassword(email.value, password.value).catch(
            error => alert(error.message)
        )
        let firebaseUser = auth.currentUser

        if (firebaseUser) {
            let { email } = firebaseUser
            console.log('first', $user)
            user.set({ ...$user, loggedIn: true, email })
            console.log('then', $user)
            navigate('/google_map')
        }
    }
</script>

<div id="container">
    <button class="button is-large" on:click="{handleGoogleLogin}">
        Google で登録
    </button>
</div>
