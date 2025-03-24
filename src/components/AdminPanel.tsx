
import React, { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { ClickUpTask } from '../lib/types';
import { fetchTasks } from '../lib/clickup';
import { useToast } from '@/hooks/use-toast';
import { CheckIcon, Eye, EyeOff, RefreshCwIcon, SaveIcon } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { 
    apiKey, 
    setApiKey, 
    listId, 
    setListId, 
    visibleItems, 
    toggleItemVisibility 
  } = useConfig();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<ClickUpTask[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [tempApiKey, setTempApiKey] = useState<string>(apiKey);
  const [tempListId, setTempListId] = useState<string>(listId);

  const fetchTasksList = async () => {
    if (!apiKey || !listId) {
      toast({
        title: "Configuração incompleta",
        description: "Preencha a API Key e o ID da Lista para buscar as tarefas.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const fetchedTasks = await fetchTasks(apiKey, listId);
      setTasks(fetchedTasks);
      toast({
        title: "Sucesso",
        description: `${fetchedTasks.length} tarefas carregadas com sucesso.`
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Erro",
        description: "Não foi possível buscar as tarefas. Verifique suas credenciais.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = () => {
    setSaving(true);
    
    // Small timeout to show the saving state
    setTimeout(() => {
      setApiKey(tempApiKey);
      setListId(tempListId);
      
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram salvas com sucesso."
      });
      
      setSaving(false);
      
      // If both values are provided, fetch tasks
      if (tempApiKey && tempListId) {
        fetchTasksList();
      }
    }, 800);
  };

  useEffect(() => {
    if (apiKey && listId) {
      fetchTasksList();
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 neomorphism">
      <h2 className="text-2xl font-semibold mb-8 text-center">Configurações da Timeline</h2>
      
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Configurações do ClickUp</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="apiKey" className="block text-sm font-medium">
                API Key do ClickUp
              </label>
              <input
                id="apiKey"
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200"
                placeholder="pk_12345..."
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="listId" className="block text-sm font-medium">
                ID da Lista
              </label>
              <input
                id="listId"
                type="text"
                value={tempListId}
                onChange={(e) => setTempListId(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200"
                placeholder="123456..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={fetchTasksList}
              disabled={loading || !apiKey || !listId}
              className={`py-2 px-4 rounded-md flex items-center text-white bg-secondary-foreground hover:bg-secondary-foreground/90 transition-colors duration-200 ${
                loading || !apiKey || !listId ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCwIcon size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Carregando...' : 'Atualizar Tarefas'}
            </button>
            
            <button
              onClick={saveSettings}
              disabled={saving}
              className={`py-2 px-4 rounded-md flex items-center text-white bg-primary hover:bg-primary/90 transition-colors duration-200 ${
                saving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <SaveIcon size={16} className="mr-2" />
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Visibilidade das Etapas</h3>
          
          {tasks.length === 0 ? (
            <div className="bg-muted p-6 rounded-md text-center">
              <p className="text-muted-foreground">
                {apiKey && listId 
                  ? "Nenhuma tarefa encontrada. Clique em 'Atualizar Tarefas' para buscar tarefas do ClickUp." 
                  : "Configure a API Key e o ID da Lista para visualizar as tarefas."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Selecione as tarefas que serão exibidas na timeline do cliente:
              </p>
              
              <div className="divide-y divide-border bg-white shadow rounded-lg">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors duration-200">
                    <div>
                      <h4 className="font-medium">{task.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Status: {task.status.status}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => toggleItemVisibility(task.id)}
                      className={`p-2 rounded-full transition-colors duration-200 ${
                        visibleItems.includes(task.id) 
                          ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {visibleItems.includes(task.id) ? (
                        <Eye size={20} />
                      ) : (
                        <EyeOff size={20} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
