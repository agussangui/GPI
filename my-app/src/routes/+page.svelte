<!-- <script lang="ts">
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
</div> -->
<script>
  // Add any necessary script here
</script>

<style>
  /* Add your styles here */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
  }
  .nav-links {
    display: flex;
    gap: 20px;
  }
  .main-content {
    text-align: center;
    padding: 50px 0;
  }
  .buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }
  .dashboard-preview {
    margin-top: 50px;
    text-align: center;
  }
</style>

<div class="container">

  <main class="main-content">
    <h2>Build better products with agile development</h2>
    <p>ScrumTool helps teams track projects, prioritize work, and ship value to customers faster. Simplify your workflow with our intuitive scrum tools.</p>
    <div class="buttons">
      <button>Start for free</button>
      <button>Book a demo</button>
    </div>
  </main>

  <section class="dashboard-preview">
    <h3>ScrumTool Dashboard Preview</h3>
    <img src="dashboard-preview.png" alt="ScrumTool Dashboard Preview">
  </section>
</div>
