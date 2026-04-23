import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, Mail, Clock, Users, CheckCircle2, AlertCircle } from 'lucide-react'

interface Comunicado {
  id: string
  assunto: string
  mensagem: string
  enviado_em: string
  status: 'enviado' | 'falha' | 'parcial'
  destinatarios: string[]
}

export default function ComunicadosSection() {
  const [comunicados, setComunicados] = useState<Comunicado[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedComunicado, setSelectedComunicado] = useState<Comunicado | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchComunicados()
  }, [])

  const fetchComunicados = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('comunicados')
        .select('*')
        .order('enviado_em', { ascending: false })

      if (error) throw error
      setComunicados(data || [])
    } catch (error) {
      console.error('Erro ao buscar comunicados:', error)
    } finally {
      setLoading(false)
    }
  }

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
    <Card className="border-gold/20">
      <CardHeader>
        <CardTitle className="text-navy flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Comunicados da Diretoria
        </CardTitle>
        <CardDescription>
          Histórico de comunicados enviados pela diretoria do LIDA
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : comunicados.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum comunicado ainda</p>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {comunicados.map((comunicado) => (
                  <TableRow 
                    key={comunicado.id} 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => {
                      setSelectedComunicado(comunicado)
                      setDialogOpen(true)
                    }}
                  >
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy text-xl">
              {selectedComunicado?.assunto}
            </DialogTitle>
          </DialogHeader>
          
          {selectedComunicado && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDate(selectedComunicado.enviado_em)}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {selectedComunicado.destinatarios?.length || 0} destinatários
                </div>
                {getStatusBadge(selectedComunicado.status)}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-navy mb-2">Mensagem:</h4>
                <div className="bg-muted/50 rounded-lg p-4 whitespace-pre-wrap">
                  {selectedComunicado.mensagem}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
