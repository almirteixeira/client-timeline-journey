
import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Convert status to lowercase for consistent comparison
  const statusLower = status.toLowerCase();
  
  // Determine the style based on status
  let classes = 'bg-gray-100 text-gray-800';
  let displayText = status;

  // Map status to appropriate colors
  if (statusLower.includes('complete') || 
      statusLower.includes('done') || 
      statusLower.includes('concluído')) {
    classes = 'bg-green-100 text-green-800';
  } else if (statusLower.includes('progress') || 
             statusLower.includes('andamento') || 
             statusLower.includes('active') || 
             statusLower.includes('ongoing') ||
             statusLower.includes('em análise')) {
    classes = 'bg-blue-100 text-blue-800';
  } else if (statusLower.includes('pending') || 
             statusLower.includes('pendente') ||
             statusLower.includes('inactive') ||
             statusLower.includes('aguardando')) {
    classes = 'bg-gray-100 text-gray-800';
  } else if (statusLower.includes('urgent') || 
             statusLower.includes('urgente') ||
             statusLower.includes('critical') ||
             statusLower.includes('crítico')) {
    classes = 'bg-red-100 text-red-800';
  } else if (statusLower.includes('review') || 
             statusLower.includes('revisão') ||
             statusLower.includes('testing') ||
             statusLower.includes('teste')) {
    classes = 'bg-yellow-100 text-yellow-800';
  }

  return (
    <span 
      className={`px-2 py-1 text-xs rounded-full ${classes}`}
    >
      {displayText}
    </span>
  );
};

export default StatusBadge;
