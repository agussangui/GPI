import { json, type RequestEvent } from '@sveltejs/kit';
import { SprintStatusEnum } from '$models/sprintStatusEnum';

export async function GET(event: RequestEvent) {
    try {
        // Get the user from locals
        const user = event.locals.user;
        
        if (!user) {
            return json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
        }
        
        const projectId = event.url.searchParams.get('project_id');
        const afterDate = event.url.searchParams.get('after_date');
        const beforeDate = event.url.searchParams.get('before_date');
        const currentDate = event.url.searchParams.get('current_date');

        if (!projectId) {
            return json({ error: 'Project ID is required' }, { status: 400 });
        }

        let query = event.locals.supabase
            .from('sprints')
            .select('*')
            .eq('project_id', projectId);

        if (afterDate) {
            query = query.gt('start_date', afterDate);
        } else if (beforeDate) {
            query = query.lt('end_date', beforeDate);
        } else if (currentDate) {
            query = query
                .lte('start_date', currentDate)
                .gte('end_date', currentDate);
        }
        
        if (afterDate) {
            query = query.order('start_date', { ascending: true });
        } else if (beforeDate) {
            query = query.order('end_date', { ascending: false });
        } else {
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

export async function POST(event: RequestEvent) {
    try {
        // Get the user from locals
        const user = event.locals.user;
        
        if (!user) {
            console.error("Authentication error: No authenticated user");
            return json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
        }
        
        const requestData = await event.request.json();
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
        
        // Check for date conflicts with existing sprints
        const newStartDate = new Date(start_date);
        const newEndDate = new Date(end_date);
        
        // Find existing sprints for this project
        const { data: existingSprints, error: sprintError } = await event.locals.supabase
            .from('sprints')
            .select('*')
            .eq('project_id', project_id);
            
        if (sprintError) {
            throw new Error(sprintError.message);
        }
        
        // Check for overlapping date ranges
        const hasConflict = existingSprints.some(sprint => {
            const sprintStartDate = new Date(sprint.start_date);
            const sprintEndDate = new Date(sprint.end_date);
            
            // Check if dates overlap
            return (newStartDate <= sprintEndDate && newEndDate >= sprintStartDate);
        });
        
        if (hasConflict) {
            return json({ 
                error: 'Date conflict: This sprint overlaps with an existing sprint. Please choose different dates.' 
            }, { status: 409 }); // 409 Conflict
        }
        
        // Insert new sprint
        const { data, error } = await event.locals.supabase
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