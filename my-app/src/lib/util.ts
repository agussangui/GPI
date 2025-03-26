import {UserStoryClass} from "$models/userStory.ts";

export function sortByPriority(backlog: UserStoryClass[] | null): UserStoryClass[] | null {
    return backlog?.sort((a, b) => a.priority - b.priority) ?? null;
}