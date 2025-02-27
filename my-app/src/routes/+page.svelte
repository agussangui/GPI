<script>
    export let data;
  </script>

    <h1>Welcome to SvelteKit</h1>
    <p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
    <ul>
        <li>HOLA</li>
        {#each data.statuses as status}
          <li>{status.name}</li>
        {/each}
        <li>CHAU</li>
    </ul>
      