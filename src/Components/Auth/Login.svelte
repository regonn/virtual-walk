<style>
</style>

<script>
    import { auth, provider } from './../../firebase.js'
    import firebase from 'firebase/app'
    import { navigate } from 'svelte-routing'
    import { user } from './../../store.js'
    import { db } from './../../firebase.js'

    const handleGoogleLogin = () => {
        auth.signInWithPopup(provider)
            .then(function (result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var idToken = result.credential.idToken
                // The signed-in user info.
                var firebaseuser = result.user

                if (firebaseuser) {
                    let { email, uid } = firebaseuser
                    user.set({ ...$user, loggedIn: true, email, uid, idToken })
                    db.collection('users')
                        .doc(uid)
                        .get()
                        .then((doc) => {
                            if (doc.data() == undefined) {
                                let point = new firebase.firestore.GeoPoint(
                                    35.3606322,
                                    138.7273284
                                )
                                db.collection('users')
                                    .doc(uid)
                                    .set({
                                        point: point,
                                    })
                                    .then(() => {
                                        db.collection('conditions')
                                            .doc(uid)
                                            .set({
                                                status: 'resting',
                                            })
                                            .then(() => {
                                                navigate('/google_map')
                                            })
                                    })
                            } else {
                                navigate('/google_map')
                            }
                        })
                }
            })
            .catch(function (error) {
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
</script>

<div id="container">
    <button class="button is-large" on:click="{handleGoogleLogin}">
        Google でログイン
    </button>
</div>
