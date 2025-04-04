
import { ClickUpTask, TimelineItem, Comment, ClickUpComment } from './types';

const API_BASE_URL = 'https://api.clickup.com/api/v2';

export const getList = async (apiKey: string, listId: string): Promise<{ name: string, content?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/list/${listId}`, {
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
    return { name: data.name, content: data.content };
  } catch (error) {
    console.error('Error fetching list from ClickUp:', error);
    throw error;
  }
};

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
    console.log('Tasks fetched:', data.tasks);
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
  // Ordenar as tarefas primeiro por data de vencimento e depois pela ordem do ClickUp
  const sortedTasks = [...tasks].sort((a, b) => {
    // Primeiro, ordenar por data de vencimento
    const dateA = a.due_date ? parseInt(a.due_date) : Infinity;
    const dateB = b.due_date ? parseInt(b.due_date) : Infinity;
    if (dateA !== dateB) {
      return dateA - dateB;
    }
    // Se as datas forem iguais, usar a ordem do ClickUp
    return a.orderindex - b.orderindex;
  });
  return sortedTasks.map(task => {
    const mappedComments: Comment[] = (task.comments || []).map(comment => ({
      id: comment.id,
      author: comment.user.username,
      text: comment.comment_text,
      date: new Date(parseInt(comment.date)).toLocaleString()
    }));

    // Log the actual status from ClickUp to help with debugging
    console.log('Task status from ClickUp:', task.name, task.status.status);
    
    // Map status directly without transforming to our own status values
    let status: 'active' | 'inactive' | 'completed';
    
    // Normalize to lowercase for consistent comparison
    const taskStatusLower = task.status.status.toLowerCase();
    
    // Determine timeline status for internal tracking with more comprehensive checks
    if (taskStatusLower.includes('complete') || 
        taskStatusLower.includes('done') || 
        taskStatusLower.includes('feito') || 
        taskStatusLower.includes('concluído') ||
        taskStatusLower.includes('completed') ||
        taskStatusLower.includes('finalizado')) {
      status = 'completed';
    } else if (taskStatusLower.includes('progress') || 
               taskStatusLower.includes('andamento') || 
               taskStatusLower.includes('active') || 
               taskStatusLower.includes('ongoing') ||
               taskStatusLower.includes('em execução')) {
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
      date: new Date(parseInt(task.due_date)).toLocaleDateString(),
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
