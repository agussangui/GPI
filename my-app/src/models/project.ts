import { SprintClass } from "./sprint";
import { SprintFlowUserClass, type SprintFlowUser } from "./sprintFlowUser";

export interface Project {
    id: string;
    user_id: string;
    name: string;
    code: string;
    created_at: string;
    user? : SprintFlowUser;
}

export class ProjectClass implements Project {
    constructor(
        public id: string,
        public user_id: string,
        public name: string,
        public code: string,
        public created_at: string,
        public user?: SprintFlowUser,
    ) {}

    static getSingleProjectFromJson(json: any) {
        if (!json) {
            throw new Error("Invalid JSON format: single project not found");
        }
    
        const projectUser = json.user ? SprintFlowUserClass.getSprintFlowUserFromJson({ sprintFlowUser: json.user }) : undefined;
    
        return new ProjectClass(
            json.id,
            json.user_id,
            json.name,
            json.code,
            json.created_at,
            projectUser
        );
    }

    static getProjectsFromJson(json: any) {        
        if (!json || !Array.isArray(json.projects)) {
            throw new Error("Invalid JSON format");
        }

        return json.projects.map(
            (project: any) => this.getSingleProjectFromJson(project)
        );
    }
}