import firebase from 'firebase/app'
import 'firebase/auth'

var firebaseConfig = {
    // TODO: Dotenv対応
}

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const provider = new firebase.auth.GoogleAuthProvider()
