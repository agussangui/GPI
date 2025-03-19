import { json, type RequestEvent } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function PUT(event: RequestEvent) {
    const { request, params } = event;
    const id = params.id;

    if (!id) {
        return json({ error: 'User story ID is required' }, { status: 400 });
    }

    try {
        const { title, description, sprint_id, status_id, priority, story_points } = await request.json();
        const updatedFields: Record<string, any> = {};

        if (title !== undefined) updatedFields.title = title;
        if (description !== undefined) updatedFields.description = description;
        if (sprint_id !== undefined) updatedFields.sprint_id = sprint_id;
        if (priority !== undefined) updatedFields.priority = priority;
        if (story_points !== undefined) updatedFields.story_points = story_points;

        if (status_id !== undefined) {
            updatedFields.status_id = `${status_id}`;
        }

        if (Object.keys(updatedFields).length === 0) {
            return json({ error: 'No valid fields to update' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('user_stories')
            .update(updatedFields)
            .eq('id', id)
            .select()
            .single();


        if (error) {
            throw new Error(error.message);
        }

        return json({ message: 'User story updated successfully', user_story: data }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}

export async function DELETE(event: RequestEvent) {
    const { params } = event;
    const id = params.id;

    if (!id) {
        return json({ error: 'User story ID is required' }, { status: 400 });
    }

    try {
        const { error } = await supabase
            .from('user_stories')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }

        return json({ message: 'User story deleted successfully' }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}
