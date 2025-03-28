import { json, type RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
    const { params, url } = event;
    const id = params.id;
    const projectId = url.searchParams.get('project_id');

    if (!id || !projectId) {
        return json({ error: 'Sprint ID and Project ID are required' }, { status: 400 });
    }

    try {
        const { data: sprint, error: sprintError } = await event.locals.supabase
            .from('sprints')
            .select('*')
            .eq('id', id)
            .eq('project_id', projectId)
            .single();

        if (sprintError) {
            throw new Error(sprintError.message);
        }

        if (!sprint) {
            return json({ error: 'Sprint not found' }, { status: 404 });
        }

        const { data: stories, error: storiesError } = await event.locals.supabase
            .from('user_stories')
            .select('*')
            .eq('sprint_id', id)
            .eq('project_id', projectId);

        if (storiesError) {
            throw new Error(storiesError.message);
        }

        const totalPoints = stories.reduce((sum, story) => sum + story.story_points, 0);
        
        const startDate = new Date(sprint.start_date);
        const endDate = new Date(sprint.end_date);
        
        const days: Date[] = [];
        const currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            days.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        const idealBurndown = days.map((day, index) => {
            const totalDays = days.length - 1;
            return {
                date: day.toISOString().split('T')[0],
                points: totalPoints - (totalPoints * (index / totalDays))
            };
        });
        
        const dailyCompletedPoints = days.map((day, index) => {
            const dayFormatted = day.toISOString().split('T')[0];
            
            const pointsCompletedToday = stories.reduce((sum, story) => {
                if (
                    story.completion_date && 
                    new Date(story.completion_date).toISOString().split('T')[0] === dayFormatted
                ) {
                    return sum + story.story_points;
                }
                return sum;
            }, 0);
            
            return {
                date: dayFormatted,
                points: pointsCompletedToday
            };
        });
        
        const actualBurndown = days.map(day => {
            const dayFormatted = day.toISOString().split('T')[0];
            
            const remainingPoints = stories.reduce((sum, story) => {
                if (
                    !story.completion_date || 
                    new Date(story.completion_date).toISOString().split('T')[0] > dayFormatted
                ) {
                    return sum + story.story_points;
                }
                return sum;
            }, 0);
            
            return {
                date: dayFormatted,
                points: remainingPoints
            };
        });

        return json({ 
            sprint_id: id,
            project_id: projectId,
            total_points: totalPoints,
            ideal_burndown: idealBurndown,
            actual_burndown: actualBurndown,
            daily_completed_points: dailyCompletedPoints,
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0]
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
} 