import type { SprintClass } from '$models/sprint';
import { writable } from 'svelte/store';

interface SprintStore {
    currentSprintIdBacklogPage: SprintClass | null;
}

export const sprintStore = writable<SprintStore>({
    currentSprintIdBacklogPage: null
});
