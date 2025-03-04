<script lang="ts">
	import '../styles.scss';
	import TopBar from '$lib/components/menus/TopBar.svelte';
	import SideMenu from '$lib/components/menus/SideMenu.svelte';
</script>

<div class="app-container">
	<TopBar />
	<div class="content-container">
		<SideMenu />
		<main>
			<slot />
		</main>
	</div>
</div>

<style lang="scss">
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
