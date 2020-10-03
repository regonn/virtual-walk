<script>
    import { links } from 'svelte-routing'

    export let result
    export let handleClick
    export let isNoContents
    export let isMultiple

    function setPoint(point) {
        handleClick(point)
    }
</script>

{#if isNoContents}
    <article class="message is-warning">
        <div class="message-body">検索結果がありませんでした</div>
    </article>
{:else}
    {#if isMultiple}
        <article class="message is-warning">
            <div class="message-body">
                検索結果が複数あり絞り込めませんでした、より具体的にしてください
            </div>
        </article>
    {:else if result !== null}
        {#if result.links.length === 0}
            <article class="message is-warning">
                <div class="message-body">
                    検索結果先では道がつながっておらず、動くことができません
                </div>
            </article>
        {/if}
        <div class="buttons">
            <button
                class="button"
                on:click="{setPoint(result.location)}"
            >「{result.name}」へ移動</button>
        </div>
    {/if}
{/if}
