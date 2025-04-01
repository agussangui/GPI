import { json, error, type RequestEvent } from '@sveltejs/kit';

export async function GET({ params, url, locals }) {
    try {
        const sprintId = params.id;
        const projectId = url.searchParams.get('project_id');

        if (!sprintId) {
            throw error(400, 'Sprint ID is required');
        }

        if (!projectId) {
            throw error(400, 'Project ID is required');
        }

        const { data, error: dbError } = await locals.supabase
            .from('sprints')
            .select('*')
            .eq('id', sprintId)
            .eq('project_id', projectId)
            .single();

        if (dbError) {
            console.error('Database error:', dbError);
            throw error(500, 'Error fetching sprint');
        }

        if (!data) {
            throw error(404, 'Sprint not found');
        }
        
        return json({
            sprint: data
        });
    } catch (err) {
        console.error('Error fetching sprint:', err);
        throw error(500, 'Error fetching sprint');
    }
} 



export async function PUT(event: RequestEvent) {
    const { request, params } = event;
    const id = params.id;

    if (!id) {
        return json({ error: 'Sprint ID is required' }, { status: 400 });
    }

    try {
        const { name, start_date, end_date } = await request.json();
        const updatedFields: Record<string, any> = {};

        if (name !== undefined) updatedFields.name = name;
        if (start_date !== undefined) updatedFields.start_date = start_date;
        if (end_date !== undefined) updatedFields.end_date = end_date;

        if (Object.keys(updatedFields).length === 0) {
            return json({ error: 'No valid fields to update' }, { status: 400 });
        }

        const { data, error } = await event.locals.supabase
            .from('sprints')
            .update(updatedFields)
            .eq('id', id)
            .select()
            .single();


        if (error) {
            throw new Error(error.message);
        }

        return json({ message: 'Sprint updated successfully', sprint: data }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}

export async function DELETE(event: RequestEvent) {
    const { params } = event;
    const id = params.id;

    if (!id) {
        return json({ error: 'Sprint ID is required' }, { status: 400 });
    }

    try {
        const { error } = await event.locals.supabase
            .from('sprints')
            .delete() 
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }

        return json({ message: 'Sprint deleted successfully' }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}
