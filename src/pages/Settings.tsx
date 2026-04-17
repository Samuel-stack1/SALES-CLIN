import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings as SettingsIcon, 
  DollarSign, 
  BarChart3, 
  Building, 
  Package, 
  Monitor,
  Bell,
  Wifi,
  Webhook,
  Plus,
  Trash2,
  Clock,
  CreditCard,
  Image as ImageIcon,
  CheckCircle2,
  Lock,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

// -- COMPONENTES DE CONFIGURAÇÃO (MOCKS) --

const ServicosView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="font-medium text-sm">Serviços Ativos (3)</h3>
      <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Novo</Button>
    </div>
    <div className="space-y-3">
      {[
        { name: 'Consulta Odontológica', price: 'R$ 150', time: '30 min' },
        { name: 'Limpeza de Pele', price: 'R$ 120', time: '45 min' },
        { name: 'Terapia Manual', price: 'R$ 200', time: '60 min' }
      ].map((s, i) => (
        <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-zinc-50/50 hover:border-primary/30 transition-colors">
          <div>
            <div className="font-medium text-sm">{s.name}</div>
            <div className="text-xs text-muted-foreground flex gap-3 mt-1">
              <span className="font-semibold text-primary">{s.price}</span>
              <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/>{s.time}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4"/></Button>
        </div>
      ))}
    </div>
  </div>
);

const CronogramaView = () => (
  <div className="space-y-6">
    <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
      Configure os horários padrão (janela de atendimento) em que o sistema permitirá agendamentos online.
    </div>
    <div className="space-y-4">
      {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map((dia) => (
        <div key={dia} className="flex items-center justify-between gap-4">
          <Switch defaultChecked />
          <div className="w-20 font-medium text-sm">{dia}</div>
          <div className="flex items-center gap-2 flex-1">
            <Select defaultValue="08">
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent><SelectItem value="08">08:00</SelectItem><SelectItem value="09">09:00</SelectItem></SelectContent>
            </Select>
            <span className="text-muted-foreground text-sm">até</span>
            <Select defaultValue="18">
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent><SelectItem value="18">18:00</SelectItem><SelectItem value="19">19:00</SelectItem></SelectContent>
            </Select>
          </div>
        </div>
      ))}
      <Separator />
      {['Sábado', 'Domingo'].map((dia) => (
        <div key={dia} className="flex items-center justify-between gap-4 opacity-50">
          <Switch />
          <div className="w-20 font-medium text-sm">{dia}</div>
          <div className="flex items-center gap-2 flex-1">
            <Input disabled placeholder="00:00" />
            <span className="text-muted-foreground text-sm">até</span>
            <Input disabled placeholder="00:00" />
          </div>
        </div>
      ))}
    </div>
    <Button className="w-full mt-4">Salvar Horários</Button>
  </div>
);

