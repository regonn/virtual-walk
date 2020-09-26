<style>
    .search-input {
        border-radius: 4px;
        border: 1px solid #ccc;
        padding: 0.45rem 1rem;
        margin-bottom: 1rem;
        width: 80%;
    }
</style>

<script>
    export let query
    export let handleSubmit
</script>

<div class="search">
    <form class="search-form" on:submit|preventDefault="{handleSubmit}">
        <input
            bind:value="{query}"
            class="search-input"
            type="search"
            placeholder="場所検索"
        />
        <button class="button">検索</button>
    </form>
</div>
