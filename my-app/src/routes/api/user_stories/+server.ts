import { json, type RequestEvent } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function POST(event: RequestEvent) {
    const { request } = event;

    try {
        const { project_id, sprint_id, title, description, priority, story_points } = await request.json();

        if (!project_id || !title || priority === undefined) {
            return json({ error: 'Project ID, title, and priority are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('user_stories')
            .insert([
                {
                    project_id,
                    sprint_id: sprint_id || null,
                    title,
                    description: description || null,
                    priority,
                    story_points: story_points || null,
                }
            ])
            .select()
            .single();
        
        if (error) {
            throw new Error(error.message);
        }

        return json({ message: 'User story created successfully', user_story: data }, { status: 201 });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('user_stories')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return json(data, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}

/**
 * POST endpoint: Adds a new backlog item.
 * This endpoint expects a JSON payload containing the details of the new item.
 * The "sprint" field is set to 0 by default to indicate that the item belongs to the backlog.
 */
