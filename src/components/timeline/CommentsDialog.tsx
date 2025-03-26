
import React from 'react';
import { Loader2Icon } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '../ui/dialog';
import Comment from '../Comment';
import CommentForm from '../CommentForm';
import { Comment as CommentType } from '../../lib/types';

interface CommentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  comments: CommentType[];
  isLoading: boolean;
  taskId: string;
  onCommentAdded: () => void;
}

const CommentsDialog: React.FC<CommentsDialogProps> = ({
  open,
  onOpenChange,
  title,
  comments,
  isLoading,
  taskId,
  onCommentAdded
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Comentários - {title}</DialogTitle>
          <DialogDescription>
            Visualize e adicione comentários para esta etapa do projeto
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Carregando comentários...</span>
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-4 py-4">
            {comments.map(comment => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum comentário disponível.</p>
          </div>
        )}
        
        <div className="mt-6 border-t pt-4">
          <CommentForm taskId={taskId} onCommentAdded={onCommentAdded} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentsDialog;
