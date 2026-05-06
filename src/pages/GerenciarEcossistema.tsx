import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, ListTodo, MessageSquare, Bell, Settings } from 'lucide-react';
import AdminEquipes from '@/components/admin/ecossistema/AdminEquipes';
import AdminMembrosEcossistema from '@/components/admin/ecossistema/AdminMembrosEcossistema';
import AdminTarefasEcossistema from '@/components/admin/ecossistema/AdminTarefasEcossistema';
import AdminComunicadosEcossistema from '@/components/admin/ecossistema/AdminComunicadosEcossistema';

export default function GerenciarEcossistema() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('equipes');

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-navy border-b border-gold/20 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin')}
              className="text-cream hover:bg-gold/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-display font-bold text-cream">
                Gerenciar Ecossistema LIDA
              </h1>
              <p className="text-sm text-gold-light">
                Sistema completo de gerenciamento do ecossistema de ensino
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gold/20 p-1 h-auto">
            <TabsTrigger 
              value="equipes" 
              className="data-[state=active]:bg-navy data-[state=active]:text-cream flex items-center gap-2 py-3"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Equipes</span>
            </TabsTrigger>
            <TabsTrigger 
              value="membros" 
              className="data-[state=active]:bg-navy data-[state=active]:text-cream flex items-center gap-2 py-3"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Membros</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tarefas" 
              className="data-[state=active]:bg-navy data-[state=active]:text-cream flex items-center gap-2 py-3"
            >
              <ListTodo className="w-4 h-4" />
              <span className="hidden sm:inline">Tarefas</span>
            </TabsTrigger>
            <TabsTrigger 
              value="comunicados" 
              className="data-[state=active]:bg-navy data-[state=active]:text-cream flex items-center gap-2 py-3"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Comunicados</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="equipes" className="space-y-4">
            <Card className="border-gold/20">
              <CardHeader>
                <CardTitle className="text-navy">Gerenciar Equipes</CardTitle>
                <CardDescription>
                  Configure as 4 equipes do ecossistema e seus diretores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminEquipes />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="membros" className="space-y-4">
            <Card className="border-gold/20">
              <CardHeader>
                <CardTitle className="text-navy">Gerenciar Membros</CardTitle>
                <CardDescription>
                  Atribua membros às equipes, defina funções e gerencie evoluções
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminMembrosEcossistema />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tarefas" className="space-y-4">
            <Card className="border-gold/20">
              <CardHeader>
                <CardTitle className="text-navy">Gerenciar Tarefas</CardTitle>
                <CardDescription>
                  Crie e acompanhe tarefas, avalie entregas e monitore o progresso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminTarefasEcossistema />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comunicados" className="space-y-4">
            <Card className="border-gold/20">
              <CardHeader>
                <CardTitle className="text-navy">Enviar Comunicados</CardTitle>
                <CardDescription>
                  Envie mensagens para equipes específicas ou todos os membros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminComunicadosEcossistema />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
