import React, { useState, useEffect } from 'react';
import { TimelineItem as TimelineItemType } from '../lib/types';
import { CheckIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useConfig } from '../context/ConfigContext';
import { postComment, fetchTaskComments } from '../lib/clickup';
import Comment from './Comment';
import CommentForm from './CommentForm';
import StatusBadge from './timeline/StatusBadge';
import TimelineItemActions from './timeline/TimelineItemActions';
import CommentsDialog from './timeline/CommentsDialog';

interface TimelineItemProps {
  item: TimelineItemType;
  position: 'left' | 'right' | 'full';
  onCommentAdded: () => void;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ item, position, onCommentAdded }) => {
  const [expanded, setExpanded] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showCommentsDialog, setShowCommentsDialog] = useState(false);
  const [comments, setComments] = useState(item.comments || []);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
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

  const loadComments = async () => {
    if (!showCommentsDialog) return;
    
    setIsLoadingComments(true);
    try {
      const fetchedComments = await fetchTaskComments(apiKey, item.id);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os comentários. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [showCommentsDialog, apiKey, item.id]);

  const handleDialogOpen = (open: boolean) => {
    setShowCommentsDialog(open);
    if (!open) {
      setComments(item.comments || []);
    }
  };

  const handleApproveStage = async () => {
    try {
      await postComment(apiKey, item.id, "Etapa aprovada pelo cliente", "Cliente");
      toast({
        title: "Etapa aprovada",
        description: "Sua aprovação foi registrada com sucesso.",
      });
      onCommentAdded();
      loadComments();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível registrar sua aprovação. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleCommentAdded = () => {
    onCommentAdded();
    loadComments();
  };

  return (
    <div className={`timeline-item ${position === 'right' ? 'flex-row-reverse' : ''} ${position === 'full' ? 'block w-full' : ''}`}>
      <div className={`timeline-content ${position === 'right' ? 'ml-auto' : position === 'left' ? 'mr-auto' : 'w-full'} animate-fade-in ${item.actualStatus === 'concluido' ? 'bg-green-50 border border-green-200 rounded-lg p-4' : item.actualStatus === 'aguardando cliente' ? 'bg-blue-50 border border-blue-200 rounded-lg p-4' : item.actualStatus === 'fazendo' ? 'bg-orange-50 border border-orange-200 rounded-lg p-4' : ''}`}>
        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
          <h3 className="font-medium text-lg">{item.title}</h3>
          <StatusBadge status={item.actualStatus} />
        </div>
        
        <p className="text-sm text-muted-foreground mb-2">{item.date}</p>
        
        {expanded && (
          <div className="mt-3 text-sm animate-slide-down">
            <p>{item.description || 'Sem descrição disponível.'}</p>
          </div>
        )}
        
        <TimelineItemActions 
          expanded={expanded}
          toggleExpanded={toggleExpanded}
          toggleCommentForm={toggleCommentForm}
          openCommentsDialog={() => setShowCommentsDialog(true)}
          handleApproveStage={handleApproveStage}
          commentsCount={comments.length}
          disabled={item.actualStatus === 'concluido'}
        />
        
        {(showComments && comments.length > 0) && (
          <div className="comment-section mt-4 animate-slide-up">
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Comentários ({comments.length})</h4>
              <div className="space-y-2">
                {comments.map(comment => (
                  <Comment key={comment.id} comment={comment} />
                ))}
              </div>
            </div>
          </div>
        )}
        
        {showCommentForm && (
          <div className="comment-form-section mt-4 animate-slide-up">
            <CommentForm taskId={item.id} onCommentAdded={handleCommentAdded} />
          </div>
        )}
        
        <CommentsDialog 
          open={showCommentsDialog}
          onOpenChange={handleDialogOpen}
          title={item.title}
          comments={comments}
          isLoading={isLoadingComments}
          taskId={item.id}
          onCommentAdded={handleCommentAdded}
        />
      </div>
      
      {position !== 'full' && (
        <div className={`timeline-dot ${item.status}`}>
          {item.status === 'completed' && (
            <CheckIcon size={12} className="absolute inset-0 m-auto text-white" />
          )}
        </div>
      )}
    </div>
  );
};

export default TimelineItem;
