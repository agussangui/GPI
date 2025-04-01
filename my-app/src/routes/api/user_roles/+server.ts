import { json, type RequestEvent } from '@sveltejs/kit';

export async function POST(event: RequestEvent) {
    try {
        const user = event.locals.user;

        if (!user) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { project_id, user_id, role } = await event.request.json();

        if (!project_id) {
            return json({ error: 'Project Id is required' }, { status: 400 });
        }

        if (!user_id) {
            return json({ error: 'User Id is required' }, { status: 400 });
        }

        const { data: userRoleData, error: userRoleError } = await event.locals.supabase
            .from('user_roles')
            .insert([{ project_id, user_id, role }])
            .select()
            .single();

        if (userRoleError) {
            throw new Error(`Failed to insert user role: ${userRoleError.message}`);
        }

        const { data: invitationData, error: invitationError } = await event.locals.supabase
            .from('invitations')
            .delete()
            .match({ project_id, user_id })
            .single();

        if (invitationError) {
            await event.locals.supabase
                .from('user_roles')
                .delete()
                .match({ project_id, user_id });

            throw new Error(`Failed to delete invitation: ${invitationError.message}`);
        }

        return json({ user_role: userRoleData }, { status: 201 });

    } catch (err) {
        console.error('Error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}

export async function GET(event: RequestEvent) {
    try {
        const user_id = event.url.searchParams.get("user_id") as string;
        const project_id = event.url.searchParams.get("project_id") as string;

        let data, error;
        const user = event.locals.user;
        if (!user) {
            return json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
        }

        if (user_id != null) {
            const { data: userRoles, error: userRolesError } = await event.locals.supabase
            .from('user_roles')
            .select('project_id')
            .eq('user_id', user_id);

        if (userRolesError) {
            throw new Error(userRolesError.message);
        }

        const projectIds = userRoles.map(role => role.project_id);

        if (projectIds.length === 0) {
            return json({ projects: [] }, { status: 200 });
        }

        const { data: projects, error: projectsError } = await event.locals.supabase
            .from('projects')
            .select('*')
            .in('id', projectIds)
            .neq('user_id', user_id);

        if (projectsError) {
            throw new Error(projectsError.message);
        }

        return json({ projects }, { status: 200 });

        } else if (project_id != null) {
            ({ data, error } = await event.locals.supabase
                .from('user_roles')
                .select('*, user_id(*)')
                .eq('project_id', project_id)
            );
            
            if (error) {
                throw new Error(error.message);
            }
            
            const transformedData = (data ?? []).map(invitation => {
                const { user_id, ...rest } = invitation;
                return {
                    ...rest,
                    user: user_id,
                };
            });
            
            return json(transformedData, { status: 200 });

        } else {
            return json({ error: 'User ID or Project ID is required' }, { status: 400 });
        }

    } catch (error) {
        console.error('Error fetching projects:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}