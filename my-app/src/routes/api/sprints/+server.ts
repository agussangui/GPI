import { json, type RequestEvent } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { SprintStatusEnum } from '$models/sprintStatusEnum';

export async function GET({ url }: RequestEvent) {
    try {
        // Authenticate user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            return json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
        }
        
        const projectId = url.searchParams.get('project_id');
        const afterDate = url.searchParams.get('after_date');
        const beforeDate = url.searchParams.get('before_date');
        const currentDate = url.searchParams.get('current_date');

        if (!projectId) {
            return json({ error: 'Project ID is required' }, { status: 400 });
        }

        let query = supabase
            .from('sprints')
            .select('*')
            .eq('project_id', projectId);

        // Filter sprints based on date parameters
        if (afterDate) {
            // Upcoming sprints: start_date is after current date
            query = query.gt('start_date', afterDate);
        } else if (beforeDate) {
            // Past sprints: end_date is before current date
            query = query.lt('end_date', beforeDate);
        } else if (currentDate) {
            // Current sprints: current date is between start_date and end_date
            query = query
                .lte('start_date', currentDate)
                .gte('end_date', currentDate);
        }
        
        // Order appropriately based on filter
        if (afterDate) {
            // For upcoming sprints, order by start date (ascending)
            query = query.order('start_date', { ascending: true });
        } else if (beforeDate) {
            // For past sprints, order by end date (descending - most recently completed first)
            query = query.order('end_date', { ascending: false });
        } else {
            // Default order by start date (descending)
            query = query.order('start_date', { ascending: false });
        }
        
        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return json({ project: data }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}

export async function POST({ request }: RequestEvent) {
    try {
        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            console.error("Authentication error:", authError);
            return json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
        }
        
        const requestData = await request.json();
        console.log("Sprint creation request data:", requestData);
        
        // Validate required fields
        const { project_id, name, start_date, end_date } = requestData;
        
        if (!project_id) {
            console.log("Missing project_id in request:", requestData);
            return json({ 
                error: 'Missing required field: project_id is required' 
            }, { status: 400 });
        }
        
        if (!name || !start_date || !end_date) {
            return json({ 
                error: 'Missing required fields: name, start_date, and end_date are required' 
            }, { status: 400 });
        }
        
        // Insert new sprint
        const { data, error } = await supabase
            .from('sprints')
            .insert({
                project_id,
                name,
                start_date,
                end_date
            })
            .select()
            .single();
            
        if (error) {
            throw new Error(error.message);
        }
        
        return json({ id: data.id }, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}