import { useState } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/types/database'

type Eixo = Database['public']['Tables']['eixos']['Row']
type EixoInsert = Database['public']['Tables']['eixos']['Insert']

export function AdminEixos() {
  const { eixos, loading, error } = useEixos()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [editingEixo, setEditingEixo] = useState<Eixo | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState<Partial<EixoInsert>>({
    titulo: '',
    icone: '',
    definicao: '',
    temas: [],
    entregas: [],
    ordem: 0,
    ativo: true,
  })

  const handleEdit = (eixo: Eixo) => {
    setEditingEixo(eixo)
    setFormData(eixo)
    setOpen(true)
  }

  const handleNew = () => {
    setEditingEixo(null)
    setFormData({
      titulo: '',
      icone: '',
      definicao: '',
      temas: [],
      entregas: [],
      ordem: (eixos?.length || 0) + 1,
      ativo: true,
    })
    setOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingEixo) {
        const { error } = await supabase
          .from('eixos')
          .update(formData)
          .eq('id', editingEixo.id)
        
        if (error) throw error
        
        toast({
          title: 'Eixo atualizado',
          description: 'As alterações foram salvas com sucesso.',
        })
      } else {
        const { error } = await supabase
          .from('eixos')
          .insert([formData as EixoInsert])
        
        if (error) throw error
        
        toast({
          title: 'Eixo criado',
          description: 'O novo eixo foi adicionado com sucesso.',
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
    if (!confirm('Tem certeza que deseja deletar este eixo?')) return
    
    try {
      const { error } = await supabase
        .from('eixos')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      toast({
        title: 'Eixo deletado',
        description: 'O eixo foi removido com sucesso.',
      })
      
      window.location.reload()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar o eixo.',
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
          <p className="text-red-600">Erro ao carregar eixos: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gold/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-navy">Gerenciar Eixos de Pesquisa</CardTitle>
            <CardDescription>Adicione, edite ou remova eixos do LIDA</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNew} className="bg-navy hover:bg-navy-dark text-cream">
                <Plus className="w-4 h-4 mr-2" />
                Novo Eixo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-navy">
                  {editingEixo ? 'Editar Eixo' : 'Novo Eixo'}
                </DialogTitle>
                <DialogDescription>
                  Preencha as informações do eixo de pesquisa
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Nome do eixo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icone">Ícone (Lucide) *</Label>
                  <Input
                    id="icone"
                    value={formData.icone}
                    onChange={(e) => setFormData({ ...formData, icone: e.target.value })}
                    placeholder="ex: Target, FileText, Users"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="definicao">Definição *</Label>
                  <Textarea
                    id="definicao"
                    value={formData.definicao}
                    onChange={(e) => setFormData({ ...formData, definicao: e.target.value })}
                    placeholder="Descrição do eixo"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temas">Temas (um por linha)</Label>
                  <Textarea
                    id="temas"
                    value={formData.temas?.join('\n')}
                    onChange={(e) => setFormData({ ...formData, temas: e.target.value.split('\n').filter(Boolean) })}
                    placeholder="Tema 1&#10;Tema 2&#10;Tema 3"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entregas">Entregas (uma por linha)</Label>
                  <Textarea
                    id="entregas"
                    value={formData.entregas?.join('\n')}
                    onChange={(e) => setFormData({ ...formData, entregas: e.target.value.split('\n').filter(Boolean) })}
                    placeholder="Entrega 1&#10;Entrega 2&#10;Entrega 3"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ordem">Ordem de Exibição</Label>
                    <Input
                      id="ordem"
                      type="number"
                      value={formData.ordem}
                      onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-8">
                    <Switch
                      id="ativo"
                      checked={formData.ativo}
                      onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                    />
                    <Label htmlFor="ativo">Ativo</Label>
                  </div>
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
              <TableHead>Ícone</TableHead>
              <TableHead>Temas</TableHead>
              <TableHead>Ordem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eixos && eixos.length > 0 ? (
              eixos.map((eixo) => (
                <TableRow key={eixo.id}>
                  <TableCell className="font-medium">{eixo.titulo}</TableCell>
                  <TableCell>{eixo.icone}</TableCell>
                  <TableCell>{eixo.temas.length} temas</TableCell>
                  <TableCell>{eixo.ordem}</TableCell>
                  <TableCell>
                    {eixo.ativo ? (
                      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                    ) : (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(eixo)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(eixo.id)}
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
                <TableCell colSpan={6} className="text-center py-8 text-navy-light">
                  Nenhum eixo cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
