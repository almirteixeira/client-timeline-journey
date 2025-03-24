
import React, { useState } from 'react';
import { TimelineItem as TimelineItemType } from '../lib/types';
import { CheckIcon, MessageCircleIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useConfig } from '../context/ConfigContext';
import { postComment } from '../lib/clickup';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { Button } from './ui/button';

interface TimelineItemProps {
  item: TimelineItemType;
  position: 'left' | 'right';
  onCommentAdded: () => void;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ item, position, onCommentAdded }) => {
  const [expanded, setExpanded] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();
  const { apiKey } = useConfig();

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const toggleCommentForm = () => {
    setShowCommentForm(!showCommentForm);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleApproveStage = async () => {
    try {
      await postComment(apiKey, item.id, "Etapa aprovada pelo cliente", "Cliente");
      toast({
        title: "Etapa aprovada",
        description: "Sua aprovação foi registrada com sucesso.",
      });
      onCommentAdded();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível registrar sua aprovação. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Map status to display text and style classes
  const statusMap = {
    completed: { text: 'Concluído', classes: 'bg-green-100 text-green-800' },
    active: { text: 'Em Progresso', classes: 'bg-blue-100 text-blue-800' },
    inactive: { text: 'Pendente', classes: 'bg-gray-100 text-gray-800' }
  };

  return (
    <div className={`timeline-item ${position === 'right' ? 'flex-row-reverse' : ''}`}>
      <div className={`timeline-content ${position === 'right' ? 'ml-auto' : 'mr-auto'} animate-fade-in`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{item.title}</h3>
          <span 
            className={`px-2 py-1 text-xs rounded-full ${statusMap[item.status].classes}`}
          >
            {statusMap[item.status].text}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-2">{item.date}</p>
        
        {expanded && (
          <div className="mt-3 text-sm animate-slide-down">
            <p>{item.description || 'Sem descrição disponível.'}</p>
          </div>
        )}
        
        <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleExpanded}
            className="flex items-center text-sm"
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
          </Button>
          
          <div className="flex gap-2">
            {item.comments.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleComments}
                className="flex items-center text-sm"
              >
                <MessageCircleIcon size={16} className="mr-1" />
                <span>{showComments ? "Ocultar comentários" : `Ver comentários (${item.comments.length})`}</span>
              </Button>
            )}
          
            <Button
              variant="outline"
              size="sm"
              onClick={toggleCommentForm}
              className="flex items-center text-sm"
            >
              <MessageCircleIcon size={16} className="mr-1" />
              <span>Comentar</span>
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={handleApproveStage}
              className="flex items-center text-sm"
            >
              <CheckIcon size={16} className="mr-1" />
              <span>Aprovar</span>
            </Button>
          </div>
        </div>
        
        {(showComments && item.comments.length > 0) && (
          <div className="comment-section mt-4 animate-slide-up">
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Comentários ({item.comments.length})</h4>
              <div className="space-y-2">
                {item.comments.map(comment => (
                  <Comment key={comment.id} comment={comment} />
                ))}
              </div>
            </div>
          </div>
        )}
        
        {showCommentForm && (
          <div className="comment-form-section mt-4 animate-slide-up">
            <CommentForm taskId={item.id} onCommentAdded={onCommentAdded} />
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
