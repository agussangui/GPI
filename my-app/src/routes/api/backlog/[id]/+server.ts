// src/routes/api/backlog/[id]/+server.ts
import { json, type RequestEvent } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

/**
 * PUT endpoint: Updates an existing backlog item.
 * The item is identified by its unique "id" provided in the URL parameters.
 * This endpoint accepts a JSON payload with the fields to update.
 */
export async function PUT(event: RequestEvent) {
    const { request, params } = event; // Extract event properties correctly
    const id = params.id;

    if (!id) {
        return json({ error: 'Item ID is required' }, { status: 400 });
    }

    try {
        // Parse the updated fields from the request body
        const payload = await request.json();

        // Update the specified backlog item in the "user_stories" table
        const { data, error } = await supabase
            .from('user_stories')
            .update(payload)
            .eq('id', id)
            .select();

        if (error) {
            throw new Error(error.message); // Explicitly throw an Error
        }

        return json({ message: 'Backlog item updated successfully', item: data }, { status: 200 });
    } catch (error) {
        // Ensure error is treated as an Error object
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}

/**
 * DELETE endpoint: Deletes an existing backlog item.
 * The item is identified by its unique "id" provided in the URL parameters.
 */
export async function DELETE(event: RequestEvent) {
    const { params } = event;
    const id = params.id;

    if (!id) {
        return json({ error: 'Item ID is required' }, { status: 400 });
    }

    try {
        // Delete the specified backlog item from the "user_stories" table
        const { data, error } = await supabase
            .from('user_stories')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }

        return json({ message: 'Backlog item deleted successfully', item: data }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}