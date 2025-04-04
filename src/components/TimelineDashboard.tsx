
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { TimelineItem } from '../lib/types';
import { BarChartIcon, CheckIcon, ClipboardListIcon, FileIcon, FolderIcon, Clock3Icon } from 'lucide-react';
import { Button } from './ui/button';

interface TimelineDashboardProps {
  items: TimelineItem[];
}

const TimelineDashboard: React.FC<TimelineDashboardProps> = ({ items }) => {
  // Calculate statistics
  const totalTasks = items.length;
  const completedTasks = items.filter(item => item.actualStatus === 'concluido').length;
  const activeTasks = items.filter(item => item.actualStatus === 'aguardando cliente' || item.actualStatus === 'fazendo');
  const pendingTasks = items.filter(item => item.status === 'inactive').length;
  
  // Calculate completion percentage
  const completionPercentage = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in">
      {/* Task Stats Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <ClipboardListIcon className="mr-2 h-5 w-5" />
            Resumo de Tarefas
          </CardTitle>
          <CardDescription>Visão geral do progresso do projeto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total de Tarefas</span>
              <span className="font-bold">{totalTasks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tarefas Concluídas</span>
              <span className="font-bold text-green-600">{completedTasks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tarefas Pendentes</span>
              <span className="font-bold text-yellow-600">{pendingTasks}</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Progresso Geral</span>
                <span className="text-sm font-medium">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Tasks Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Clock3Icon className="mr-2 h-5 w-5" />
            Em Andamento
          </CardTitle>
          <CardDescription>Tarefas atualmente ativas</CardDescription>
        </CardHeader>
        <CardContent>
          {activeTasks.length > 0 ? (
            <div className="space-y-3 max-h-[150px] overflow-y-auto">
              {activeTasks.map(task => (
                <div key={task.id} className={`p-2 rounded-md ${task.actualStatus === 'fazendo' ? 'bg-orange-50' : 'bg-blue-50'}`}>
                  <div className="font-medium text-sm">{task.title}</div>
                  <div className="text-xs text-muted-foreground">Iniciado em: {task.date}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[150px] text-center">
              <p className="text-sm text-muted-foreground">Nenhuma tarefa em andamento no momento.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Resources Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <FolderIcon className="mr-2 h-5 w-5" />
            Recursos do Projeto
          </CardTitle>
          <CardDescription>Links e arquivos importantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              id="info"
            >
              <FileIcon className="mr-2 h-4 w-4" />
              <span>Informações do Projeto</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              id="arquivos"
            >
              <FolderIcon className="mr-2 h-4 w-4" />
              <span>Arquivos no Google Drive</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              id="treinamento"
            >
              <BarChartIcon className="mr-2 h-4 w-4" />
              <span>Treinamento</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelineDashboard;
