import { json, error } from '@sveltejs/kit';

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