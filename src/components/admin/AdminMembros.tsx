import { useState } from 'react'
import { useMembros } from '@/hooks/useMembros'
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

type Membro = Database['public']['Tables']['membros']['Row']
type MembroInsert = Database['public']['Tables']['membros']['Insert']

export function AdminMembros() {
  const { membros, loading, error, refetch } = useMembros({ tipo: 'todos' })
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [editingMembro, setEditingMembro] = useState<Membro | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState<Partial<MembroInsert>>({
    nome: '',
    cargo: '',
    tipo: 'membro',
    bio: '',
    foto_url: '',
    linkedin_url: '',
    is_founder: false,
    ordem: 0,
    ativo: true,
  })

  const handleEdit = (membro: Membro) => {
    setEditingMembro(membro)
    setFormData(membro)
    setOpen(true)
  }

  const handleNew = () => {
    setEditingMembro(null)
    setFormData({
      nome: '',
      cargo: '',
      tipo: 'membro',
      bio: '',
      foto_url: '',
      linkedin_url: '',
      is_founder: false,
      ordem: (membros?.length || 0) + 1,
      ativo: true,
    })
    setOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingMembro) {
        const { error } = await supabase
          .from('membros')
          .update(formData)
          .eq('id', editingMembro.id)
        
        if (error) throw error
        
        toast({
          title: 'Membro atualizado',
          description: 'As alterações foram salvas com sucesso.',
        })
      } else {
        const { error } = await supabase
          .from('membros')
          .insert([formData as MembroInsert])
        
        if (error) throw error
        
        toast({
          title: 'Membro criado',
          description: 'O novo membro foi adicionado com sucesso.',
        })
      }
      
      setOpen(false)
      refetch()
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
    if (!confirm('Tem certeza que deseja deletar este membro?')) return
    
    try {
      const { error } = await supabase
        .from('membros')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      toast({
        title: 'Membro deletado',
        description: 'O membro foi removido com sucesso.',
      })
      
      refetch()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar o membro.',
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
          <p className="text-red-600">Erro ao carregar membros: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'coordenador':
        return <Badge className="bg-purple-100 text-purple-800">Coordenador</Badge>
      case 'diretor':
        return <Badge className="bg-blue-100 text-blue-800">Diretor</Badge>
      case 'presidente':
        return <Badge className="bg-gold/20 text-gold-dark border border-gold/30">Presidente</Badge>
      case 'membro':
        return <Badge variant="secondary">Membro</Badge>
      default:
        return <Badge variant="secondary">{tipo}</Badge>
    }
  }

  return (
    <Card className="border-gold/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-navy">Gerenciar Membros</CardTitle>
            <CardDescription>Adicione, edite ou remova membros do LIDA</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNew} className="bg-navy hover:bg-navy-dark text-cream">
                <Plus className="w-4 h-4 mr-2" />
                Novo Membro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-navy">
                  {editingMembro ? 'Editar Membro' : 'Novo Membro'}
                </DialogTitle>
                <DialogDescription>
                  Preencha as informações do membro
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome do membro"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo *</Label>
                  <Input
                    id="cargo"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    placeholder="ex: Pesquisador, Estudante de Doutorado"
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
                      <SelectItem value="coordenador">Coordenador</SelectItem>
                      <SelectItem value="presidente">Presidente</SelectItem>
                      <SelectItem value="diretor">Diretor</SelectItem>
                      <SelectItem value="membro">Membro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia *</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Breve descrição sobre o membro"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foto_url">URL da Foto *</Label>
                  <Input
                    id="foto_url"
                    value={formData.foto_url}
                    onChange={(e) => setFormData({ ...formData, foto_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">URL do LinkedIn</Label>
                  <Input
                    id="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
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
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_founder"
                      checked={formData.is_founder}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_founder: checked })}
                    />
                    <Label htmlFor="is_founder">Fundador do LIDA</Label>
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
              <TableHead>Nome</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Fundador</TableHead>
              <TableHead>Ordem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {membros && membros.length > 0 ? (
              membros.map((membro) => (
                <TableRow key={membro.id}>
                  <TableCell className="font-medium">{membro.nome}</TableCell>
                  <TableCell>{membro.cargo}</TableCell>
                  <TableCell>{getTipoBadge(membro.tipo)}</TableCell>
                  <TableCell>
                    {membro.is_founder && (
                      <Badge className="bg-gold/20 text-gold-dark">Fundador</Badge>
                    )}
                  </TableCell>
                  <TableCell>{membro.ordem}</TableCell>
                  <TableCell>
                    {membro.ativo ? (
                      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                    ) : (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {membro.linkedin_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(membro.linkedin_url!, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(membro)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(membro.id)}
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
                  Nenhum membro cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
