// src/routes/api/backlog/[id]/+server.js
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

/**
 * PUT endpoint: Updates an existing backlog item.
 * The item is identified by its unique "id" provided in the URL parameters.
 * This endpoint accepts a JSON payload with the fields to update.
 */
export async function PUT({ request, params }) {
  // Extract the backlog item ID from URL parameters
  const { id } = params;

  if (!id) {
    return json({ error: 'Item ID is required' }, { status: 400 });
  }

  // Parse the updated fields from the request body
  const payload = await request.json();

  // Update the specified backlog item in the "user_stories" table
  const { data, error } = await supabase
    .from('user_stories')
    .update(payload)
    .eq('id', id);

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json({ message: 'Backlog item updated successfully', item: data }, { status: 200 });
}

/**
 * DELETE endpoint: Deletes an existing backlog item.
 * The item is identified by its unique "id" provided in the URL parameters.
 */
export async function DELETE({ params }) {
  // Extract the backlog item ID from URL parameters
  const { id } = params;

  if (!id) {
    return json({ error: 'Item ID is required' }, { status: 400 });
  }

  // Delete the specified backlog item from the "user_stories" table
  const { data, error } = await supabase
    .from('user_stories')
    .delete()
    .eq('id', id);

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json({ message: 'Backlog item deleted successfully', item: data }, { status: 200 });
}
