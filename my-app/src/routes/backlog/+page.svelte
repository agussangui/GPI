<script lang="ts">
	import DashboardLayout from '$lib/layouts/DashboardLayout.svelte';
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';
  import UserStoryList from '$lib/components/user story/user_story_list.svelte';
  import { GET } from '../api/user_stories/+server.ts';
  import type { UserStoryInterface } from '../api/models/UserStory.ts';

  interface TestData {
    id: number;
  }



  let data: TestData[] | null = null;
  let error: Error | null = null;
  let loading = true;
  var backlog: UserStoryInterface[] | null = null;

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
    backlog = response.body;
    console.log(backlog)
    loading = false;
  }

  onMount(() => {
    getBacklog();
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
