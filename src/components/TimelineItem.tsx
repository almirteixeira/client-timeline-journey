
import React, { useState } from 'react';
import { TimelineItem as TimelineItemType } from '../lib/types';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, MessageCircleIcon } from 'lucide-react';
import Comment from './Comment';
import CommentForm from './CommentForm';

interface TimelineItemProps {
  item: TimelineItemType;
  position: 'left' | 'right';
  onCommentAdded: () => void;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ item, position, onCommentAdded }) => {
  const [expanded, setExpanded] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const toggleCommentForm = () => {
    setShowCommentForm(!showCommentForm);
  };

  const statusToClass = {
    active: 'bg-timeline-item-active',
    inactive: 'bg-timeline-item-inactive',
    completed: 'bg-timeline-item-completed'
  };

  return (
    <div className={`timeline-item ${position === 'right' ? 'flex-row-reverse' : ''}`}>
      <div className={`timeline-content ${position === 'right' ? 'ml-auto' : 'mr-auto'} animate-fade-in`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{item.title}</h3>
          <span 
            className={`px-2 py-1 text-xs rounded-full ${
              item.status === 'completed' ? 'bg-green-100 text-green-800' :
              item.status === 'active' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}
          >
            {item.status === 'completed' ? 'Concluído' : 
             item.status === 'active' ? 'Em Progresso' : 
             'Pendente'}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-2">{item.date}</p>
        
        {expanded && (
          <div className="mt-3 text-sm animate-slide-down">
            <p>{item.description || 'Sem descrição disponível.'}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <button 
            onClick={toggleExpanded}
            className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors duration-200"
          >
            {expanded ? (
              <>
                <ChevronUpIcon size={16} className="mr-1" />
                <span>Menos detalhes</span>
              </>
            ) : (
              <>
                <ChevronDownIcon size={16} className="mr-1" />
                <span>Mais detalhes</span>
              </>
            )}
          </button>
          
          <button
            onClick={toggleCommentForm}
            className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors duration-200"
          >
            <MessageCircleIcon size={16} className="mr-1" />
            <span>Comentar</span>
          </button>
        </div>
        
        {(item.comments.length > 0 || showCommentForm) && (
          <div className="comment-section animate-slide-up">
            {item.comments.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Comentários ({item.comments.length})</h4>
                <div className="space-y-2">
                  {item.comments.map(comment => (
                    <Comment key={comment.id} comment={comment} />
                  ))}
                </div>
              </div>
            )}
            
            {showCommentForm && (
              <CommentForm taskId={item.id} onCommentAdded={onCommentAdded} />
            )}
          </div>
        )}
      </div>
      
      <div className={`timeline-dot ${item.status}`}>
        {item.status === 'completed' && (
          <CheckIcon size={12} className="absolute inset-0 m-auto text-white" />
        )}
      </div>
    </div>
  );
};

export default TimelineItem;
