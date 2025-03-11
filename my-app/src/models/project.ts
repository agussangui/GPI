import { SprintClass } from "./sprint";

export interface Project {
    id: string;
    user_id: string;
    name: string;
    code: string;
    created_at: string;

}

export class ProjectClass implements Project {
    constructor(
        public id: string,
        public user_id: string,
        public name: string,
        public code: string,
        public created_at: string) {}

        static getSingleProjectFromJson(json: any) {
            if (!json.project) {
                throw new Error("Invalid JSON format: single project not found");
            }
    
            const project = json.project;
            return new ProjectClass(
                project.id,
                project.user_id,
                project.name,
                project.code,
                project.created_at
            );
        }

    static getProjectsFromJson(json: any) {
        if (!json.projects || !Array.isArray(json.projects)) {
            throw new Error("Invalid JSON format");
        }

        return json.projects.map(
            (project: any) =>
                new ProjectClass(
                    project.id,
                    project.user_id,
                    project.name,
                    project.code,
                    project.created_at
                )
        );
    }

}