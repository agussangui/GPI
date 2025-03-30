export interface InvitationsInterface {
    project_id: string;
    user_id: string;
    created_at: string;
}

export class InvitationsClass implements InvitationsInterface {
    constructor(
        public project_id: string,
        public user_id: string,
        public created_at: string
    ) {}

    static getInvitationsFromJson(json: any): InvitationsClass[] {
        if (!json.invitations || !Array.isArray(json.invitations)) {
            throw new Error("Invalid JSON format: 'invitations' field is missing or not an array");
        }

        return json.invitations.map(
            (invitation: any) =>
                new InvitationsClass(
                    invitation.project_id,
                    invitation.user_id,
                    invitation.created_at
                )
        );
    }
}