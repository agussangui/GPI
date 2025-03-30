import { ProjectClass } from "./project";

export interface ProjectInvitation {
    project: ProjectClass;
    created_at: string;
    user_id: string;
}

export class ProjectInvitationClass implements ProjectInvitation {
    constructor(
        public project: ProjectClass,
        public created_at: string,
        public user_id: string
    ) {}

    static getProjectInvitationFromJson(json: any) {
        if (!json) {
            throw new Error("Invalid JSON format: single projectInvitation not found");
        }

        return new ProjectInvitationClass(
            ProjectClass.getSingleProjectFromJson(json.project),
            json.created_at,
            json.user_id
        );
    }

    static getProjectInvitationsFromJson(json: any) {
        if (!json || !Array.isArray(json)) {
            throw new Error("Invalid JSON format: response must be an array");
        }
    
        return json.map(
            (projectInvitation: any) => {
                return ProjectInvitationClass.getProjectInvitationFromJson(projectInvitation);
            }
        );
    }
}