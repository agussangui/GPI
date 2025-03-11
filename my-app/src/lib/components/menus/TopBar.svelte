<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { userStore } from '$stores/userStore';
	import AddProjectModal from '$lib/components/projects/AddProjectModal.svelte';

	let currentUser = {
	  avatar: '/images/avatar.png'
	};
	let showModal = false;

	function openModal() {
	  showModal = true;
	}

	function isRouteActive(path: string): boolean {
	  return page.url.pathname === path;
	}

	async function handleLogout(event: Event): Promise<void> {
	  event.preventDefault();
	
	  const response: Response = await fetch('/api/logout', {
		method: 'POST',
	  });

	  const result = await response.json();

	  if (response.ok) {
		alert('Logout successful');
		userStore.set({ authUser: null, session: null });
		goto('/login');
	  } else {
		alert('Error logging out: ' + result.error);
	  }
	}
</script>

<header class="top-bar">
	<div class="top-bar__left">
	  <a class="logo" href="/projects">
		<img src="/images/logo.svg" alt="Logo" class="logo__image" />
	  </a>
	  <nav class="main-nav text-base">
		<ul class="main-nav__list">
		  <li class="flex">
			<a href="/projects" class="main-nav__link {isRouteActive('/') ? 'main-nav__link--active' : ''}">Projects</a>
		  </li>
		  <li>
			<button class="btn btn-white opacity-40" on:click={openModal}>Create new</button>
		  </li>
		</ul>
	  </nav>
	</div>
	<div class="top-bar__right">
	  <button class="logout-button" on:click={handleLogout}>Logout</button>
	</div>
</header>

{#if showModal}
  <AddProjectModal bind:showModal />
{/if}

<style lang="scss">
	.top-bar {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  padding: 2rem 1rem;
	  background-color: var(--background-light);
	}
  
	.top-bar__left {
	  display: flex;
	  gap: 2rem;
	  min-width: 35%;
	  justify-content: space-between;
	  align-items: center;
	}
  
	.top-bar__right {
	  display: flex;
	  align-items: center;
	}
  
	.logo {
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}
  
	.logo__image {
	  width: 52px;
	  height: 52px;
	}
  
	.main-nav {
	  &__list {
		display: flex;
		gap: 2rem;
		list-style-type: none;
		margin: 0;
		padding: 0;
	  }
  
	  &__link {
		cursor: pointer;
		text-decoration: none;
		color: var(--text-color);
		padding: 0.5rem 0;
		position: relative;
  
		&:hover {
		  text-decoration: underline;
		}
  
		&--active {
		  font-weight: bold;
		}
	  }
	}
  
	.logout-button {
	  background-color: #007bff;
	  color: #fff;
	  border: none;
	  border-radius: 4px;
	  padding: 10px 20px;
	  cursor: pointer;
	  margin-left: 1rem;
	  transition: background-color 0.3s ease-in-out;
  
	  &:hover {
		background-color: #0056b3;
	  }
	}
</style>