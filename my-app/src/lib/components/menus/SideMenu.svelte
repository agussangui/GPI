<script lang="ts">
    import { page } from '$app/state';
    import { onMount } from 'svelte';
    import Insights from '$lib/components/icons/Insights.svelte';
    import Board from '$lib/components/icons/Board.svelte';
    import Backlog from '$lib/components/icons/Backlog.svelte';
    import Timeline from '$lib/components/icons/Timeline.svelte';
    import Sprint from '$lib/components/icons/Sprint.svelte';
    import AddUserStoryModal from '../userStory/addUserStoryModal.svelte';

    let projectId: string;

    onMount(() => {
        if (page.params) {
            projectId = page.params.id;
        }
    });

    // Dynamically generate menu items with correct hrefs based on projectId
    $: menuItems = [
        // { id: 'insights', label: 'Insights', icon: Insights, href: `/projects/${projectId}/insights` },
        { id: 'backlog', label: 'Backlog', icon: Backlog, href: `/projects/${projectId}/backlog` },
        { id: 'board', label: 'Board', icon: Board, href: `/projects/${projectId}/board` },
        { id: 'sprints', label: 'Sprints', icon: Sprint, href: `/projects/${projectId}/sprints` },
        // { id: 'timeline', label: 'Timeline', icon: Timeline, href: `/projects/${projectId}/timeline` }
    ];

    // Check if the route is active
    function isRouteActive(path: string): boolean {
        return page.url.pathname.startsWith(path);
    }

    let showModal = false;
</script>

<AddUserStoryModal bind:showModal />

<aside class="side-menu-wrapper">
    <div class="side-menu">
        <div class="project-title text-xl">GPI</div>
        <nav class="side-nav">
            <ul class="side-nav__list">
                {#each menuItems as item}
                    <li class="side-nav__item text-sm">
                        <a
                            href={item.href}
                            class="side-nav__link {isRouteActive(item.href) ? 'side-nav__link--active' : ''}"
                            aria-current={isRouteActive(item.href) ? 'page' : undefined}
                        >
                            <span class="side-nav__icon">
                                <svelte:component this={item.icon} />
                            </span>
                            <span>{item.label}</span>
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>
    </div>
</aside>

<style lang="scss">
    .side-menu-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 1rem;
        margin-top: -8rem;
    }

    .side-menu {
        border-radius: 0.5rem;
        min-width: 13rem;
        background-color: var(--background-dark);
        display: flex;
        flex-direction: column;
        padding: 1.2rem;
        box-shadow: var(--drop-shadow);
    }

    .project-title {
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
            margin-bottom: 0.1rem;
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
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
            background-color: var(--primary-color-dark);
        }
    }
</style>
