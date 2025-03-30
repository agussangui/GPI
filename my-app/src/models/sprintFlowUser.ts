export interface SprintFlowUser {
    id: string;
    name: string;
    photo_url: string;
    created_at: string;
    email: string;
}

export class SprintFlowUserClass implements SprintFlowUser {
    constructor(
        public id: string,
        public name: string,
        public photo_url: string,
        public created_at: string,
        public email: string
    ) {}

    static getSprintFlowUserFromJson(json: any) {        
        if (!json) {
            throw new Error("Invalid JSON format: single sprintFlowUser not found");
        }
    
        return new SprintFlowUserClass(
            json.id,
            json.name,
            json.photo_url,
            json.created_at,
            json.email
        );
    }

    static getSprintFlowUsersFromJson(json: any) {
        if (!json.users || !Array.isArray(json.users)) {
            throw new Error("Invalid JSON format");
        }

        return json.users.map(
            (sprintFlowUser: any) =>
                new SprintFlowUserClass(
                    sprintFlowUser.id,
                    sprintFlowUser.name,
                    sprintFlowUser.photo_url,
                    sprintFlowUser.created_at,
                    sprintFlowUser.email
                )
        );
    }

}