<script lang="ts">
	//import '$lib/styles/global.css';
	import TopBar from '$lib/components/menus/TopBar.svelte';
	import SideMenu from '$lib/components/menus/SideMenu.svelte';
	import { onMount } from 'svelte';
	import { sprintStore } from '$stores/sprintStore';
	import { getCurrentSprint } from '$services/projectService';
	import { page } from '$app/state';

	const {title} = $props()

	onMount(async() => {
		const currentSprint = await getCurrentSprint(page.params.id); 
		sprintStore.update((store) => ({
				...store, 
				currentSprint: currentSprint
			}));
	}) 
</script>

<div class="app-container">
	<TopBar />
	<div class="content-container">
		<SideMenu />
		<main class="mr-19">
			<div class="p-3">
				
			<span class="font-medium text-2xl ">{title}</span>
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