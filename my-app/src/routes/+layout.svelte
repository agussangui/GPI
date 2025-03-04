<script lang="ts">
	export let data;
	import LayoutAuthenticated from '$lib/layouts/DashboardLayout.svelte';
	import LayoutPublic from '$lib/layouts/LandingLayout.svelte';
  </script>
  
  {#if data.session}
	<LayoutAuthenticated>
	  <slot />
	</LayoutAuthenticated>
  {:else}
	<LayoutPublic>
	  <slot />
	</LayoutPublic>
  {/if}
  