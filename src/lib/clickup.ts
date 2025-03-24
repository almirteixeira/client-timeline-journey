
import { ClickUpTask, TimelineItem, Comment } from './types';

const API_BASE_URL = 'https://api.clickup.com/api/v2';

export const fetchTasks = async (apiKey: string, listId: string): Promise<ClickUpTask[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/list/${listId}/task?include_comments=true`, {
      method: 'GET',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`ClickUp API error: ${response.status}`);
    }

    const data = await response.json();
    return data.tasks || [];
  } catch (error) {
    console.error('Error fetching tasks from ClickUp:', error);
    throw error;
  }
};

export const transformTasksToTimeline = (tasks: ClickUpTask[], visibleItems: string[]): TimelineItem[] => {
  return tasks.map(task => {
    const mappedComments: Comment[] = (task.comments || []).map(comment => ({
      id: comment.id,
      author: comment.user.username,
      text: comment.comment_text,
      date: new Date(parseInt(comment.date)).toLocaleString()
    }));

    let status: 'active' | 'inactive' | 'completed' = 'inactive';
    
    // Map ClickUp status to our timeline status
    if (task.status.status.toLowerCase().includes('complete') || 
        task.status.status.toLowerCase().includes('done')) {
      status = 'completed';
    } else if (task.status.status.toLowerCase().includes('progress') || 
               task.status.status.toLowerCase().includes('active') || 
               task.status.status.toLowerCase().includes('ongoing')) {
      status = 'active';
    }

    return {
      id: task.id,
      title: task.name,
      description: task.description || '',
      status,
      date: new Date(parseInt(task.date_created)).toLocaleString(),
      comments: mappedComments,
      visible: visibleItems.includes(task.id)
    };
  });
};

export const postComment = async (
  apiKey: string, 
  taskId: string, 
  text: string, 
  authorName: string
): Promise<any> => {
  try {
    // Prepend the author name to the comment
    const commentText = `[From ${authorName}]: ${text}`;
    
    const response = await fetch(`${API_BASE_URL}/task/${taskId}/comment`, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        comment_text: commentText
      })
    });

    if (!response.ok) {
      throw new Error(`ClickUp API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting comment to ClickUp:', error);
    throw error;
  }
};
