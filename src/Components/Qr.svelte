<script>
    import QrCode from "svelte-qrcode"
    import { onMount } from 'svelte';
    export let idToken
    let url = null
    onMount(async () => {
        url = 'https://virtual-walker-pose-estimate.web.app/?id_token=' + idToken
    })
</script>

<h4>操作用連携アプリは<a href="{url}" target="_blank">こちら</a></h4>

{#if url}
    <QrCode value="{url}" size=300/>
{/if}