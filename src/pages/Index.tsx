
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, ClockIcon, MessageCircleIcon, SettingsIcon } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-6 px-8 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Timeline do Cliente</h1>
          <nav className="flex space-x-6">
            <Link to="/timeline" className="text-sm font-medium hover:text-primary transition-colors">
              Timeline
            </Link>
            <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors">
              Administração
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4">
        <section className="py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight animate-fade-in">
              Visualize o progresso do seu projeto
            </h2>
            <p className="text-xl text-muted-foreground mb-10 animate-slide-up">
              Acompanhe as etapas, atividades e progresso do seu projeto em um único lugar, com uma interface intuitiva e elegante.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                to="/timeline"
                className="inline-flex items-center justify-center py-3 px-8 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow"
              >
                Ver Timeline
                <ChevronRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/admin"
                className="inline-flex items-center justify-center py-3 px-8 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-300 transform hover:-translate-y-1"
              >
                Administrar
                <SettingsIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Recursos</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in">
                <ClockIcon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-3">Timeline interativa</h3>
                <p className="text-muted-foreground">
                  Visualize as etapas do seu projeto em uma linha do tempo intuitiva e interativa.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <MessageCircleIcon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-3">Comentários</h3>
                <p className="text-muted-foreground">
                  Adicione comentários a cada etapa para uma comunicação clara e eficiente.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in" style={{ animationDelay: "200ms" }}>
                <SettingsIcon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-3">Configuração flexível</h3>
                <p className="text-muted-foreground">
                  Personalize quais etapas são exibidas e conecte-se ao ClickUp com facilidade.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Timeline do Cliente. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
