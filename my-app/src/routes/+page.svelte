<script lang="ts">
  export let data;

  interface Status {
    id: number;
    name: string;
  }

  let statusData: Status[] = data.statusData;
</script>

<div>
  <h1>Status List</h1>
  {#if statusData.length === 0}
    <p>No status data available</p>
  {/if}
  {#each statusData as status}
    <p>{status.id}: {status.name}</p>
  {/each}
</div>
