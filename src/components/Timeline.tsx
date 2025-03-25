
import React from 'react';
import { TimelineItem as TimelineItemType } from '../lib/types';
import TimelineItem from './TimelineItem';
import { useIsMobile } from '../hooks/use-mobile';

interface TimelineProps {
  items: TimelineItemType[];
  onCommentAdded: () => void;
}

const Timeline: React.FC<TimelineProps> = ({ items, onCommentAdded }) => {
  const isMobile = useIsMobile();
  
  // Filter only visible items
  const visibleItems = items.filter(item => item.visible);

  if (visibleItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center animate-fade-in">
        <p className="text-lg text-muted-foreground">Nenhuma etapa disponível no momento.</p>
        <p className="text-sm text-muted-foreground mt-2">As etapas do projeto serão exibidas aqui quando disponíveis.</p>
      </div>
    );
  }

  return (
    <div className={`timeline-container animate-fade-in ${isMobile ? 'mobile-timeline' : ''}`}>
      {!isMobile && <div className="timeline-line" />}
      
      <div className={isMobile ? "flex flex-col space-y-6" : ""}>
        {visibleItems.map((item, index) => (
          <TimelineItem 
            key={item.id} 
            item={item} 
            position={isMobile ? 'full' : (index % 2 === 0 ? 'left' : 'right')}
            onCommentAdded={onCommentAdded}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;
