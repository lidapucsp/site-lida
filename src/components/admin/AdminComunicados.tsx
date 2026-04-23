import { useState, useEffect } from 'react'
import { useProfiles } from '@/hooks/useProfiles'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Loader2, Mail, Send, Users, AlertCircle, CheckCircle2, Clock, History, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Comunicado {
  id: string
  assunto: string
  mensagem: string
  enviado_em: string
  status: 'enviado' | 'falha' | 'parcial'
  destinatarios: string[]
}

export function AdminComunicados() {
  const { user } = useAuth()
  const { profiles, loading: loadingProfiles } = useProfiles()
  const { toast } = useToast()
  const [sending, setSending] = useState(false)
  const [comunicados, setComunicados] = useState<Comunicado[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [formData, setFormData] = useState({
    assunto: '',
    mensagem: '',
  })

  // Buscar histórico de comunicados
  useEffect(() => {
    fetchComunicados()
  }, [])

  const fetchComunicados = async () => {
    try {
      setLoadingHistory(true)
      const { data, error } = await supabase
        .from('comunicados')
        .select('*')
        .order('enviado_em', { ascending: false })

      if (error) throw error
      setComunicados(data || [])
    } catch (error) {
      console.error('Erro ao buscar comunicados:', error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleSend = async () => {
    if (!formData.assunto || !formData.mensagem) {
      toast({
        title: 'Erro',
        description: 'Preencha o assunto e a mensagem.',
        variant: 'destructive',
      })
      return
    }

    setSending(true)
    try {
      // Obter sessão para validar que está autenticado
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        throw new Error('Sessão expirada. Faça login novamente.')
      }

      // Chamar Edge Function usando ANON_KEY como token (HS256 funciona)
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
          },
          body: JSON.stringify({
            assunto: formData.assunto,
            mensagem: formData.mensagem,
            user_id: session.user.id
          })
        }
      )

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(error.error || `HTTP ${response.status}`)
      }

      const data = await response.json()

      if (!data?.success) {
        throw new Error(data?.error || data?.details || 'Erro ao enviar email')
      }

      toast({
        title: 'Email enviado!',
        description: data.message || 'Comunicado enviado com sucesso.',
      })

      // Limpar formulário
      setFormData({
        assunto: '',
        mensagem: '',
      })

      // Recarregar histórico
      fetchComunicados()
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar',
        description: error.message || 'Não foi possível enviar o comunicado.',
        variant: 'destructive',
      })
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este comunicado do histórico?')) return
    
    try {
      const { error } = await supabase
        .from('comunicados')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      toast({
        title: 'Comunicado deletado',
        description: 'O comunicado foi removido do histórico.',
      })
      
      fetchComunicados()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar o comunicado.',
        variant: 'destructive',
      })
    }
  }

  if (loadingProfiles) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  const totalParticipantes = profiles?.length || 0

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'enviado':
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Enviado</Badge>
      case 'falha':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Falha</Badge>
      case 'parcial':
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Parcial</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 font-medium mb-1">
                Sistema de Comunicados
              </p>
              <p className="text-xs text-blue-700">
                Os emails serão enviados para todos os {totalParticipantes} participante(s) cadastrado(s) no sistema.
                Certifique-se de revisar a mensagem antes de enviar.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="enviar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enviar" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Enviar
          </TabsTrigger>
          <TabsTrigger value="historico" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enviar" className="space-y-6 mt-6">
      <Card className="border-gold/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-navy flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Novo Comunicado
              </CardTitle>
              <CardDescription>
                Envie um email para todos os participantes do LIDA
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{totalParticipantes} destinatário(s)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="assunto">Assunto *</Label>
            <Input
              id="assunto"
              value={formData.assunto}
              onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
              placeholder="Ex: Informações sobre a próxima reunião"
              disabled={sending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mensagem">Mensagem *</Label>
            <Textarea
              id="mensagem"
              value={formData.mensagem}
              onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
              placeholder="Digite aqui a mensagem do comunicado..."
              rows={12}
              disabled={sending}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {formData.mensagem.length} caracteres
            </p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Atenção:</strong> Esta ação enviará um email para todos os participantes cadastrados.
              Não é possível desfazer o envio.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setFormData({ assunto: '', mensagem: '' })}
              disabled={sending}
            >
              Limpar
            </Button>
            <Button
              onClick={handleSend}
              disabled={sending || !formData.assunto || !formData.mensagem}
              className="bg-navy hover:bg-navy-dark text-cream"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Comunicado
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Card */}
      {(formData.assunto || formData.mensagem) && (
        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="text-navy text-lg">Pré-visualização</CardTitle>
            <CardDescription>Como o email aparecerá para os destinatários</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white border border-border rounded-lg p-6 space-y-4">
              <div className="border-b border-border pb-4">
                <p className="text-xs text-muted-foreground mb-1">Assunto:</p>
                <p className="font-semibold text-navy">
                  {formData.assunto || '(sem assunto)'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Mensagem:</p>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap text-sm text-foreground">
                    {formData.mensagem || '(sem mensagem)'}
                  </p>
                </div>
              </div>
              <div className="border-t border-border pt-4 text-xs text-muted-foreground">
                <p>—</p>
                <p>Enviado por LIDA - PUC-SP</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
        </TabsContent>

        <TabsContent value="historico" className="mt-6">
          <Card className="border-gold/20">
            <CardHeader>
              <CardTitle className="text-navy flex items-center gap-2">
                <History className="w-5 h-5" />
                Histórico de Comunicados
              </CardTitle>
              <CardDescription>
                Lista de todos os comunicados enviados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingHistory ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gold" />
                </div>
              ) : comunicados.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum comunicado enviado ainda</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assunto</TableHead>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Destinatários</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comunicados.map((comunicado) => (
                        <TableRow key={comunicado.id}>
                          <TableCell className="font-medium max-w-md">
                            <p className="truncate" title={comunicado.assunto}>
                              {comunicado.assunto}
                            </p>
                            <p className="text-xs text-muted-foreground truncate mt-1" title={comunicado.mensagem}>
                              {comunicado.mensagem.substring(0, 80)}...
                            </p>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(comunicado.enviado_em)}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3 text-muted-foreground" />
                              {comunicado.destinatarios?.length || 0}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(comunicado.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(comunicado.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminComunicados
