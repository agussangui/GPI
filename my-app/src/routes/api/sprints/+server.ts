import { json, type RequestEvent } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { SprintStatusEnum } from '$models/sprintStatusEnum';



export async function POST(event: RequestEvent) {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { project_id, name, start_date, end_date } = await event.request.json();
        if (!project_id || !name || !start_date || !end_date) {
            return json({ error: 'Project ID, name, start date, and end date are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('sprints')
            .insert([{ project_id, name, start_date, end_date }])
            .select()
            .single();

        if (error) throw error;

        return json({ project: data }, { status: 201 });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}


export async function GET({ params, url }: RequestEvent) {
    try {
  /*      const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }
*/
        const project_id = url.searchParams.get("project_id");
        if (!project_id) {
            return json({ error: 'Project ID is required' }, { status: 400 });
        }
        
        const statusParam = url.searchParams.get("status");
        const statusEnumValue = statusParam && statusParam in SprintStatusEnum 
        ? SprintStatusEnum[statusParam as keyof typeof SprintStatusEnum]
        : undefined;
        
        let request = supabase.from('sprints')
                    .select('*')
                    .eq('project_id', project_id)
                    .order('start_date', { ascending: true })
        if ( statusEnumValue==SprintStatusEnum.todo ) {
            const now = new Date().toISOString();
            request = request.gt('start_date', now);
        }
        
        const { data, error } = await request;
        if (error) throw error;

        return json({ project: data }, { status: 201 });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}