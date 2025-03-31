export interface UserRoleInterface {
    user_id: string;
    project_id: string;
    role: string;
}

export class UserRoleClass implements UserRoleInterface {
    constructor(
        public user_id: string,
        public project_id: string,
        public role: string,
    ) {}

    static getUserRolesFromJson(json: any) {
        if (!json.user_roles || !Array.isArray(json.user_roles)) {
            throw new Error("Invalid JSON format");
        }
        
        return json.user_roles.map(
            (role: any) =>
                new UserRoleClass (
                    role.user_id,
                    role.project_id,
                    role.role
                )
        );
    }

    static getUserRoleFromJson(json: any) {
        if (!json.user_role) {
            throw new Error("Invalid JSON format");
        }

        const role = json.user_role;
        return new UserRoleClass(
            role.user_id,
            role.project_id,
            role.role,
        );
    }
}