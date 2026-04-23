import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, UserCog } from 'lucide-react'
import { AdminMembros } from './AdminMembros'
import { AdminParticipantes } from './AdminParticipantes'

export function AdminMembrosGeral() {
  const [activeTab, setActiveTab] = useState('diretoria')

  return (
    <Card className="border-gold/20">
      <CardHeader>
        <CardTitle className="text-navy font-display">Gerenciar Membros</CardTitle>
        <CardDescription>
          Gerencie membros da diretoria e participantes do LIDA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger 
              value="diretoria"
              className="data-[state=active]:bg-navy data-[state=active]:text-cream flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Diretoria
            </TabsTrigger>
            <TabsTrigger 
              value="participantes"
              className="data-[state=active]:bg-navy data-[state=active]:text-cream flex items-center gap-2"
            >
              <UserCog className="w-4 h-4" />
              Participantes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diretoria">
            <div className="space-y-4">
              <p className="text-sm text-navy-light">
                Membros que aparecem na página <span className="font-semibold">Sobre</span> do site (Coordenadores, Diretores, etc.)
              </p>
              <AdminMembros />
            </div>
          </TabsContent>

          <TabsContent value="participantes">
            <div className="space-y-4">
              <p className="text-sm text-navy-light">
                Usuários cadastrados no sistema. Você pode atribuir cargos e permissões administrativas.
                <br />
                <span className="text-xs italic">
                  Nota: Participantes que também são membros da diretoria têm seus cargos sincronizados automaticamente.
                </span>
              </p>
              <AdminParticipantes />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
