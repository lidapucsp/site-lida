import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Loader2, FileText, HelpCircle, CheckCircle, Calendar, Award, Users } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ProcessoSeletivo {
  id: string
  titulo: string
  periodo: string
  descricao: string | null
  edital_url: string | null
  edital_descricao: string | null
  inscricao_url: string | null
  inscricao_inicio: string | null
  inscricao_fim: string | null
  vagas: number | null
  ativo: boolean
  exibir_site: boolean
  created_at: string
}

interface RelatedItem {
  id: string
  processo_id: string
  ordem: number
  [key: string]: any
}

export function AdminProcessoSeletivo() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [processos, setProcessos] = useState<ProcessoSeletivo[]>([])
  const [selectedProcesso, setSelectedProcesso] = useState<string | null>(null)
  
  // Estados para diferentes seções
  const [infos, setInfos] = useState<RelatedItem[]>([])
  const [requisitos, setRequisitos] = useState<RelatedItem[]>([])
  const [compromissos, setCompromissos] = useState<RelatedItem[]>([])
  const [cronograma, setCronograma] = useState<RelatedItem[]>([])
  const [faqs, setFaqs] = useState<RelatedItem[]>([])
  const [resultados, setResultados] = useState<RelatedItem[]>([])
  const [aprovados, setAprovados] = useState<RelatedItem[]>([])
  
  // Modal states
  const [openProcessoDialog, setOpenProcessoDialog] = useState(false)
  const [editingProcesso, setEditingProcesso] = useState<ProcessoSeletivo | null>(null)
  const [processoForm, setProcessoForm] = useState({
    titulo: '',
    periodo: '',
    descricao: '',
    edital_url: '',
    edital_descricao: '',
    inscricao_url: '',
    inscricao_inicio: '',
    inscricao_fim: '',
    vagas: 0,
    ativo: true,
    exibir_site: true,
  })

  useEffect(() => {
    fetchProcessos()
  }, [])

  useEffect(() => {
    if (selectedProcesso) {
      fetchRelatedData(selectedProcesso)
    }
  }, [selectedProcesso])

  const fetchProcessos = async () => {
    try {
      const { data, error } = await supabase
        .from('processos_seletivos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProcessos(data || [])
      if (data && data.length > 0 && !selectedProcesso) {
        setSelectedProcesso((data as any)[0].id)
      }
    } catch (error) {
      console.error('Erro ao buscar processos:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os processos seletivos',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedData = async (processoId: string) => {
    try {
      const [infosRes, reqsRes, compsRes, cronoRes, faqsRes, resultsRes, aprovsRes] = await Promise.all([
        supabase.from('processo_seletivo_infos').select('*').eq('processo_id', processoId).order('ordem'),
        supabase.from('processo_seletivo_requisitos').select('*').eq('processo_id', processoId).order('ordem'),
        supabase.from('processo_seletivo_compromissos').select('*').eq('processo_id', processoId).order('ordem'),
        supabase.from('processo_seletivo_cronograma').select('*').eq('processo_id', processoId).order('ordem'),
        supabase.from('processo_seletivo_faqs').select('*').eq('processo_id', processoId).order('ordem'),
        supabase.from('processo_seletivo_resultados_anteriores').select('*').eq('processo_id', processoId).order('ordem'),
        supabase.from('processo_seletivo_aprovados').select('*').eq('processo_id', processoId).order('ordem'),
      ])

      setInfos(infosRes.data || [])
      setRequisitos(reqsRes.data || [])
      setCompromissos(compsRes.data || [])
      setCronograma(cronoRes.data || [])
      setFaqs(faqsRes.data || [])
      setResultados(resultsRes.data || [])
      setAprovados(aprovsRes.data || [])
    } catch (error) {
      console.error('Erro ao buscar dados relacionados:', error)
    }
  }

  const handleSaveProcesso = async () => {
    setSaving(true)
    try {
      if (editingProcesso) {
        const { error } = await (supabase
          .from('processos_seletivos') as any)
          .update(processoForm)
          .eq('id', editingProcesso.id)
        
        if (error) throw error
        toast({ title: 'Sucesso', description: 'Processo atualizado com sucesso' })
      } else {
        const { error } = await (supabase
          .from('processos_seletivos') as any)
          .insert([processoForm])
        
        if (error) throw error
        toast({ title: 'Sucesso', description: 'Processo criado com sucesso' })
      }
      
      setOpenProcessoDialog(false)
      fetchProcessos()
    } catch (error) {
      console.error('Erro ao salvar processo:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o processo',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProcesso = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este processo seletivo? Todos os dados relacionados serão removidos.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('processos_seletivos')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      toast({ title: 'Sucesso', description: 'Processo excluído com sucesso' })
      fetchProcessos()
    } catch (error) {
      console.error('Erro ao excluir processo:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o processo',
        variant: 'destructive',
      })
    }
  }

  // Generic handlers para itens relacionados
  const handleAddItem = async (table: string, data: any) => {
    setSaving(true)
    try {
      const { error } = await (supabase
        .from(table) as any)
        .insert([{ ...data, processo_id: selectedProcesso }])
      
      if (error) throw error
      toast({ title: 'Sucesso', description: 'Item adicionado com sucesso' })
      if (selectedProcesso) fetchRelatedData(selectedProcesso)
    } catch (error) {
      console.error('Erro ao adicionar item:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o item',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateItem = async (table: string, id: string, data: any) => {
    setSaving(true)
    try {
      const { error } = await (supabase
        .from(table) as any)
        .update(data)
        .eq('id', id)
      
      if (error) throw error
      toast({ title: 'Sucesso', description: 'Item atualizado com sucesso' })
      if (selectedProcesso) fetchRelatedData(selectedProcesso)
    } catch (error) {
      console.error('Erro ao atualizar item:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o item',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteItem = async (table: string, id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return

    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
      
      if (error) throw error
      toast({ title: 'Sucesso', description: 'Item excluído com sucesso' })
      if (selectedProcesso) fetchRelatedData(selectedProcesso)
    } catch (error) {
      console.error('Erro ao excluir item:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o item',
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

  const currentProcesso = processos.find(p => p.id === selectedProcesso)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gerenciar Processos Seletivos</CardTitle>
            <Button onClick={() => {
              setEditingProcesso(null)
              setProcessoForm({
                titulo: '',
                periodo: '',
                descricao: '',
                edital_url: '',
                edital_descricao: '',
                inscricao_url: '',
                inscricao_inicio: '',
                inscricao_fim: '',
                vagas: 0,
                ativo: true,
                exibir_site: true,
              })
              setOpenProcessoDialog(true)
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Processo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Vagas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processos.map((processo) => (
                <TableRow key={processo.id} className={selectedProcesso === processo.id ? 'bg-gold/10' : ''}>
                  <TableCell className="font-medium">{processo.titulo}</TableCell>
                  <TableCell>{processo.periodo}</TableCell>
                  <TableCell>{processo.vagas || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {processo.ativo && <Badge variant="default">Ativo</Badge>}
                      {processo.exibir_site && <Badge variant="secondary">Visível no site</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedProcesso(processo.id)}
                      >
                        Gerenciar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingProcesso(processo)
                          setProcessoForm(processo)
                          setOpenProcessoDialog(true)
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProcesso(processo.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Gerenciamento de dados relacionados */}
      {currentProcesso && (
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Conteúdo: {currentProcesso.titulo}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="infos" className="space-y-4">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="infos">
                  <FileText className="w-4 h-4 mr-2" />
                  Infos
                </TabsTrigger>
                <TabsTrigger value="requisitos">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Requisitos
                </TabsTrigger>
                <TabsTrigger value="cronograma">
                  <Calendar className="w-4 h-4 mr-2" />
                  Cronograma
                </TabsTrigger>
                <TabsTrigger value="compromissos">
                  <Award className="w-4 h-4 mr-2" />
                  Compromissos
                </TabsTrigger>
                <TabsTrigger value="faqs">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  FAQs
                </TabsTrigger>
                <TabsTrigger value="resultados">
                  <FileText className="w-4 h-4 mr-2" />
                  Resultados
                </TabsTrigger>
                <TabsTrigger value="aprovados">
                  <Users className="w-4 h-4 mr-2" />
                  Aprovados
                </TabsTrigger>
              </TabsList>

              <TabsContent value="infos">
                <InfosSection 
                  items={infos} 
                  onAdd={(data) => handleAddItem('processo_seletivo_infos', data)}
                  onUpdate={(id, data) => handleUpdateItem('processo_seletivo_infos', id, data)}
                  onDelete={(id) => handleDeleteItem('processo_seletivo_infos', id)}
                  saving={saving}
                />
              </TabsContent>

              <TabsContent value="requisitos">
                <RequisitosSection 
                  items={requisitos} 
                  onAdd={(data) => handleAddItem('processo_seletivo_requisitos', data)}
                  onUpdate={(id, data) => handleUpdateItem('processo_seletivo_requisitos', id, data)}
                  onDelete={(id) => handleDeleteItem('processo_seletivo_requisitos', id)}
                  saving={saving}
                />
              </TabsContent>

              <TabsContent value="cronograma">
                <CronogramaSection 
                  items={cronograma} 
                  onAdd={(data) => handleAddItem('processo_seletivo_cronograma', data)}
                  onUpdate={(id, data) => handleUpdateItem('processo_seletivo_cronograma', id, data)}
                  onDelete={(id) => handleDeleteItem('processo_seletivo_cronograma', id)}
                  saving={saving}
                />
              </TabsContent>

              <TabsContent value="compromissos">
                <CompromissosSection 
                  items={compromissos} 
                  onAdd={(data) => handleAddItem('processo_seletivo_compromissos', data)}
                  onUpdate={(id, data) => handleUpdateItem('processo_seletivo_compromissos', id, data)}
                  onDelete={(id) => handleDeleteItem('processo_seletivo_compromissos', id)}
                  saving={saving}
                />
              </TabsContent>

              <TabsContent value="faqs">
                <FAQsSection 
                  items={faqs} 
                  onAdd={(data) => handleAddItem('processo_seletivo_faqs', data)}
                  onUpdate={(id, data) => handleUpdateItem('processo_seletivo_faqs', id, data)}
                  onDelete={(id) => handleDeleteItem('processo_seletivo_faqs', id)}
                  saving={saving}
                />
              </TabsContent>

              <TabsContent value="resultados">
                <ResultadosSection 
                  items={resultados} 
                  onAdd={(data) => handleAddItem('processo_seletivo_resultados_anteriores', data)}
                  onUpdate={(id, data) => handleUpdateItem('processo_seletivo_resultados_anteriores', id, data)}
                  onDelete={(id) => handleDeleteItem('processo_seletivo_resultados_anteriores', id)}
                  saving={saving}
                />
              </TabsContent>

              <TabsContent value="aprovados">
                <AprovadosSection 
                  items={aprovados} 
                  onAdd={(data) => handleAddItem('processo_seletivo_aprovados', data)}
                  onUpdate={(id, data) => handleUpdateItem('processo_seletivo_aprovados', id, data)}
                  onDelete={(id) => handleDeleteItem('processo_seletivo_aprovados', id)}
                  saving={saving}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Dialog para criar/editar processo */}
      <Dialog open={openProcessoDialog} onOpenChange={setOpenProcessoDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProcesso ? 'Editar' : 'Novo'} Processo Seletivo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={processoForm.titulo}
                onChange={(e) => setProcessoForm({ ...processoForm, titulo: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="periodo">Período</Label>
                <Input
                  id="periodo"
                  value={processoForm.periodo}
                  onChange={(e) => setProcessoForm({ ...processoForm, periodo: e.target.value })}
                  placeholder="Ex: 2026.1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vagas">Vagas</Label>
                <Input
                  id="vagas"
                  type="number"
                  value={processoForm.vagas}
                  onChange={(e) => setProcessoForm({ ...processoForm, vagas: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={processoForm.descricao}
                onChange={(e) => setProcessoForm({ ...processoForm, descricao: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edital_url">URL do Edital</Label>
              <Input
                id="edital_url"
                value={processoForm.edital_url}
                onChange={(e) => setProcessoForm({ ...processoForm, edital_url: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edital_descricao">Descrição do Edital</Label>
              <Input
                id="edital_descricao"
                value={processoForm.edital_descricao}
                onChange={(e) => setProcessoForm({ ...processoForm, edital_descricao: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="inscricao_url">URL de Inscrição</Label>
              <Input
                id="inscricao_url"
                value={processoForm.inscricao_url}
                onChange={(e) => setProcessoForm({ ...processoForm, inscricao_url: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="inscricao_inicio">Início das Inscrições</Label>
                <Input
                  id="inscricao_inicio"
                  type="datetime-local"
                  value={processoForm.inscricao_inicio}
                  onChange={(e) => setProcessoForm({ ...processoForm, inscricao_inicio: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="inscricao_fim">Fim das Inscrições</Label>
                <Input
                  id="inscricao_fim"
                  type="datetime-local"
                  value={processoForm.inscricao_fim}
                  onChange={(e) => setProcessoForm({ ...processoForm, inscricao_fim: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="ativo"
                  checked={processoForm.ativo}
                  onCheckedChange={(checked) => setProcessoForm({ ...processoForm, ativo: checked })}
                />
                <Label htmlFor="ativo">Ativo</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="exibir_site"
                  checked={processoForm.exibir_site}
                  onCheckedChange={(checked) => setProcessoForm({ ...processoForm, exibir_site: checked })}
                />
                <Label htmlFor="exibir_site">Exibir no Site</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenProcessoDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProcesso} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componentes das seções (implementação simplificada - pode ser expandida)
function InfosSection({ items, onAdd, onUpdate, onDelete, saving }: any) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ texto: '', ordem: items.length + 1 })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Informações Essenciais</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => { setEditing(null); setForm({ texto: '', ordem: items.length + 1 }) }}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar' : 'Nova'} Informação</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Texto</Label>
                <Textarea value={form.texto} onChange={(e) => setForm({ ...form, texto: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Ordem</Label>
                <Input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={async () => {
                if (editing) {
                  await onUpdate(editing.id, form)
                } else {
                  await onAdd(form)
                }
                setOpen(false)
              }} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ordem</TableHead>
            <TableHead>Texto</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell>{item.ordem}</TableCell>
              <TableCell>{item.texto}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setEditing(item); setForm(item); setOpen(true) }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function RequisitosSection({ items, onAdd, onUpdate, onDelete, saving }: any) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ titulo: '', descricao: '', ordem: items.length + 1 })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Requisitos para Inscrição</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => { setEditing(null); setForm({ titulo: '', descricao: '', ordem: items.length + 1 }) }}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar' : 'Novo'} Requisito</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Título</Label>
                <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Descrição</Label>
                <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Ordem</Label>
                <Input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={async () => {
                if (editing) {
                  await onUpdate(editing.id, form)
                } else {
                  await onAdd(form)
                }
                setOpen(false)
              }} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ordem</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell>{item.ordem}</TableCell>
              <TableCell>{item.titulo}</TableCell>
              <TableCell>{item.descricao}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setEditing(item); setForm(item); setOpen(true) }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function CronogramaSection({ items, onAdd, onUpdate, onDelete, saving }: any) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ etapa: '', descricao: '', data_inicio: '', ordem: items.length + 1 })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Cronograma</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => { setEditing(null); setForm({ etapa: '', descricao: '', data_inicio: '', ordem: items.length + 1 }) }}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar' : 'Nova'} Etapa</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Etapa</Label>
                <Input value={form.etapa} onChange={(e) => setForm({ ...form, etapa: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Descrição</Label>
                <Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Data</Label>
                <Input type="datetime-local" value={form.data_inicio} onChange={(e) => setForm({ ...form, data_inicio: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Ordem</Label>
                <Input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={async () => {
                if (editing) {
                  await onUpdate(editing.id, form)
                } else {
                  await onAdd(form)
                }
                setOpen(false)
              }} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ordem</TableHead>
            <TableHead>Etapa</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell>{item.ordem}</TableCell>
              <TableCell>{item.etapa}</TableCell>
              <TableCell>{item.descricao}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setEditing(item); setForm(item); setOpen(true) }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function CompromissosSection({ items, onAdd, onUpdate, onDelete, saving }: any) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ descricao: '', ordem: items.length + 1 })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Compromissos dos Participantes</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => { setEditing(null); setForm({ descricao: '', ordem: items.length + 1 }) }}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar' : 'Novo'} Compromisso</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Descrição</Label>
                <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Ordem</Label>
                <Input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={async () => {
                if (editing) {
                  await onUpdate(editing.id, form)
                } else {
                  await onAdd(form)
                }
                setOpen(false)
              }} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ordem</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell>{item.ordem}</TableCell>
              <TableCell>{item.descricao}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setEditing(item); setForm(item); setOpen(true) }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function FAQsSection({ items, onAdd, onUpdate, onDelete, saving }: any) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ pergunta: '', resposta: '', ordem: items.length + 1 })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Perguntas Frequentes</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => { setEditing(null); setForm({ pergunta: '', resposta: '', ordem: items.length + 1 }) }}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar' : 'Nova'} FAQ</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Pergunta</Label>
                <Input value={form.pergunta} onChange={(e) => setForm({ ...form, pergunta: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Resposta</Label>
                <Textarea value={form.resposta} onChange={(e) => setForm({ ...form, resposta: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Ordem</Label>
                <Input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={async () => {
                if (editing) {
                  await onUpdate(editing.id, form)
                } else {
                  await onAdd(form)
                }
                setOpen(false)
              }} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ordem</TableHead>
            <TableHead>Pergunta</TableHead>
            <TableHead>Resposta</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell>{item.ordem}</TableCell>
              <TableCell>{item.pergunta}</TableCell>
              <TableCell className="max-w-md truncate">{item.resposta}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setEditing(item); setForm(item); setOpen(true) }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function ResultadosSection({ items, onAdd, onUpdate, onDelete, saving }: any) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ titulo: '', url: '', ordem: items.length + 1 })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Resultados Anteriores</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => { setEditing(null); setForm({ titulo: '', url: '', ordem: items.length + 1 }) }}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar' : 'Novo'} Resultado</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Título</Label>
                <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>URL</Label>
                <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Ordem</Label>
                <Input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={async () => {
                if (editing) {
                  await onUpdate(editing.id, form)
                } else {
                  await onAdd(form)
                }
                setOpen(false)
              }} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ordem</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>URL</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell>{item.ordem}</TableCell>
              <TableCell>{item.titulo}</TableCell>
              <TableCell>{item.url || '-'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setEditing(item); setForm(item); setOpen(true) }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function AprovadosSection({ items, onAdd, onUpdate, onDelete, saving }: any) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ nome: '', instituicao: '', ordem: items.length + 1 })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Candidatos Aprovados</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => { setEditing(null); setForm({ nome: '', instituicao: '', ordem: items.length + 1 }) }}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar' : 'Novo'} Aprovado</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nome</Label>
                <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Instituição</Label>
                <Input value={form.instituicao} onChange={(e) => setForm({ ...form, instituicao: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Ordem</Label>
                <Input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={async () => {
                if (editing) {
                  await onUpdate(editing.id, form)
                } else {
                  await onAdd(form)
                }
                setOpen(false)
              }} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ordem</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Instituição</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell>{item.ordem}</TableCell>
              <TableCell>{item.nome}</TableCell>
              <TableCell>{item.instituicao}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setEditing(item); setForm(item); setOpen(true) }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
