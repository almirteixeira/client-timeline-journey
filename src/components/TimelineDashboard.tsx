
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { TimelineItem } from '../lib/types';
import { BarChartIcon, CheckIcon, ClipboardListIcon, FileIcon, FolderIcon, Clock3Icon } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useConfig } from '../context/ConfigContext';
import { getList } from '../lib/clickup';

interface TimelineDashboardProps {
  items: TimelineItem[];
}

const TimelineDashboard: React.FC<TimelineDashboardProps> = ({ items }) => {
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [projectInfo, setProjectInfo] = useState<{ content?: string }>({});
  const { apiKey, listId } = useConfig();

  const handleShowInfo = async () => {
    try {
      const listDetails = await getList(apiKey, listId);
      setProjectInfo(listDetails);
      setShowInfoDialog(true);
    } catch (error) {
      console.error('Error fetching project info:', error);
    }
  };
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
              className="w-full justify-start mt-5"
              id="info"
              onClick={handleShowInfo}
            >
              <FileIcon className="mr-2 h-4 w-4" />
              <span>Informações do Projeto</span>
            </Button>

            <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Informações do Projeto</DialogTitle>
                  <DialogDescription className="whitespace-pre-wrap">
                    {projectInfo.content || 'Nenhuma informação disponível.'}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline" 
              className="hidden w-full justify-start"
              id="arquivos"
            >
              <FolderIcon className="mr-2 h-4 w-4" />
              <span>Arquivos no Google Drive</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="disabled w-full justify-start"
              id="suporte"
              onClick={() => window.open('https://forms.clickup.com/3052452/f/2x4x4-46793/MM982F2ZY6V5ML9TRZ', '_blank')}
            >
              <BarChartIcon className="mr-2 h-4 w-4" />
              <span>Suporte</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelineDashboard;
