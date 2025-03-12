import { json, type RequestEvent } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { UserStoryStatusEnum } from '$models/userStoryStatusEnum';

export async function GET({ params, url }: RequestEvent) {
    const project_id = params.id;
    const status = UserStoryStatusEnum[ url.searchParams.get("status") as keyof typeof UserStoryStatusEnum]
    const sprint_id = url.searchParams.get("sprint_id") as string | null;
    
    if (!project_id || status==undefined) {
        return json({ error: 'Project ID and correct user stories status are required' }, { status: 400 });
    }
    let data, error
    try {
        if ( sprint_id!=null) {
            ({ data, error } = await supabase
            .from('user_stories')
            .select('*')
            .eq('sprint_id', sprint_id)
            .neq('status', UserStoryStatusEnum.backlog)
             );
        } else {
         ({ data, error } = await supabase
            .from('user_stories')
            .select('*')
            .eq('project_id', project_id)
            .eq('status_id', status)
         );
         
        }
        if (error) {
            throw new Error(error.message);
        }

        return json({ user_stories: data }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}

