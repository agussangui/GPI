import { SprintFlowUserClass, type SprintFlowUser } from "./sprintFlowUser";

export interface UserRoleInterface {
    user_id: string;
    project_id: string;
    role: string;
    created_at: string; 
    user?: SprintFlowUser;
}

export class UserRoleClass implements UserRoleInterface {
    constructor(
        public user_id: string,
        public project_id: string,
        public role: string,
        public created_at: string,
        public user?: SprintFlowUser,
    ) {}

    static getUserRolesFromJson(json: any) {
        if (!json || !Array.isArray(json)) {
            throw new Error("Invalid JSON format");
        }
        
        return json.map((role: any) => this.getUserRoleFromJson(role));
    }

    static getUserRoleFromJson(json: any) {
        if (!json) {
            throw new Error("Invalid JSON format");
        }

        const user = json.user && Object.keys(json.user).length > 0 
        ? SprintFlowUserClass.getSprintFlowUserFromJson(json.user) 
        : undefined;

        return new UserRoleClass(
            json.user_id,
            json.project_id,
            json.role,
            json.created_at,
            user
        );
    }
}