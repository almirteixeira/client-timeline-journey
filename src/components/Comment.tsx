
import React from 'react';
import { Comment as CommentType } from '../lib/types';

interface CommentProps {
  comment: CommentType;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <div className="p-4 mb-3 rounded-lg bg-secondary animate-fade-in">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm">{comment.author}</h4>
        <span className="text-xs text-muted-foreground">{comment.date}</span>
      </div>
      <p className="text-sm">{comment.text}</p>
    </div>
  );
};

export default Comment;
