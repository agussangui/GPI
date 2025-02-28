// src/routes/api/backlog/+server.js
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

/**
 * GET endpoint: Retrieves all backlog items.
 * This endpoint queries the "user_stories" table for records where the "sprint" column equals 0,
 * which indicates that the item is still in the backlog.
 */
export async function GET() {
  const { data, error } = await supabase
    .from('user_stories')
    .select('*')
    .eq('sprint', 0)
    .order('created_at', { ascending: false });

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json(data, { status: 200 });
}

/**
 * POST endpoint: Adds a new backlog item.
 * This endpoint expects a JSON payload containing the details of the new item.
 * The "sprint" field is set to 0 by default to indicate that the item belongs to the backlog.
 */
export async function POST({ request }) {
  // Parse the incoming JSON payload from the request body
  const {
    title,
    description,
    priority,
    difficulty,
    time_estimation,
    real_time,
    requester,
    owner
  } = await request.json();

  // Validate that the required field "title" is provided
  if (!title) {
    return json({ error: 'Title is required' }, { status: 400 });
  }

  // Insert a new record into the "user_stories" table with default state 'to do'
  const { data, error } = await supabase
    .from('user_stories')
    .insert([{
      title,
      description,
      priority,
      difficulty,
      time_estimation,
      real_time,
      state: 'to do', // Default state for a new backlog item
      requester,
      owner,
      sprint: 0      // 0 indicates the item is in the backlog
    }]);

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json({ message: 'Backlog item added successfully', item: data }, { status: 201 });
}
