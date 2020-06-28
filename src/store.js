import { writable } from 'svelte/store'

export const user = writable({ loggedIn: false })
export const situation = writable({ status: "resting", heading: 0 })
