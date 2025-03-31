import type { UserInfoClass } from '$models/userInfo';
import { writable } from 'svelte/store';

interface ProjectStore {
    membersMap: Map<string, UserInfoClass>;
}

export const projectStore = writable<ProjectStore>({
    membersMap: new Map<string, UserInfoClass>(),
});
