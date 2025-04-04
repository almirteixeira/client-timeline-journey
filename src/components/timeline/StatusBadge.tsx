
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

  // Map status to appropriate colors with extended terms
  if (statusLower.includes('complete') || 
      statusLower.includes('done') || 
      statusLower.includes('concluído') ||
      statusLower.includes('feito') || 
      statusLower.includes('completed') || 
      statusLower.includes('finalizado') ||
      statusLower === 'concluido') {
    classes = 'bg-green-800 text-white';
  } else if (statusLower.includes('aguardando cliente')) {
    classes = 'bg-blue-800 text-white';
  } else if (statusLower.includes('progress') || 
             statusLower.includes('andamento') || 
             statusLower.includes('active') || 
             statusLower.includes('ongoing') ||
             statusLower.includes('em análise') ||
             statusLower.includes('em execução') ||
             statusLower.includes('fazendo')) {
    classes = 'bg-orange-800 text-white';
  } else if (statusLower.includes('pending') || 
             statusLower.includes('pendente') ||
             statusLower.includes('inactive') ||
             statusLower.includes('aguardando')) {
    classes = 'bg-gray-100 text-gray-800';
  } else if (statusLower.includes('urgent') || 
             statusLower.includes('urgente') ||
             statusLower.includes('critical') ||
             statusLower.includes('crítico') ||
             statusLower.includes('alta prioridade')) {
    classes = 'bg-red-100 text-red-800';
  } else if (statusLower.includes('review') || 
             statusLower.includes('revisão') || 
             statusLower.includes('testing') ||
             statusLower.includes('teste') ||
             statusLower.includes('revisando')) {
    classes = 'bg-yellow-100 text-yellow-800';
  }

  // Add debug log to check what statuses are being processed
  console.log('Status badge processing:', status, 'Resulting class:', classes);

  return (
    <span 
      className={`px-2 py-1 text-xs font-medium rounded-full ${classes}`}
    >
      {displayText}
    </span>
  );
};

export default StatusBadge;
