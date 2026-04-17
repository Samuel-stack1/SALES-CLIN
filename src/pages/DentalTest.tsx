import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Activity, Images, ClipboardList, PlusCircle, CheckCircle2, Package as PackageIcon, Check, ChevronsUpDown, Loader2, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { clientsApi } from '@/lib/api';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export default function DentalTest() {
  const { professional } = useAuth();
  const { toast } = useToast();
  
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [clientOpen, setClientOpen] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const [activeTeeth, setActiveTeeth] = useState<number[]>([]);
  const [teethStatus, setTeethStatus] = useState<Record<number, string>>({}); 
//...
  const [procedures, setProcedures] = useState<{id: number, name: string, price: number}[]>([]);
  const [newProcName, setNewProcName] = useState('');
  const [newProcPrice, setNewProcPrice] = useState('');

  const [images, setImages] = useState<{id: number, name: string, type: string}[]>([]);

  const [inventory, setInventory] = useState<{id: number, name: string, quantity: string, status: string, badgeClass?: string, color?: string}[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQtd, setNewItemQtd] = useState('');
  const [consumeAmounts, setConsumeAmounts] = useState<Record<number, string>>({});

  const [sessions, setSessions] = useState<{id: number, name: string, completed: boolean}[]>([]);
  const [newSessionName, setNewSessionName] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setDataLoading(true);
    try {
      const response = await clientsApi.getAll({ pageSize: 100 });
      if (response.success) {
        setClients(response.data || []);
      }
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const selectedClientData = clients.find((c) => c.id.toString() === selectedClient);

  const toggleTooth = (tooth: number) => {
    setActiveTeeth(prev => 
      prev.includes(tooth) ? prev.filter(t => t !== tooth) : [...prev, tooth]
    );
  };

  const handleApplyToothStatus = (status: string) => {
    const newStatus = { ...teethStatus };
    activeTeeth.forEach(t => {
      newStatus[t] = status;
    });
    setTeethStatus(newStatus);
    setActiveTeeth([]); // Clear selection
  };

  const addProcedure = () => {
    if (!newProcName || !newProcPrice) {
      toast({ title: "Atenção", description: "Preencha o nome e o valor do procedimento.", variant: "destructive" });
      return;
    }
    setProcedures([...procedures, { 
      id: Date.now(), 
      name: newProcName, 
      price: parseFloat(newProcPrice) || 0 
    }]);
    setNewProcName('');
    setNewProcPrice('');
    toast({ title: "Adicionado", description: "Procedimento incluído no orçamento." });
  };

  const addImage = () => {
    setImages([...images, { 
      id: Date.now(), 
      name: `Nova Imagem ${new Date().toLocaleDateString()}`, 
      type: 'Upload Recente' 
    }]);
    toast({ title: "Sucesso", description: "Imagem simulada carregada com sucesso." });
  };

  const addInventoryItem = () => {
    if (!newItemName || !newItemQtd) {
      toast({ title: "Atenção", description: "Preencha o nome e a quantidade do insumo.", variant: "destructive" });
      return;
    }
    setInventory([...inventory, {
      id: Date.now(),
      name: newItemName,
      quantity: newItemQtd,
      status: 'Disponível',
      badgeClass: 'bg-green-50 text-green-700 border-green-200'
    }]);
    setNewItemName('');
    setNewItemQtd('');
    toast({ title: "Estoque atualizado", description: "Novo insumo adicionado com sucesso." });
  };

  const handleConsume = (id: number) => {
    const amountToConsume = parseFloat(consumeAmounts[id]);
    if (isNaN(amountToConsume) || amountToConsume <= 0) {
      toast({ title: "Erro", description: "Insira uma quantidade numérica válida para consumir.", variant: "destructive" });
      return;
    }

    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        let consumed = false;
        const newQuantity = item.quantity.replace(/\d+/, (match) => {
          consumed = true;
          const current = parseInt(match);
          const result = Math.max(0, current - amountToConsume);
          return result.toString();
        });

        if (!consumed) {
          toast({ title: "Erro", description: "Não encontramos um número identificável na quantidade original desse item.", variant: "destructive" });
          return item;
        }

        const newlyParsed = parseInt(newQuantity.match(/\d+/)?.[0] || '0');
        let newStatus = item.status;
        let newBadge = item.badgeClass;

        if (newlyParsed === 0) {
           newStatus = 'Esgotado';
           newBadge = 'bg-red-50 text-red-700 border-red-200';
        } else if (newlyParsed <= 5) {
           newStatus = 'Baixo Estoque';
           newBadge = 'bg-yellow-50 text-yellow-700 border-yellow-200';
        } else {
           newStatus = 'Disponível';
           newBadge = 'bg-green-50 text-green-700 border-green-200';
        }

        toast({ title: "Consumido", description: `${amountToConsume} unidade(s) de ${item.name} registradas.` });
        return { ...item, quantity: newQuantity, status: newStatus, badgeClass: newBadge };
      }
      return item;
    }));

    setConsumeAmounts(prev => ({ ...prev, [id]: '' }));
  };

  const getToothColor = (tooth: number) => {
    if (activeTeeth.includes(tooth)) return 'bg-primary/20 border-primary text-primary';
    const status = teethStatus[tooth];
    if (status === 'carie') return 'bg-red-100 border-red-500 text-red-700';
    if (status === 'restauracao') return 'bg-blue-100 border-blue-500 text-blue-700';
    if (status === 'extraido') return 'bg-zinc-800 border-zinc-900 text-white';
    return 'bg-white border-zinc-300 hover:border-primary';
  };

  const addSession = () => {
    if (!newSessionName) {
      toast({ title: "Atenção", description: "Preencha o nome da etapa do tratamento.", variant: "destructive" });
      return;
    }
    setSessions([...sessions, { id: Date.now(), name: newSessionName, completed: false }]);
    setNewSessionName('');
    toast({ title: "Nova Etapa", description: "Etapa adicionada ao plano de acompanhamento." });
  };

  const toggleSession = (id: number) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const completedSessions = sessions.filter(s => s.completed).length;
  const totalSessions = sessions.length;
  const sessionProgress = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  const renderOdontogramRow = (start: number, end: number, isUpper: boolean) => {
    const teeth = Array.from({ length: Math.abs(end - start) + 1 }, (_, i) => 
      start < end ? start + i : start - i
    );

    return (
      <div className="flex justify-center gap-1 sm:gap-2 mb-4">
        {teeth.map(tooth => (
          <div 
            key={tooth}
            onClick={() => toggleTooth(tooth)}
            className={`w-8 h-10 sm:w-10 sm:h-12 border-2 rounded flex items-center justify-center cursor-pointer transition-colors relative ${getToothColor(tooth)} ${isUpper ? 'rounded-b-xl' : 'rounded-t-xl'}`}
          >
            {teethStatus[tooth] === 'extraido' ? 'E' : tooth}
          </div>
        ))}
      </div>
    );
  };

  const totalOrcamento = procedures.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-500 bg-clip-text text-transparent italic">
            Auraia <span className="not-italic">Dental Care</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 animate-pulse">
              Modo Clínico Ativo
            </Badge>
            {selectedClientData && (
              <Badge variant="secondary" className="bg-zinc-900 text-white flex items-center gap-1 px-3">
                <User className="h-3 w-3" /> {selectedClientData.name}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 w-full md:w-80">
          <Label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">Selecionar Paciente</Label>
          <Popover open={clientOpen} onOpenChange={setClientOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={clientOpen}
                className="w-full justify-between bg-white border-zinc-200 hover:border-primary transition-all shadow-sm"
                disabled={dataLoading}
              >
                <div className="flex items-center gap-2 truncate">
                  {selectedClient
                    ? clients.find((c) => c.id.toString() === selectedClient)?.name
                    : "Escolher cliente para o prontuário..."}
                </div>
                {dataLoading ? <Loader2 className="ml-2 h-4 w-4 animate-spin shrink-0 opacity-50" /> : <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0 shadow-2xl border-zinc-200" align="end">
              <Command className="rounded-lg">
                <CommandInput placeholder="Digite o nome do paciente..." className="h-12" />
                <CommandList className="max-h-[300px]">
                  <CommandEmpty className="py-6 text-center text-sm">
                    Nenhum paciente encontrado.
                  </CommandEmpty>
                  <CommandGroup heading="Pacientes Cadastrados">
                    {clients.map((client) => (
                      <CommandItem
                        key={client.id}
                        value={client.name}
                        onSelect={() => {
                          setSelectedClient(client.id.toString());
                          setClientOpen(false);
                          toast({
                            title: "Paciente Selecionado",
                            description: `Você está visualizando o prontuário de ${client.name}`,
                          });
                        }}
                        className="py-3 px-4 flex items-center gap-2"
                      >
                        <Check
                          className={cn(
                            "h-4 w-4 text-primary",
                            selectedClient === client.id.toString() ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{client.name}</span>
                          <span className="text-xs text-muted-foreground">{client.phone || "Sem telefone"}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue="odontograma" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-4 h-auto">
          <TabsTrigger value="odontograma" className="py-2"><Activity className="mr-2 h-4 w-4" /> Odontograma</TabsTrigger>
          <TabsTrigger value="tratamentos" className="py-2"><ClipboardList className="mr-2 h-4 w-4" /> Planos de Tratamento</TabsTrigger>
          <TabsTrigger value="imagens" className="py-2"><Images className="mr-2 h-4 w-4" /> Imagens & Exames</TabsTrigger>
          <TabsTrigger value="estoque" className="py-2"><PackageIcon className="mr-2 h-4 w-4" /> Estoque de Insumos</TabsTrigger>
        </TabsList>

        {/* ODONTOGRAMA */}
        <TabsContent value="odontograma" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Odontograma Interativo</CardTitle>
              <CardDescription>Clique nos dentes para selecionar e aplique procedimentos.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-zinc-50 p-6 rounded-lg border">
                <div className="mb-0">
                  <h3 className="text-center text-sm font-semibold mb-2">Arcada Superior</h3>
                  {renderOdontogramRow(18, 11, true)}
                  <div className="w-full h-px bg-zinc-200 my-2"></div>
                  {renderOdontogramRow(21, 28, true)}
                </div>
                <div className="mt-8">
                  {renderOdontogramRow(48, 41, false)}
                  <div className="w-full h-px bg-zinc-200 my-2"></div>
                  {renderOdontogramRow(31, 38, false)}
                  <h3 className="text-center text-sm font-semibold mt-2">Arcada Inferior</h3>
                </div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-4">
                  <h4 className="font-semibold">Legenda</h4>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-100 border border-red-500 rounded"></div> Cárie</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-100 border border-blue-500 rounded"></div> Restauração</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-zinc-800 border border-zinc-900 text-white flex items-center justify-center text-[10px] rounded">E</div> Extração</div>
                  </div>
                </div>
                
                {activeTeeth.length > 0 && (
                  <div className="flex-1 border p-4 rounded-lg bg-primary/5 border-primary/20">
                    <h4 className="font-semibold mb-2 text-primary">Ações para dentes: <span className="font-bold">{activeTeeth.join(', ')}</span></h4>
                    <div className="mt-4 flex gap-2 flex-wrap">
                      <Button size="sm" variant="destructive" onClick={() => handleApplyToothStatus('carie')}>Marcar Cárie</Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleApplyToothStatus('restauracao')}>Registrar Restauração</Button>
                      <Button size="sm" variant="secondary" onClick={() => handleApplyToothStatus('extraido')}>Marcar Extração</Button>
                      <Button size="sm" variant="outline" onClick={() => handleApplyToothStatus('')}>Limpar Status</Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TRATAMENTOS */}
        <TabsContent value="tratamentos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Acompanhamento de Sessões</CardTitle>
                  <CardDescription>Crie interações para o tratamento</CardDescription>
                </div>
                <Badge variant={sessionProgress === 100 && totalSessions > 0 ? 'default' : 'outline'}>
                  {sessionProgress === 100 && totalSessions > 0 ? 'Concluído' : 'Aberto'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2 p-3 bg-zinc-50 border rounded-lg">
                    <Input 
                      placeholder="Nova etapa do tratamento" 
                      value={newSessionName} 
                      onChange={e => setNewSessionName(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && addSession()}
                      className="flex-1"
                    />
                    <Button onClick={addSession}>Add</Button>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progresso Geral</span>
                      <span className="font-medium">Sessão {completedSessions} de {totalSessions}</span>
                    </div>
                    <Progress value={sessionProgress} className="h-2" />
                  </div>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-white">
                    <div className="space-y-3">
                      {sessions.length === 0 ? (
                        <div className="text-center text-sm text-muted-foreground mt-10">
                          Nenhuma etapa configurada
                        </div>
                      ) : (
                        sessions.map((s) => (
                          <div 
                            key={s.id} 
                            className={`group flex items-start gap-3 cursor-pointer p-2 rounded hover:bg-zinc-100 transition-colors ${s.completed ? 'opacity-60' : ''}`} 
                            onClick={() => toggleSession(s.id)}
                          >
                            {s.completed ? (
                              <CheckCircle2 className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-zinc-300 mt-0.5 flex-shrink-0 bg-white" />
                            )}
                            <div className="flex-1">
                              <p className={`font-medium text-sm ${s.completed ? 'line-through text-muted-foreground' : ''}`}>{s.name}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                              onClick={(e) => { e.stopPropagation(); setSessions(sessions.filter(st => st.id !== s.id)); }}
                            >
                              <span className="text-lg leading-none">&times;</span>
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>

            {/* Gerador de Orcamento */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Orçamento Dinâmico</CardTitle>
                  <CardDescription>Adicione procedimentos</CardDescription>
                </div>
                <Badge variant="secondary">Rascunho</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2 p-3 bg-zinc-50 border rounded-lg">
                    <div className="text-sm font-semibold">Novo Procedimento</div>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Nome (ex: Limpeza)" 
                        value={newProcName} 
                        onChange={e => setNewProcName(e.target.value)} 
                        className="flex-1"
                      />
                      <Input 
                        placeholder="R$ Valor" 
                        type="number"
                        value={newProcPrice} 
                        onChange={e => setNewProcPrice(e.target.value)} 
                        className="w-24"
                      />
                      <Button onClick={addProcedure}>Add</Button>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-zinc-100 border-b">
                        <tr>
                          <th className="text-left py-2 px-4 font-medium">Procedimento</th>
                          <th className="text-right py-2 px-4 font-medium">Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {procedures.map(p => (
                          <tr key={p.id} className="border-b">
                            <td className="py-2 px-4">{p.name}</td>
                            <td className="text-right py-2 px-4">R$ {p.price.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-zinc-50 border-t">
                        <tr>
                          <td className="py-3 px-4 font-bold text-right">Total:</td>
                          <td className="py-3 px-4 font-bold text-right text-lg">R$ {totalOrcamento.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* IMAGENS E EXAMES */}
        <TabsContent value="imagens">
          <Card>
            <CardHeader>
              <CardTitle>Painel do Paciente: Imagens</CardTitle>
              <CardDescription>Simule uploads de arquivos médicos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div 
                  onClick={addImage}
                  className="aspect-square bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-300 flex flex-col items-center justify-center text-zinc-500 hover:border-primary hover:text-primary transition-colors cursor-pointer hover:bg-primary/5"
                >
                  <PlusCircle className="w-8 h-8 mb-2" />
                  <span className="font-medium text-sm">Fazer Upload Simulado</span>
                </div>
                
                {images.map(img => (
                  <div key={img.id} className="aspect-square bg-zinc-900 rounded-lg relative overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-600 via-zinc-800 to-black opacity-80 rounded flex items-center justify-center">
                          <span className="text-zinc-400 text-xs text-center">{img.type}</span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white text-sm font-medium">{img.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ESTOQUE */}
        <TabsContent value="estoque">
          <Card>
            <CardHeader>
              <CardTitle>Controle Clínico de Insumos</CardTitle>
              <CardDescription>Adicione ou consuma insumos descartáveis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                
                <div className="flex flex-col sm:flex-row gap-2 p-4 bg-zinc-50 border rounded-lg">
                    <Input 
                      placeholder="Nome do Insumo (ex: Luvas de Látex)" 
                      value={newItemName} 
                      onChange={e => setNewItemName(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && addInventoryItem()}
                      className="flex-1"
                    />
                    <Input 
                      placeholder="Quantidade (ex: 3 caixas)" 
                      value={newItemQtd} 
                      onChange={e => setNewItemQtd(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && addInventoryItem()}
                      className="sm:w-48"
                    />
                    <Button onClick={addInventoryItem}>Adicionar / Entrada</Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-100 border-b">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Material</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Quantidade</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map(item => (
                        <tr key={item.id} className="border-b">
                          <td className="py-3 px-4 font-medium">{item.name}</td>
                          <td className="py-3 px-4">{item.quantity}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className={item.badgeClass || 'bg-zinc-50 text-zinc-700 border-zinc-200'}>
                              {item.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Input 
                                type="number" 
                                placeholder="Qtd" 
                                className="w-16 h-8 text-xs px-2"
                                value={consumeAmounts[item.id] || ''}
                                onChange={(e) => setConsumeAmounts({...consumeAmounts, [item.id]: e.target.value})}
                                onKeyDown={(e) => e.key === 'Enter' && handleConsume(item.id)}
                              />
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-500 border-red-200 hover:text-red-700 hover:bg-red-50 h-8 text-xs px-2" 
                                onClick={() => handleConsume(item.id)}
                              >
                                Consumir
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-zinc-400 hover:text-red-600 rounded-full" 
                                onClick={() => setInventory(inventory.filter(i => i.id !== item.id))}
                                title="Excluir item"
                              >
                                <span className="text-lg leading-none">&times;</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {inventory.length === 0 && (
                        <tr><td colSpan={4} className="text-center py-6 text-muted-foreground">Estoque vazio.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
