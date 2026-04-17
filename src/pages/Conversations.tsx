import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Phone, Calendar, Search, Filter, ExternalLink } from 'lucide-react';

// Mock data para conversas do bot
const mockConversations: any[] = [];

const Conversations = () => {
  const [conversations, setConversations] = useState(mockConversations);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'converted':
        return <Badge className="bg-green-100 text-green-800">Convertida</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">Em Andamento</Badge>;
      case 'abandoned':
        return <Badge className="bg-red-100 text-red-800">Abandonada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredConversations = conversations.filter(conversation => {
    const matchesFilter = filter === 'all' || conversation.status === filter;
    const matchesSearch = conversation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.clientPhone.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: conversations.length,
    converted: conversations.filter(c => c.status === 'converted').length,
    inProgress: conversations.filter(c => c.status === 'in_progress').length,
    abandoned: conversations.filter(c => c.status === 'abandoned').length
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Conversas do Bot</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Histórico e análise das interações automatizadas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Conversas
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Todas as interações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Convertidas
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.converted}</div>
            <p className="text-xs text-muted-foreground">
              Resultaram em agendamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Em Andamento
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Conversas ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conversão
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Conversas → Agendamentos
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Conversas</CardTitle>
          <CardDescription>
            Todas as interações do bot com potenciais clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Buscar por cliente ou telefone</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Digite o nome ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="min-w-[180px]">
              <Label>Status da conversa</Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="converted">Convertidas</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="abandoned">Abandonadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conversations List */}
          <div className="space-y-4">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-4"
              >
                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-medium">{conversation.clientName}</h4>
                    {getStatusBadge(conversation.status)}
                    {conversation.appointmentScheduled && (
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        Agendado
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {conversation.clientPhone}
                    </span>
                    <span>
                      {conversation.messageCount} mensagens
                    </span>
                    <span>
                      Iniciada: {new Date(conversation.startDate).toLocaleDateString('pt-BR')} às {new Date(conversation.startDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <p className="text-sm bg-muted/50 p-3 rounded-md">
                    {conversation.summary}
                  </p>
                </div>
                
                <div className="flex flex-row sm:flex-col gap-2 sm:ml-4">
                  <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                    <MessageSquare className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline">Ver Chat</span>
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                    <Phone className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline">Ligar</span>
                  </Button>
                  {conversation.status === 'in_progress' && (
                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                      <ExternalLink className="h-3 w-3 sm:mr-1" />
                      <span className="hidden sm:inline">Intervir</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {filteredConversations.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm || filter !== 'all' 
                  ? 'Nenhuma conversa encontrada com os filtros aplicados.' 
                  : 'Nenhuma conversa registrada ainda.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Conversations;