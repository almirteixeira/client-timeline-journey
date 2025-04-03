
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel';

const Admin: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get('id');
  
  // Determine the link based on whether we have a project ID
  const timelineLink = projectId ? `/timeline?id=${projectId}` : '/timeline';

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 animate-fade-in">Área do Administrador</h1>
            <p className="text-muted-foreground animate-slide-up">
              Configure a timeline do cliente e gerencie a visibilidade das etapas.
            </p>
          </div>
          <Link 
            to={timelineLink} 
            className="py-2 px-4 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors duration-200"
          >
            Ver Timeline
          </Link>
        </header>

        <AdminPanel />
      </div>
    </div>
  );
};

export default Admin;
