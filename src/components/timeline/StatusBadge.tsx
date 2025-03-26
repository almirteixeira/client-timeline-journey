
import React from 'react';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'completed';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Map status to display text and style classes
  const statusMap = {
    completed: { text: 'Concluído', classes: 'bg-green-100 text-green-800' },
    active: { text: 'Em Progresso', classes: 'bg-blue-100 text-blue-800' },
    inactive: { text: 'Pendente', classes: 'bg-gray-100 text-gray-800' }
  };

  return (
    <span 
      className={`px-2 py-1 text-xs rounded-full ${statusMap[status].classes}`}
    >
      {statusMap[status].text}
    </span>
  );
};

export default StatusBadge;
