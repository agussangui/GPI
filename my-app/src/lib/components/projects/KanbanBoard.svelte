<script lang="ts">
    import type { UserStoryClass } from "$models/userStory";
    import { UserStoryStatusEnum } from '$models/userStoryStatusEnum'
    import { updateUserStoryStatus } from '$services/userStoriesService';
    import { onMount } from 'svelte';
    import {sortByPriority} from "$lib/util.ts";

    export let userStoryList: UserStoryClass[] | null = [];

    const columns = [
        { status: UserStoryStatusEnum.todo, title: "To Do", color: "bg-gray-200" },
        { status: UserStoryStatusEnum.inProgress, title: "In Progress", color: "bg-blue-200" },
        { status: UserStoryStatusEnum.testing, title: "Testing", color: "bg-yellow-200" },
        { status: UserStoryStatusEnum.done, title: "Done", color: "bg-green-200" }
    ];

    let openMenuId: string | null = null;

    function toggleMenu(storyId: string) {
        openMenuId = openMenuId === storyId ? null : storyId;
    }

    async function changeStatus(story: UserStoryClass, newStatus: string) {
        try {
            const updatedStory = await updateUserStoryStatus(story.id, newStatus);

            if (updatedStory) {
                const index = userStoryList?.findIndex(s => s.id === story.id);
                if (index !== undefined && index >= 0 && userStoryList) {
                    userStoryList[index] = updatedStory;
                }
                openMenuId = null;
            } else {
                console.error("Failed to update status: No updated story returned");
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    }

    onMount(() => {
        document.addEventListener("click", (event: Event) => {
            const target = event.target as HTMLElement;
            if (!target.closest(".dropdown")) {
                openMenuId = null;
            }
        });
    });
</script>

<div class="grid grid-cols-4 gap-4 p-2">
    {#each columns as { status, title, color }}
        <div class="rounded-lg p-4 shadow-md {color}">
            <h2 class="text-lg font-bold mb-2">{title}</h2>
            <div class="space-y-2">
                {#each (sortByPriority((userStoryList ?? []))?? []).filter(story => Number(story.status_id) === status) as story}
                    <div class="bg-white p-3 rounded-md shadow flex justify-between items-center">
                        <div>
                            <h3 class="font-semibold">{story.title}</h3>
                            <p class="text-sm text-gray-600">{story.description}</p>
                            <span class="text-xs text-gray-500">Priority: {story.priority}</span>
                        </div>
                        <div class="relative dropdown">
                            <button class="text-gray-500 hover:text-gray-700 text-lg" on:click|stopPropagation={() => toggleMenu(story.id)}>⋮</button>
                            {#if openMenuId === story.id}
                                <div class="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md border border-gray-200">
                                    {#each [0, 1, 2, 3] as newStatus}
                                        {#if newStatus.toString() !== story.status_id.toString()}
                                            <button 
                                                class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                on:click={() => changeStatus(story, newStatus.toString())}
                                            >
                                                {columns.find(col => col.status === newStatus)?.title}
                                            </button>
                                        {/if}
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    </div>
                {:else}
                    <p class="text-sm text-gray-500">No stories</p>
                {/each}
            </div>
        </div>
    {/each}
</div>
