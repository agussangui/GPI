import type { SprintClass } from '$models/sprint';
import { writable } from 'svelte/store';

interface SprintStore {
    upcomingSprint: SprintClass | null;
}

export const sprintStore = writable<SprintStore>({
    upcomingSprint: null
});
