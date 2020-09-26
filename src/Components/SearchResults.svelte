<script>
    export let results
    export let handleClick
    export let isNoContents

    function setPoint(point) {
        handleClick(point)
    }
</script>

{#if isNoContents}
    <article class="message is-warning">
        <div class="message-body">検索結果がありませんでした</div>
    </article>
{:else}
    <div class="buttons">
        {#each results as result (result.id)}
            <button
                class="button"
                on:click="{setPoint(result.geometry.location)}"
            >「{result.name}」へ移動</button>
        {/each}
    </div>
{/if}