const PagamentoOnlineView = () => (
  <div className="space-y-6">
    <div className="space-y-4">
      <Card className="border-primary/50 shadow-sm bg-primary/5">
        <CardContent className="p-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center text-white font-bold">S</div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-blue-900">Stripe</h4>
            <p className="text-xs text-blue-800/70">Cartão de Crédito, Apple Pay</p>
          </div>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Conectado</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-start gap-4 opacity-80">
          <div className="w-10 h-10 rounded bg-[#009EE3] flex items-center justify-center text-white font-bold">MP</div>
          <div className="flex-1">
            <h4 className="font-bold text-sm">Mercado Pago</h4>
            <p className="text-xs text-muted-foreground">Pix, Boleto, Cartão Local</p>
          </div>
          <Button variant="outline" size="sm">Conectar</Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-start gap-4 opacity-80">
          <div className="w-10 h-10 rounded bg-emerald-500 flex items-center justify-center text-white font-bold">P</div>
          <div className="flex-1">
            <h4 className="font-bold text-sm">Pagar.me</h4>
            <p className="text-xs text-muted-foreground">Antecipação Automática</p>
          </div>
          <Button variant="outline" size="sm">Conectar</Button>
        </CardContent>
      </Card>
    </div>
    <Separator />
    <div className="space-y-3">
      <Label>Moeda de Cobrança Principal</Label>
      <Select defaultValue="brl">
        <SelectTrigger><SelectValue/></SelectTrigger>
        <SelectContent>
          <SelectItem value="brl">BRL (R$) - Real Brasileiro</SelectItem>
          <SelectItem value="usd">USD ($) - Dólar Americano</SelectItem>
          <SelectItem value="eur">EUR (€) - Euro</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

const EquipeView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="font-medium text-sm">Membros Cadastrados (3)</h3>
      <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Convidar</Button>
    </div>
    <div className="space-y-3">
      {[
        { name: 'Dr. Roberto', role: 'Doutor', email: 'roberto@clinica.com' },
        { name: 'Ana Souza', role: 'Recepcionista', email: 'ana@clinica.com' },
        { name: 'Marcos Admin', role: 'Administrador', email: 'admin@clinica.com' }
      ].map((u, i) => (
        <div key={i} className="flex justify-between items-center p-3 border rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs uppercase">
              {u.name.substring(0,2)}
            </div>
            <div>
              <div className="font-medium text-sm">{u.name}</div>
              <div className="text-xs text-muted-foreground">{u.email}</div>
            </div>
          </div>
          <div className="text-xs font-medium px-2 py-1 bg-zinc-100 text-zinc-600 border rounded-full">{u.role}</div>
        </div>
      ))}
    </div>
    <Button variant="outline" className="w-full">Gerenciar Permissões das Equipes</Button>
  </div>
);

const WebhookView = () => (
  <div className="space-y-6">
    <div className="p-3 bg-amber-50 text-amber-800 rounded-lg text-sm border border-amber-100 flex items-start gap-3">
      <Lock className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        <strong className="block mb-1">Atenção Desenvolvedor</strong> 
        Webhooks permitem enviar dados em tempo real (JSON) para outras aplicações ou sistemas quando um evento interno ocorre no CRM.
      </div>
    </div>
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Endpoint URL para Disparo</Label>
        <Input placeholder="https://sua-api.com.br/webhook" defaultValue="https://zapier.com/hooks/catch/123/456/" />
      </div>
      <div className="space-y-2">
        <Label>Chave Secreta de Assinatura (Read Only)</Label>
        <Input value="whsec_83jdh82jdn28xj2nd8238..." type="password" readOnly className="font-mono text-xs text-muted-foreground cursor-not-allowed bg-zinc-50" />
      </div>
      <Separator />
      <div className="space-y-3">
        <Label className="text-base font-semibold">Gatilhos de Eventos</Label>
        <div className="space-y-3 p-4 border rounded-lg bg-zinc-50/30">
          <div className="flex items-center justify-between"><div className="flex flex-col"><span className="text-sm font-medium">agendamento.criado</span><span className="text-xs text-muted-foreground">Dispara ao criar novo agendamento</span></div><Switch defaultChecked /></div>
          <Separator />
          <div className="flex items-center justify-between"><div className="flex flex-col"><span className="text-sm font-medium">agendamento.cancelado</span><span className="text-xs text-muted-foreground">Dispara no cancelamento</span></div><Switch defaultChecked /></div>
          <Separator />
          <div className="flex items-center justify-between"><div className="flex flex-col"><span className="text-sm font-medium">pagamento.aprovado</span><span className="text-xs text-muted-foreground">Quando checkout é aprovado</span></div><Switch /></div>
        </div>
      </div>
      <Button className="w-full">Salvar Integração</Button>
    </div>
  </div>
);

