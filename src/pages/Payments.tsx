import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Calendar,
  Search,
  Filter,
  TrendingUp,
  Users,
  CreditCard,
  Plus,
  Eye,
  BarChart3
} from "lucide-react";

// Mock de dados de clientes com pacotes (adaptado para clínica de depilação a laser)
const mockClientPackages: any[] = [];

const Payments = () => {
  const [clients] = useState(mockClientPackages);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>;
      case "completed":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Finalizado</Badge>;
      case "overdue":
        return <Badge variant="destructive">Em Atraso</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500 hover:bg-green-600">Pago</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pendente</Badge>;
      case "overdue":
        return <Badge variant="destructive">Atrasado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "overdue" && client.status === "overdue") ||
      (filter === "active" && client.status === "active") ||
      (filter === "monthly" && client.packageType.toLowerCase().includes("mensal")) ||
      (filter === "package" && client.packageType.toLowerCase().includes("pacote"));

    const matchesSearch =
      client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.packageType.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Calcular estatísticas gerais
  const allPayments = clients.flatMap((c) => c.payments);
  const confirmedRevenue = allPayments
    .filter((p) => p.status === "paid")
    .reduce((acc, p) => acc + p.amount, 0);
  const pendingAmount = allPayments
    .filter((p) => p.status === "pending")
    .reduce((acc, p) => acc + p.amount, 0);
  const overdueAmount = allPayments
    .filter((p) => p.status === "overdue")
    .reduce((acc, p) => acc + p.amount, 0);
  const activeContracts = clients.filter((c) => c.status === "active").length;

  // Próximos vencimentos (7 dias)
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const upcomingPayments = clients.filter((c) => {
    const paymentDate = new Date(c.nextPayment.date);
    return paymentDate >= today && paymentDate <= nextWeek;
  }).length;

  const handleAddManualPayment = (clientId: string) => {
    toast({
      title: "Adicionar Pagamento",
      description: `Funcionalidade em desenvolvimento para o cliente ${clientId}`,
    });
  };

  const handleViewContract = (clientId: string) => {
    toast({
      title: "Ver Detalhes",
      description: `Abrindo detalhes do contrato do cliente ${clientId}`,
    });
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão Financeira</h1>
        <p className="text-muted-foreground">
          Controle de pacotes, planos e pagamentos de clientes
        </p>
      </div>

      {/* Tabs principais */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        {/* Tab: Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          {/* Cards de Resumo Financeiro */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Confirmada</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {confirmedRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Pagamentos recebidos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {pendingAmount.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Aguardando pagamento</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  R$ {overdueAmount.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Requer atenção</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contratos Ativos</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeContracts}</div>
                <p className="text-xs text-muted-foreground">Pacotes em andamento</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximos Vencimentos</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingPayments}</div>
                <p className="text-xs text-muted-foreground">Nos próximos 7 dias</p>
              </CardContent>
            </Card>
          </div>

          {/* Gerenciamento de Pagamentos */}
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Pagamentos</CardTitle>
              <CardDescription>
                Clientes agrupados por pacotes e planos ativos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filtros e Busca */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por cliente, serviço ou tipo de pacote..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filtrar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="overdue">Em Atraso</SelectItem>
                      <SelectItem value="active">Pacotes Ativos</SelectItem>
                      <SelectItem value="monthly">Mensalidades</SelectItem>
                      <SelectItem value="package">Pacotes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Lista de Clientes com Accordion */}
              <div className="space-y-2">
                {filteredClients.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>Nenhum cliente encontrado com os filtros aplicados.</p>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredClients.map((client) => (
                      <AccordionItem key={client.id} value={client.id}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex flex-col items-start gap-2 text-left">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold">{client.clientName}</span>
                                {getStatusBadge(client.status)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {client.service} • {client.packageType}
                              </div>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                              <div className="text-right">
                                <p className="font-medium">
                                  Progresso: {client.progress.completed}/{client.progress.total}
                                </p>
                                <Progress
                                  value={(client.progress.completed / client.progress.total) * 100}
                                  className="w-24 mt-1"
                                />
                              </div>
                              <div className="text-right">
                                <p className="text-muted-foreground">Próximo:</p>
                                <p className="font-medium">{client.nextPayment.date}</p>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="pt-4 space-y-4">
                            {/* Informações do Próximo Pagamento */}
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Próximo Pagamento
                              </h4>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Data</p>
                                  <p className="font-medium">{client.nextPayment.date}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Valor</p>
                                  <p className="font-medium text-lg">
                                    R$ {client.nextPayment.amount.toFixed(2)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Método</p>
                                  <p className="font-medium">{client.nextPayment.method}</p>
                                </div>
                              </div>
                            </div>

                            {/* Histórico de Pagamentos */}
                            <div>
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Histórico de Pagamentos
                              </h4>
                              <div className="space-y-2">
                                {client.payments.map((payment) => (
                                  <div
                                    key={payment.id}
                                    className="flex items-center justify-between p-3 border rounded-lg bg-card"
                                  >
                                    <div className="flex items-center gap-4">
                                      <div>
                                        <p className="font-medium">{payment.date}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {payment.method}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <p className="font-semibold">
                                        R$ {payment.amount.toFixed(2)}
                                      </p>
                                      {getPaymentStatusBadge(payment.status)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Ações */}
                            <div className="flex gap-2 pt-2">
                              <Button
                                onClick={() => handleAddManualPayment(client.id)}
                                className="flex-1"
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Pagamento Manual
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleViewContract(client.id)}
                                className="flex-1"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalhes do Contrato
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Relatórios */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Card: Receita Total */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Receita Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  R$ {confirmedRevenue.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Total de receitas confirmadas no período
                </p>
              </CardContent>
            </Card>

            {/* Card: Ticket Médio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Ticket Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  R${" "}
                  {clients.length > 0
                    ? (confirmedRevenue / clients.length).toFixed(2)
                    : "0.00"}
                </div>
                <p className="text-sm text-muted-foreground">
                  Valor médio por cliente ativo
                </p>
              </CardContent>
            </Card>

            {/* Card: Taxa de Inadimplência */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Taxa de Inadimplência
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {allPayments.length > 0
                    ? (
                        (allPayments.filter((p) => p.status === "overdue").length /
                          allPayments.length) *
                        100
                      ).toFixed(1)
                    : "0.0"}
                  %
                </div>
                <p className="text-sm text-muted-foreground">
                  Porcentagem de pagamentos em atraso
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Serviços Mais Vendidos */}
          <Card>
            <CardHeader>
              <CardTitle>Serviços Mais Vendidos</CardTitle>
              <CardDescription>
                Ranking dos tratamentos mais contratados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {([] as any[]).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{item.service}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress
                          value={(item.count / 20) * 100}
                          className="flex-1 max-w-[200px]"
                        />
                        <span className="text-sm text-muted-foreground">
                          {item.count} contratos
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">R$ {item.revenue.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">receita total</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Evolução Mensal (Mock) */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução da Receita Mensal</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {([] as any[]).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.month}</span>
                    <div className="flex items-center gap-3">
                      <Progress value={(item.revenue / 10000) * 100} className="w-40" />
                      <span className="font-semibold min-w-[100px] text-right">
                        R$ {item.revenue.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payments;
