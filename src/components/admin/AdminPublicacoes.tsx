import { useState } from 'react'
import { usePublicacoes } from '@/hooks/usePublicacoes'
import { useEixos } from '@/hooks/useEixos'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Loader2, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/types/database'

type Publicacao = Database['public']['Tables']['publicacoes']['Row']
type PublicacaoInsert = Database['public']['Tables']['publicacoes']['Insert']

export function AdminPublicacoes() {
  const { publicacoes, loading, error } = usePublicacoes({ status: 'todos' })
  const { eixos } = useEixos()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [editingPublicacao, setEditingPublicacao] = useState<Publicacao | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState<Partial<PublicacaoInsert>>({
    titulo: '',
    autores: '',
    data_publicacao: '',
    ano: new Date().getFullYear(),
    eixo_id: '',
    eixo_nome: '',
    tipo: 'Artigo',
    resumo: '',
    citacao: '',
    arquivo_url: '',
    ativo: true,
  })

  const handleEdit = (publicacao: Publicacao) => {
    setEditingPublicacao(publicacao)
    setFormData(publicacao)
    setOpen(true)
  }

  const handleNew = () => {
    setEditingPublicacao(null)
    setFormData({
      titulo: '',
      autores: '',
      data_publicacao: new Date().toISOString().split('T')[0],
      ano: new Date().getFullYear(),
      eixo_id: '',
      eixo_nome: '',
      tipo: 'Artigo',
      resumo: '',
      citacao: '',
      arquivo_url: '',
      ativo: true,
    })
    setOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Buscar nome do eixo
      const eixo = eixos?.find(e => e.id === formData.eixo_id)
      const dataToSave = {
        ...formData,
        eixo_nome: eixo?.titulo || '',
      }

      if (editingPublicacao) {
        const { error } = await supabase
          .from('publicacoes')
          .update(dataToSave)
          .eq('id', editingPublicacao.id)
        
        if (error) throw error
        
        toast({
          title: 'Publicação atualizada',
          description: 'As alterações foram salvas com sucesso.',
        })
      } else {
        const { error } = await supabase
          .from('publicacoes')
          .insert([dataToSave as PublicacaoInsert])
        
        if (error) throw error
        
        toast({
          title: 'Publicação criada',
          description: 'A nova publicação foi adicionada com sucesso.',
        })
      }
      
      setOpen(false)
      window.location.reload()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as alterações.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta publicação?')) return
    
    try {
      const { error } = await supabase
        .from('publicacoes')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      toast({
        title: 'Publicação deletada',
        description: 'A publicação foi removida com sucesso.',
      })
      
      window.location.reload()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar a publicação.',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="py-6">
          <p className="text-red-600">Erro ao carregar publicações: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gold/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-navy">Gerenciar Publicações</CardTitle>
            <CardDescription>Adicione, edite ou remova publicações do LIDA</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNew} className="bg-navy hover:bg-navy-dark text-cream">
                <Plus className="w-4 h-4 mr-2" />
                Nova Publicação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-navy">
                  {editingPublicacao ? 'Editar Publicação' : 'Nova Publicação'}
                </DialogTitle>
                <DialogDescription>
                  Preencha as informações da publicação
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Título da publicação"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="autores">Autores *</Label>
                  <Input
                    id="autores"
                    value={formData.autores}
                    onChange={(e) => setFormData({ ...formData, autores: e.target.value })}
                    placeholder="Nome dos autores separados por vírgula"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data_publicacao">Data de Publicação *</Label>
                    <Input
                      id="data_publicacao"
                      type="date"
                      value={formData.data_publicacao}
                      onChange={(e) => setFormData({ ...formData, data_publicacao: e.target.value, ano: new Date(e.target.value).getFullYear() })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo *</Label>
                    <Select
                      value={formData.tipo}
                      onValueChange={(value) => setFormData({ ...formData, tipo: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Artigo">Artigo</SelectItem>
                        <SelectItem value="Nota Técnica">Nota Técnica</SelectItem>
                        <SelectItem value="Relatório">Relatório</SelectItem>
                        <SelectItem value="Guia">Guia</SelectItem>
                        <SelectItem value="Resumo">Resumo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eixo">Eixo *</Label>
                  <Select
                    value={formData.eixo_id}
                    onValueChange={(value) => setFormData({ ...formData, eixo_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um eixo" />
                    </SelectTrigger>
                    <SelectContent>
                      {eixos?.map((eixo) => (
                        <SelectItem key={eixo.id} value={eixo.id}>
                          {eixo.titulo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resumo">Resumo</Label>
                  <Textarea
                    id="resumo"
                    value={formData.resumo}
                    onChange={(e) => setFormData({ ...formData, resumo: e.target.value })}
                    placeholder="Resumo da publicação"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="citacao">Citação</Label>
                  <Textarea
                    id="citacao"
                    value={formData.citacao}
                    onChange={(e) => setFormData({ ...formData, citacao: e.target.value })}
                    placeholder="Como citar esta publicação"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arquivo_url">URL do Arquivo/PDF</Label>
                  <Input
                    id="arquivo_url"
                    value={formData.arquivo_url}
                    onChange={(e) => setFormData({ ...formData, arquivo_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                  />
                  <Label htmlFor="ativo">Ativo</Label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={saving} className="bg-navy hover:bg-navy-dark text-cream">
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Autores</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Eixo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {publicacoes && publicacoes.length > 0 ? (
              publicacoes.map((pub) => (
                <TableRow key={pub.id}>
                  <TableCell className="font-medium max-w-xs truncate">{pub.titulo}</TableCell>
                  <TableCell className="max-w-xs truncate">{pub.autores}</TableCell>
                  <TableCell>{pub.ano}</TableCell>
                  <TableCell className="capitalize">{pub.tipo}</TableCell>
                  <TableCell>{pub.eixo_nome}</TableCell>
                  <TableCell>
                    {pub.ativo ? (
                      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                    ) : (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {pub.arquivo_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(pub.arquivo_url!, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(pub)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(pub.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-navy-light">
                  Nenhuma publicação cadastrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