const InfoNegocioView = () => (
  <div className="space-y-5">
    <div className="flex justify-center mb-4">
      <div className="relative group cursor-pointer">
        <div className="w-24 h-24 rounded-full bg-zinc-100 border-2 border-dashed border-zinc-300 flex items-center justify-center group-hover:border-primary/50 transition-colors">
          <ImageIcon className="w-8 h-8 text-zinc-400 group-hover:text-primary transition-colors" />
        </div>
        <Badge className="absolute -bottom-2 font-normal text-xs left-1/2 -translate-x-1/2 whitespace-nowrap shadow-sm group-hover:bg-primary">
          Fazer Upload
        </Badge>
      </div>
    </div>
    <div className="space-y-2">
      <Label>Razão Social / Nome de Exibição Público</Label>
      <Input defaultValue="Clínica AuraMed Saudável Ltda" />
    </div>
    <div className="space-y-2">
      <Label>CNPJ / Documento do País</Label>
      <Input defaultValue="00.000.000/0001-00" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>CEP</Label>
        <Input defaultValue="01001-000" />
      </div>
      <div className="space-y-2">
        <Label>Número / Complemento</Label>
        <Input defaultValue="123 - Sala 4B" />
      </div>
    </div>
    <div className="space-y-2">
      <Label>Informação Extra no Cabeçalho de Faturas</Label>
      <Textarea placeholder="Mensagem padrão no bottom da nota" />
    </div>
    <Button className="w-full">Salvar Informações da Empresa</Button>
  </div>
);

const GenericFallback = ({ name }: { name: string }) => (
  <div className="text-center py-10 space-y-4">
    <div className="w-16 h-16 rounded-full bg-secondary text-primary mx-auto flex items-center justify-center relative">
      <SettingsIcon className="w-8 h-8 opacity-50" />
      <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-full animate-pulse border-2 border-white"></div>
    </div>
    <div>
      <h3 className="font-semibold text-lg">Módulo {name}</h3>
      <p className="text-sm text-muted-foreground max-w-[250px] mx-auto mt-2">
        O painel detalhado de {name.toLowerCase()} está sendo disponibilizado nesta versão.
      </p>
    </div>
  </div>
);

// Map of components per setting generic string
const ViewsMap: Record<string, React.FC<any>> = {
  'Serviços': ServicosView,
  'Cronograma': CronogramaView,
  'Pagamento online': PagamentoOnlineView,
  'Equipe': EquipeView,
  'Webhook': WebhookView,
  'Informações': InfoNegocioView,
  'Configurações': InfoNegocioView // reusing Business configs
};

