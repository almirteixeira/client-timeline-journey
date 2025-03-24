
import React from 'react';
import { Comment as CommentType } from '../lib/types';

interface CommentProps {
  comment: CommentType;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  // Check if this is an approval comment
  const isApprovalComment = comment.text.includes("Etapa aprovada pelo cliente");
  
  return (
    <div className={`p-4 mb-3 rounded-lg ${isApprovalComment ? 'bg-green-50 border border-green-200' : 'bg-secondary'} animate-fade-in`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className={`font-medium text-sm ${isApprovalComment ? 'text-green-700' : ''}`}>
          {comment.author}
        </h4>
        <span className="text-xs text-muted-foreground">{comment.date}</span>
      </div>
      <p className={`text-sm ${isApprovalComment ? 'text-green-600 font-medium' : ''}`}>
        {comment.text}
      </p>
    </div>
  );
};

export default Comment;
