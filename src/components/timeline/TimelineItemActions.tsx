
import React from 'react';
import { Button } from '../ui/button';
import { CheckIcon, MessageCircleIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

interface TimelineItemActionsProps {
  expanded: boolean;
  toggleExpanded: () => void;
  toggleCommentForm: () => void;
  openCommentsDialog: () => void;
  handleApproveStage: () => void;
  commentsCount: number;
}

const TimelineItemActions: React.FC<TimelineItemActionsProps> = ({
  expanded,
  toggleExpanded,
  toggleCommentForm,
  openCommentsDialog,
  handleApproveStage,
  commentsCount
}) => {
  return (
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
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={openCommentsDialog}
          className="flex items-center text-sm"
        >
          <MessageCircleIcon size={16} className="mr-1" />
          <span>
            {commentsCount > 0 
              ? `Ver todos os comentários (${commentsCount})` 
              : "Comentários"}
          </span>
        </Button>
      
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
  );
};

export default TimelineItemActions;