const Settings = () => {
  const { toast } = useToast();
  const [selectedSetting, setSelectedSetting] = useState<{name: string, description: string} | null>(null);

  const settingsSections = [
    {
      title: 'Configurações Gerais',
      icon: SettingsIcon,
      items: [
        { name: 'Serviços', description: 'Gerencie os serviços oferecidos' },
        { name: 'Cargos', description: 'Configure os cargos da equipe' },
        { name: 'Equipe', description: 'Gerencie membros da equipe' },
        { name: 'Cronograma', description: 'Configure horários de funcionamento' },
        { name: 'Recursos', description: 'Gerencie recursos disponíveis' },
        { name: 'Calendário de agendamentos', description: 'Configurações do calendário' },
      ]
    },
    {
      title: 'Financeiro',
      icon: DollarSign,
      items: [
        { name: 'Pagamento online', description: 'Configure métodos de pagamento' },
        { name: 'Checkout', description: 'Configurações do processo de pagamento' },
        { name: 'Recibos', description: 'Configurações de recibos e faturas' },
      ]
    },
    {
      title: 'Relatórios',
      icon: BarChart3,
      items: [
        { name: 'Retenção', description: 'Relatórios de retenção de clientes' },
      ]
    },
    {
      title: 'Meu negócio',
      icon: Building,
      items: [
        { name: 'Configurações', description: 'Informações básicas do negócio' },
        { name: 'Informações', description: 'Dados de contato e localização' },
      ]
    },
    {
      title: 'Categorias',
      icon: Package,
      items: [
        { name: 'Agendamento', description: 'Categorias de agendamentos' },
        { name: 'Eventos', description: 'Tipos de eventos' },
        { name: 'Categorias de Clientes', description: 'Segmentação de clientes' },
      ]
    },
    {
      title: 'Inventário',
      icon: Package,
      items: [
        { name: 'Configurações', description: 'Configurações do inventário' },
      ]
    },
    {
      title: 'Configurações do sistema',
      icon: Monitor,
      items: [
        { name: 'Notificações', description: 'Configurações de notificações' },
        { name: 'Redes', description: 'Integrações com redes sociais' },
        { name: 'Webhook', description: 'Configurações de webhooks' },
      ]
    }
  ];

  const handleSaveQuick = () => {
    toast({ title: 'Sucesso!', description: 'Opções rápidas atualizadas no servidor.' });
  }

  // Define Active View safely
  const ActiveView = selectedSetting ? (ViewsMap[selectedSetting.name] || GenericFallback) : null;

  return (
    <div className="w-full space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Painel de Configurações</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Ajuste permissões, negócios, agendamentos e API.
          </p>
        </div>
        <ThemeToggle />
      </div>

      <Separator className="my-6" />

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {settingsSections.map((section) => (
          <Card key={section.title} className="hover:shadow-sm transition-shadow">
            <CardHeader className="pb-3 border-b bg-zinc-50/50">
              <CardTitle className="flex items-center gap-2 text-base sm:text-md">
                <section.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {section.items.map((item) => (
                  <div 
                    key={item.name}
                    onClick={() => setSelectedSetting(item)}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-primary/5 cursor-pointer transition-all gap-3"
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="font-semibold text-sm group-hover:text-primary transition-colors">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                    <Button variant="outline" size="sm" className="hidden sm:inline-flex shrink-0 text-xs shadow-none group-hover:bg-primary group-hover:text-white transition-all w-24">
                      Configurar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-8" />

      {/* Quick Settings Pinned */}
      <div className="max-w-2xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-muted-foreground" />
          Ações Rápidas Populares
        </h3>
        <Card className="border-zinc-200">
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications" className="text-sm">Emails Administrativos</Label>
                    <div className="text-xs text-muted-foreground">Aviso ao criar novo agendamento</div>
                  </div>
                  <Switch id="notifications" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reminders" className="text-sm">Lembrete Automático</Label>
                    <div className="text-xs text-muted-foreground">Dispara e-mail/SMS para cliente</div>
                  </div>
                  <Switch id="reminders" defaultChecked />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t mt-4">
              <Button variant="default" className="text-xs h-8" onClick={handleSaveQuick}>Gravar Ajustes</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* THE DRAWING SHEET CONFIG MENU (The Magic Drawer) */}
      <Sheet open={!!selectedSetting} onOpenChange={(open) => !open && setSelectedSetting(null)}>
        <SheetContent className="w-[90vw] sm:max-w-md md:max-w-xl overflow-y-auto p-0 flex flex-col border-l shadow-2xl">
          {selectedSetting && (
            <>
              {/* Sheet Header Custom */}
              <div className="px-6 py-6 border-b bg-zinc-50/80 sticky top-0 z-10 backdrop-blur pb-6">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                    {selectedSetting.name}
                  </SheetTitle>
                  <SheetDescription className="text-sm">
                    {selectedSetting.description}
                  </SheetDescription>
                </SheetHeader>
              </div>
              
              {/* Variable Content injected via Map */}
              <div className="flex-1 p-6">
                {ActiveView && <ActiveView name={selectedSetting.name} />}
              </div>

              {/* Universal Footer Action if applicable or just aesthetic spacer */}
              <div className="p-4 bg-zinc-50 border-t mt-auto text-xs text-center text-muted-foreground">
                Módulo Auraia CRM v1.0.5 - Configurações protegidas.
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

    </div>
  );
};

export default Settings;