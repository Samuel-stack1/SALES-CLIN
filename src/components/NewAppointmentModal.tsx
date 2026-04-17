import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { clientsApi, catalogsApi, appointmentsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface NewAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialDate?: Date;
}

export function NewAppointmentModal({
  open,
  onOpenChange,
  onSuccess,
  initialDate,
}: NewAppointmentModalProps) {
  const { professional } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  
  // Data lists
  const [clients, setClients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  // Form state
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [clientOpen, setClientOpen] = useState(false);
  
  const [selectedService, setSelectedService] = useState<string>("");
  const [date, setDate] = useState<string>(
    initialDate ? format(initialDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
  );
  const [time, setTime] = useState<string>("09:00");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    setDataLoading(true);
    try {
      const [clientsRes, servicesRes] = await Promise.all([
        clientsApi.getAll({ pageSize: 100 }),
        catalogsApi.getAll({ pageSize: 100 })
      ]);
      
      if (clientsRes.success) setClients(clientsRes.data || []);
      if (servicesRes.success) setServices(servicesRes.data || []);
    } catch (error) {
      console.error("Error loading modal data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedClient || !selectedService || !date || !time) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!professional) return;

    setLoading(true);
    try {
      // Calcular endTime baseado na duração do serviço (padrão 30min se não tiver)
      const service = services.find(s => s.id.toString() === selectedService);
      const duration = service?.duration || 30;
      
      const startDateTime = new Date(`${date}T${time}:00`);
      const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

      const response = await appointmentsApi.create({
        professionalId: Number(professional.id),
        clientId: Number(selectedClient),
        serviceId: Number(selectedService),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        status: 'agendado',
        notes: notes
      });

      if (response.success) {
        toast({
          title: "Sucesso!",
          description: "Agendamento criado com sucesso.",
        });
        onSuccess();
        onOpenChange(false);
        resetForm();
      } else {
        toast({
          title: "Erro ao criar agendamento",
          description: response.error?.message || "Erro desconhecido",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro de conexão com o servidor.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedClient("");
    setSelectedService("");
    setNotes("");
    setTime("09:00");
  };

  const selectedClientData = clients.find((c) => c.id.toString() === selectedClient);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Novo Agendamento</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Patient Selector (Combobox) */}
          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-medium">Paciente *</Label>
            <Popover open={clientOpen} onOpenChange={setClientOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={clientOpen}
                  className="w-full justify-between font-normal"
                  disabled={dataLoading}
                >
                  {selectedClient
                    ? clients.find((c) => c.id.toString() === selectedClient)?.name
                    : "Selecionar paciente..."}
                  {dataLoading ? <Loader2 className="ml-2 h-4 w-4 animate-spin shrink-0 opacity-50" /> : <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar paciente..." />
                  <CommandList>
                    <CommandEmpty>Nenhum paciente encontrado.</CommandEmpty>
                    <CommandGroup>
                      {clients.map((client) => (
                        <CommandItem
                          key={client.id}
                          value={client.name}
                          onSelect={() => {
                            setSelectedClient(client.id.toString());
                            setClientOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedClient === client.id.toString() ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {client.name}
                          <span className="ml-2 text-xs text-muted-foreground">{client.phone}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <div className="p-2 border-t">
                      <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-primary" onClick={() => window.location.href='/clients'}>
                        <Plus className="mr-2 h-3 w-3" /> Cadastrar novo paciente
                      </Button>
                    </div>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Service Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Procedimento / Serviço *</Label>
            <Select value={selectedService} onValueChange={setSelectedService} disabled={dataLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                {services.length === 0 && !dataLoading && <SelectItem value="none" disabled>Nenhum serviço cadastrado</SelectItem>}
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    <div className="flex justify-between w-full gap-8">
                      <span>{service.name}</span>
                      <span className="text-muted-foreground text-xs">{service.price ? `R$ ${service.price}` : ""}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Data *</Label>
              <Input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Horário *</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return [`${hour}:00`, `${hour}:30`];
                  }).flat().map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Observações</Label>
            <Input 
              placeholder="Ex: Paciente com urgência, primeira vez..." 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar Agendamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
