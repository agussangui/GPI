import { SprintFlowUserClass } from "./sprintFlowUser";

export interface UserInvitation {
    user: SprintFlowUserClass;
    created_at: string;
    project_id: string;
}

export class UserInvitationClass implements UserInvitation {
    constructor(
        public user: SprintFlowUserClass,
        public created_at: string,
        public project_id: string,
    ) {}

    static getUserInvitationFromJson(json: any) {
            if (!json) {
                throw new Error("Invalid JSON format: single userInvitation not found");
            }
    
            return new UserInvitationClass(
                SprintFlowUserClass.getSprintFlowUserFromJson(json.user),
                json.created_at,
                json.project_id
            );
        }

        static getUserInvitationsFromJson(json: any) {
            
            if (!json || !Array.isArray(json)) {
                throw new Error("Invalid JSON format: response must be an array");
            }
        
            return json.map(
                (userInvitation: any) => {
                    return UserInvitationClass.getUserInvitationFromJson(userInvitation);
                }
            );
        }
}
