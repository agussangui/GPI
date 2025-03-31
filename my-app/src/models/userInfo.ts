export interface UserInfoInterface {
    user_id: string;
    user_name: string;
    role: string;
}

export class UserInfoClass implements UserInfoInterface {
    constructor(
        public user_id: string,
        public user_name: string,
        public role: string,
    ) {}

    static getUserInfoFromJson(json: any) {
        if (!json.members || !Array.isArray(json.members)) {
            throw new Error("Invalid JSON format");
        }
        
        return json.members.map(
            (us: any) =>
                new UserInfoClass (
                    us.user_id,
                    us.user_name,
                    us.role
                )
        );
    }

    
}