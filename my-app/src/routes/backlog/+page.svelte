<script>
  import { supabase } from '$lib/supabase'; // Poprawiona ścieżka
  import { onMount } from 'svelte';

  let data = null;
  let error = null;
  let loading = true;

  async function testDB() {
    const { data: testData, error: testError } = await supabase.from('test').select('*');
    data = testData;
    error = testError;
    loading = false;
  }

  onMount(() => {
    testDB();
  });
</script>

<h1>Test Supabase</h1>

{#if loading}
  <p>Loading..</p>
{:else if error}
  <p style="color: red;">Błąd: {error.message}</p>
{:else if data}
  <pre>{JSON.stringify(data, null, 2)}</pre>
{/if}
