<script lang="ts">
    import type { UserStoryClass } from "$models/userStory";
    import { UserStoryStatusEnum } from '$models/userStoryStatusEnum'
    import { updateUserStoryStatus, updateUserStoryCompletionDate } from '$services/userStoriesService';
    import { onMount } from 'svelte';
    import {sortByPriority} from "$lib/util.ts";

    export let userStoryList: UserStoryClass[] | null = [];
    export let sprintStartDate: string | null = null;
    export let sprintEndDate: string | null = null;

    const columns = [
        { status: UserStoryStatusEnum.todo, title: "To Do", color: "bg-gray-200" },
        { status: UserStoryStatusEnum.inProgress, title: "In Progress", color: "bg-blue-200" },
        { status: UserStoryStatusEnum.testing, title: "Testing", color: "bg-yellow-200" },
        { status: UserStoryStatusEnum.done, title: "Done", color: "bg-green-200" }
    ];

    let openMenuId: string | null = null;
    let editCompletionDateId: string | null = null;
    let completionDateInput: string = '';
    let dateError: string | null = null;

    function toggleMenu(storyId: string) {
        openMenuId = openMenuId === storyId ? null : storyId;
    }

    function startEditCompletionDate(story: UserStoryClass) {
        editCompletionDateId = story.id;
        dateError = null;
        completionDateInput = story.completion_date 
            ? new Date(story.completion_date).toISOString().split('T')[0] 
            : new Date().toISOString().split('T')[0];
    }

    function isDateWithinSprint(dateStr: string): boolean {
        if (!sprintStartDate || !sprintEndDate) return true; // If sprint dates not provided, skip validation
        
        const date = new Date(dateStr);
        const startDate = new Date(sprintStartDate);
        const endDate = new Date(sprintEndDate);
        
        date.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        
        return date >= startDate && date <= endDate;
    }

    async function saveCompletionDate(story: UserStoryClass) {
        try {
            if (!completionDateInput) {
                dateError = "Completion date is required";
                return;
            }
            
            if (!isDateWithinSprint(completionDateInput)) {
                dateError = "Completion date must be within the sprint period";
                return;
            }
            
            const dateToSave = completionDateInput 
                ? new Date(completionDateInput + 'T12:00:00Z').toISOString() 
                : null;
                
            const updatedStory = await updateUserStoryCompletionDate(story.id, dateToSave);

            if (updatedStory) {
                const index = userStoryList?.findIndex(s => s.id === story.id);
                if (index !== undefined && index >= 0 && userStoryList) {
                    userStoryList[index] = updatedStory;
                }
                editCompletionDateId = null;
                dateError = null;
            } else {
                console.error("Failed to update completion date: No updated story returned");
            }
        } catch (error) {
            console.error("Failed to update completion date:", error);
            dateError = "Failed to update completion date";
        }
    }

    async function changeStatus(story: UserStoryClass, newStatus: string) {
        try {
            const sprintDates = sprintStartDate && sprintEndDate 
                ? { startDate: sprintStartDate, endDate: sprintEndDate } 
                : undefined;
            
            const updatedStory = await updateUserStoryStatus(story.id, newStatus, sprintDates);

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
            if (!target.closest(".dropdown") && !target.closest(".date-edit")) {
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
                    <div class="bg-white p-3 rounded-md shadow flex flex-col">
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="font-semibold">{story.title}</h3>
                                <p class="text-sm text-gray-600">{story.description}</p>
                                <span class="text-xs text-gray-500">Priority: {story.priority}</span>
                                
                                {#if Number(story.status_id) === UserStoryStatusEnum.done}
                                    {#if editCompletionDateId === story.id}
                                        <div class="mt-2 date-edit">
                                            <input
                                                type="date"
                                                class="px-2 py-1 border rounded text-sm"
                                                bind:value={completionDateInput}
                                            />
                                            {#if dateError}
                                                <p class="text-red-500 text-xs mt-1">{dateError}</p>
                                            {/if}
                                            {#if sprintStartDate && sprintEndDate}
                                                <p class="text-xs text-gray-500 mt-1">
                                                    Sprint period: {new Date(sprintStartDate).toLocaleDateString()} - {new Date(sprintEndDate).toLocaleDateString()}
                                                </p>
                                            {/if}
                                            <div class="flex gap-2 mt-1">
                                                <button 
                                                    class="text-xs bg-green-500 text-white px-2 py-1 rounded"
                                                    on:click={() => saveCompletionDate(story)}
                                                >
                                                    Save
                                                </button>
                                                <button 
                                                    class="text-xs bg-gray-300 px-2 py-1 rounded"
                                                    on:click={() => {
                                                        editCompletionDateId = null;
                                                        dateError = null;
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    {:else}
                                        <div class="mt-1 flex items-center">
                                            <span class="text-xs text-gray-500">
                                                Completed: {story.completion_date ? new Date(story.completion_date).toLocaleDateString() : 'Not set'}
                                            </span>
                                            <button 
                                                class="ml-2 text-xs text-blue-500"
                                                on:click={() => startEditCompletionDate(story)}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    {/if}
                                {/if}
                            </div>
                            <div class="relative dropdown">
                                <button class="text-gray-500 hover:text-gray-700 text-lg" on:click|stopPropagation={() => toggleMenu(story.id)}>⋮</button>
                                {#if openMenuId === story.id}
                                    <div class="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md border border-gray-200 z-10">
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
                    </div>
                {:else}
                    <p class="text-sm text-gray-500">No stories</p>
                {/each}
            </div>
        </div>
    {/each}
</div>
