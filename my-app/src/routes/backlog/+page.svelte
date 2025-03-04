<script lang="ts">
	import DashboardLayout from '$lib/layouts/DashboardLayout.svelte';
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';

  interface TestData {
    id: number;
  }

  let data: TestData[] | null = null;
  let error: Error | null = null;
  let loading = true;

  async function testDB() {
    const { data: testData, error: testError } = await supabase
      .from('test')
      .select('*');

    data = testData as TestData[];
    error = testError;
    loading = false;
  }

  onMount(() => {
    testDB();
  });
</script>

<DashboardLayout title="Backlog">
  <h1>Backlog Page Placeholder</h1>

  <h1>Test Supabase</h1>

  {#if loading}
    <p>Loading..</p>
  {:else if error}
    <p style="color: red;">Błąd: {error.message}</p>
  {:else if data}
    <pre>{JSON.stringify(data, null, 2)}</pre>
  {/if}
</DashboardLayout>
