
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useConfig } from '../context/ConfigContext';
import { fetchTasks, transformTasksToTimeline, getList } from '../lib/clickup';
import Timeline from '../components/Timeline';
import TimelineDashboard from '../components/TimelineDashboard';
import { TimelineItem } from '../lib/types';
import { Loader2 } from 'lucide-react';

const TimelinePage: React.FC = () => {
  const location = useLocation();
  const { apiKey, listId, visibleItems } = useConfig();
  const { toast } = useToast();
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [listName, setListName] = useState<string>('');
  
  // Get the project ID from the URL query parameter
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get('id') || listId;

  const loadTimelineData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use projectId from URL if available, otherwise fallback to listId from context
      const idToUse = projectId || listId;
      const [tasks, listDetails] = await Promise.all([
        fetchTasks(apiKey, idToUse),
        getList(apiKey, idToUse)
      ]);
      const transformedTasks = transformTasksToTimeline(tasks, visibleItems);
      setTimelineItems(transformedTasks);
      setListName(listDetails.name);
    } catch (error) {
      console.error('Error loading timeline data:', error);
      setError('Não foi possível carregar os dados da timeline. Por favor, tente novamente mais tarde.');
      toast({
        title: "Erro",
        description: "Não foi possível carregar as etapas do projeto.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Use projectId from URL if available, otherwise use listId from context
    const idToUse = projectId || listId;
    if (apiKey && idToUse) {
      loadTimelineData();
    } else {
      setLoading(false);
      setError('Configuração incompleta. Por favor, entre em contato com o administrador.');
    }
  }, [apiKey, listId, projectId, visibleItems, location.search]);

  const handleCommentAdded = () => {
    // Reload timeline data when a comment is added
    loadTimelineData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
        <p className="text-lg text-muted-foreground">Carregando timeline do projeto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Ops! Algo deu errado</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-timeline-bg pt-12 pb-24 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">{listName || 'Timeline do Projeto'}</h1>
          {projectId && (
            <div className="hidden mb-4 py-2 px-4 bg-secondary inline-block rounded-md animate-fade-in">
              <span className="font-medium">ID do Projeto:</span> {projectId}
            </div>
          )}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up">
            Acompanhe o desenvolvimento do seu projeto.
          </p>
        </header>

        {/* Add the new dashboard component */}
        <TimelineDashboard items={timelineItems} />
        
        {/* Existing timeline component */}
        <Timeline items={timelineItems} onCommentAdded={handleCommentAdded} />
      </div>
    </div>
  );
};

export default TimelinePage;
