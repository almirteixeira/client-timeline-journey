
import { ClickUpTask, TimelineItem, Comment, ClickUpComment } from './types';

const API_BASE_URL = 'https://api.clickup.com/api/v2';

export const fetchTasks = async (apiKey: string, listId: string): Promise<ClickUpTask[]> => {
  try {
    // Set include_comments=true to get comments with the tasks
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

export const fetchTaskComments = async (apiKey: string, taskId: string): Promise<Comment[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/task/${taskId}/comment`, {
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
    
    // Map the ClickUp comment format to our Comment format
    return (data.comments || []).map((comment: ClickUpComment) => ({
      id: comment.id,
      author: comment.user.username,
      text: comment.comment_text,
      date: new Date(parseInt(comment.date)).toLocaleString()
    }));
  } catch (error) {
    console.error('Error fetching comments from ClickUp:', error);
    return [];
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

    // Map status directly without transforming to our own status values
    let status: 'active' | 'inactive' | 'completed';
    
    // Determine timeline status for internal tracking
    if (task.status.status.toLowerCase().includes('complete') || 
        task.status.status.toLowerCase().includes('done')) {
      status = 'completed';
    } else if (task.status.status.toLowerCase().includes('progress') || 
               task.status.status.toLowerCase().includes('active') || 
               task.status.status.toLowerCase().includes('ongoing')) {
      status = 'active';
    } else {
      status = 'inactive';
    }

    // Set all items as visible by default, but use the visibleItems array if it has elements
    const isVisible = visibleItems.length === 0 ? true : visibleItems.includes(task.id);

    return {
      id: task.id,
      title: task.name,
      description: task.description || '',
      status,
      actualStatus: task.status.status, // Store the actual status string from ClickUp
      date: new Date(parseInt(task.date_created)).toLocaleString(),
      comments: mappedComments,
      visible: isVisible
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
