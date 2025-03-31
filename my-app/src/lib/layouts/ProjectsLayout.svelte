<script lang="ts">
	import TopBar from '$lib/components/menus/TopBar.svelte';
	import { sprintStore } from '$stores/sprintStore';
	
	const {title} = $props()
	sprintStore.set({ upcomingSprint: null });
</script>

<div class="app-container">
	<TopBar />
	<div class="content-container">
		<main class="mr-19">
			<div class="p-5">
				
			<span class="font-medium text-3xl ">{title}</span>
			<div class="mt-5"></div>
			<slot />
			</div>
			
		</main>
	</div>
</div>


<style lang="css">
	.app-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}

	.content-container {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	main {
		flex: 1;
		padding: 1rem;
		overflow-y: auto;
	}
</style>