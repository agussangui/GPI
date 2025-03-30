import { json, type RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
    const project_id = event.url.searchParams.get("project_id") as string | null;
    const user_id = event.url.searchParams.get("user_id") as string | null;
    
    let data, error;
    try {
        const user = event.locals.user;
        
        if (!user) {
            return json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
        }

        if (project_id != null) {
            ({ data, error } = await event.locals.supabase
                .from('invitations')
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

        } else if (user_id != null) {
            ({ data, error } = await event.locals.supabase
                .from('invitations')
                .select('*, project_id(*)')
                .eq('user_id', user_id)
            );
        
            if (error) {
                throw new Error(error.message);
            }
        
            const processedData = await Promise.all(
                (data ?? []).map(async (invitation) => {
                    const { project_id, ...rest } = invitation;
        
                    const { data: userData, error: userError } = await event.locals.supabase
                        .from('users')
                        .select('*')
                        .eq('id', project_id.user_id)
                        .single();
        
                    if (userError) {
                        throw new Error(userError.message);
                    }
        
                    return {
                        ...rest,
                        project: {
                            ...project_id,
                            user: userData,
                        },
                    };
                })
            );

            return json(processedData, { status: 200 });

        } else {
            ({ data, error } = await event.locals.supabase
                .from('invitations')
                .select('*')
            );
        }
        
        if (error) {
            throw new Error(error.message);
        }

        return json({ invitations: data }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}


export async function POST(event: RequestEvent) {
    const { request } = event;

	try {
		const currentUser = event.locals.user;

		if (!currentUser) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

        const { project_id, email } = await request.json();

		if (!project_id) {
			return json({ error: 'Valid project is required' }, { status: 400 });
		}

        if (!email) {
            return json({ error: 'Email is required' }, { status: 400 });
        }
		
        const { data: user, error: userError } = await event.locals.supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (userError) {
            throw new Error(userError.message);
        }

        if (!user) {
            return json({ error: 'User not found' }, { status: 404 });
        }

        const { data: invitation, error: invitationError } = await event.locals.supabase
            .from('invitations')
            .insert([
                {
                    project_id,
                    user_id: user.id
                }
            ])
            .select()
            .single();

        if (invitationError) {
            throw new Error(invitationError.message);
        }

        return json({ message: 'Invitation created successfully', invitation: invitation }, { status: 201 });

	} catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}
