<script lang="ts">
	import DashboardLayout from '$lib/layouts/DashboardLayout.svelte';
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';
  import UserStoryList from '$lib/components/user story/user_story_list.svelte';
	import UserStory from '$lib/components/user story/user_story.svelte';
  import { GET } from '../api/backlog/+server';

  interface TestData {
    id: number;
  }

  interface UserStoryInterface {
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

  async function getBacklog() {
    const response = await GET();
    data = response.body as UserStoryInterface[];
    error = response;
    loading = false;
  }

  onMount(() => {
    // GET();
  });
</script>


<DashboardLayout title={"Backlog"}>
  

<UserStoryList backlog={data}/>

  {#if loading}
    <p>Loading..</p>
  {:else if error}
    <p style="color: red;">Błąd: {error.message}</p>
  {:else if data}
    <pre>{JSON.stringify(data, null, 2)}</pre>
  {/if}
</DashboardLayout>
