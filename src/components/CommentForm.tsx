
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useConfig } from '../context/ConfigContext';
import { postComment } from '../lib/clickup';

interface CommentFormProps {
  taskId: string;
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ taskId, onCommentAdded }) => {
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { apiKey } = useConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!author.trim() || !comment.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu nome e comentário.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await postComment(apiKey, taskId, comment, author);
      
      toast({
        title: "Comentário enviado",
        description: "Seu comentário foi enviado com sucesso.",
      });
      
      setAuthor('');
      setComment('');
      onCommentAdded();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar seu comentário. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="space-y-2">
        <label htmlFor="author" className="block text-sm font-medium">
          Seu Nome
        </label>
        <input
          id="author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200"
          placeholder="Digite seu nome"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="comment" className="block text-sm font-medium">
          Comentário
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200 min-h-[100px]"
          placeholder="Escreva seu comentário..."
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-200 ${
          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Comentário'}
      </button>
    </form>
  );
};

export default CommentForm;
