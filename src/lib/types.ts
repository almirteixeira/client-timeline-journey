
export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive' | 'completed';
  actualStatus: string; // Added to store the real status from ClickUp
  date: string;
  comments: Comment[];
  visible: boolean;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface ClickUpTask {
  id: string;
  name: string;
  description: string;
  status: {
    status: string;
  };
  date_created: string;
  due_date: string;
  date_updated: string;
  date_closed: string | null;
  comments: ClickUpComment[];
  custom_fields: any[];
  orderindex: number;
}

export interface ClickUpComment {
  id: string;
  comment_text: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
  date: string;
}

export interface ConfigContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  listId: string;
  setListId: (id: string) => void;
  visibleItems: string[];
  toggleItemVisibility: (id: string) => void;
  loading: boolean;
  error: string | null;
}
