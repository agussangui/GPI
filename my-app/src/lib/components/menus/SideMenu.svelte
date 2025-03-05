<script lang="ts">
	import { page } from '$app/state';
	import Insights from '$lib/components/icons/Insights.svelte';
	import Board from '$lib/components/icons/Board.svelte';
	import Backlog from '$lib/components/icons/Backlog.svelte';
	import Timeline from '$lib/components/icons/Timeline.svelte';
	import AddUserStoryModal from '../userStory/addUserStoryModal.svelte';

	const menuItems = [
		{ id: 'insights', label: 'Insights', icon: Insights, href: '/insights' },
		{ id: 'backlog', label: 'Backlog', icon: Backlog, href: '/backlog' },
		{ id: 'board', label: 'Board', icon: Board, href: '/board' },
		{ id: 'timeline', label: 'Timeline', icon: Timeline, href: '/timeline' }
	];

	function isRouteActive(path: string): boolean {
		return page.url.pathname === path;
	}

	let {showModal} = $state(false);
    
</script>

    <AddUserStoryModal bind:showModal/>

<aside class="side-menu-wrapper">
	<div class="side-menu">
		<div class="project-title">GPI</div>
		<nav class="side-nav">
			<ul class="side-nav__list">
				{#each menuItems as item}
					<li class="side-nav__item">
						<a
							href={item.href}
							class="side-nav__link {isRouteActive(item.href) ? 'side-nav__link--active' : ''}"
							aria-current={isRouteActive(item.href) ? 'page' : undefined}
						>
							<span class="side-nav__icon">
								<svelte:component this={item.icon} />
							</span>
							<span class="side-nav__label">{item.label}</span>
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="new-issue-container">
			<button
				class="new-issue-btn"
				onclick={()=>showModal = true}>
				Create issue
			</button>
		</div>
	</div>
</aside>

<style lang="scss">
	.side-menu-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0 3rem;
	}

	.side-menu {
		border-radius: 0.5rem;
		min-width: 15rem;
		background-color: var(--background-dark);
		display: flex;
		flex-direction: column;
		padding: 2rem;
		box-shadow: var(--drop-shadow);
	}

	.project-title {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 2rem;
		text-align: center;
	}

	.side-nav {
		flex: 1;

		&__list {
			list-style-type: none;
			padding: 0;
			margin: 0;
		}

		&__item {
			margin-bottom: 0.75rem;
		}

		&__link {
			display: flex;
			align-items: center;
			text-decoration: none;
			color: var(--text-color);
			padding: 0.75rem;
			border-radius: 0.25rem;
			transition: background-color 0.2s ease;

			&:hover {
				background-color: var(--hover-background-dark);
			}

			&--active {
				color: var(--primary-color);
				background-color: var(--hover-background-primary);
				font-weight: bold;
			}
		}

		&__icon {
			margin-right: 0.75rem;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 24px;
			height: 24px;
		}

		&__label {
			font-size: 1rem;
		}
	}

	.new-issue-container {
		margin-top: auto;
		padding-top: 1rem;
	}

	.new-issue-btn {
		width: 100%;
		padding: 0.75rem;
		background-color: var(--primary-color);
		color: var(--background-light);
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s ease;

		&:hover {
			background-color: var(--primary-color-dark);
		}
	}
</style>
