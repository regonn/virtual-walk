<script>
    import QrCode from "svelte-qrcode"
    import { onMount } from 'svelte';
    // ポーズ判定アプリ側でid_tokenでのログインができるようになったら利用する
    // export let idToken
    let url = null
    onMount(async () => {
        // ポーズ判定アプリ側でid_tokenでのログインができるようになったら利用する
        // url = 'https://virtual-walker-pose-estimate.web.app/?id_token=' + idToken
        url = 'https://virtual-walker-pose-estimate.web.app'
    })
</script>

<h4>操作用連携アプリは<a href="{url}" target="_blank">こちら</a></h4>

{#if url}
    <QrCode value="{url}" size=100/>
{/if}