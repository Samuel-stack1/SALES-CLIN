import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Goals = () => {
  const [revenueTarget, setRevenueTarget] = useState(150000);
  const [avgTicket, setAvgTicket] = useState(5000);
  const [schedulingRate, setSchedulingRate] = useState(60); 
  const [showupRate, setShowupRate] = useState(60);     
  const [closingRate, setClosingRate] = useState(45);    

  const [results, setResults] = useState({
    sales: 0, showups: 0, appointments: 0, leads: 0
  });

  useEffect(() => {
    const salesNeeded = avgTicket > 0 ? Math.ceil(revenueTarget / avgTicket) : 0;
    const showupsNeeded = closingRate > 0 ? Math.ceil(salesNeeded / (closingRate / 100)) : 0;
    const appointmentsNeeded = showupRate > 0 ? Math.ceil(showupsNeeded / (showupRate / 100)) : 0;
    const leadsNeeded = schedulingRate > 0 ? Math.ceil(appointmentsNeeded / (schedulingRate / 100)) : 0;
    setResults({ sales: salesNeeded, showups: showupsNeeded, appointments: appointmentsNeeded, leads: leadsNeeded });
  }, [revenueTarget, avgTicket, schedulingRate, showupRate, closingRate]);

  const applyFacebookPreset = () => {
    setRevenueTarget(150000); setAvgTicket(5000); setSchedulingRate(60); setShowupRate(60); setClosingRate(45);
  };

  const applyIndicationsPreset = () => {
    setRevenueTarget(45000); setAvgTicket(1200); setSchedulingRate(30); setShowupRate(60); setClosingRate(60);
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500 overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-primary font-headline tracking-tighter">Engenharia de Metas</h1>
          <p className="text-slate-500 font-medium text-sm">Planejamento estratégico de conversão</p>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button onClick={applyFacebookPreset} size="sm" className="rounded-xl bg-[#001B3D] hover:bg-black text-white px-4 font-black text-[9px] uppercase tracking-widest shadow-md">Config. Facebook</Button>
           <Button onClick={applyIndicationsPreset} size="sm" className="rounded-xl bg-secondary hover:bg-orange-600 text-white px-4 font-black text-[9px] uppercase tracking-widest shadow-lg shadow-orange-500/20">Config. Indicações</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-4 space-y-4">
          <Card className="rounded-[2rem] border-slate-100 bg-white flex flex-col h-full border overflow-hidden shadow-none transition-all">
            <div className="bg-primary/5 p-6 border-b border-primary/10">
               <h3 className="text-primary font-black text-base font-headline flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-xl">tune</span>
                  Parâmetros
               </h3>
            </div>
            <CardContent className="p-6 space-y-6 flex-1">
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Faturamento Meta</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">R$</span>
                  <input 
                    type="number" value={revenueTarget} 
                    onChange={(e) => setRevenueTarget(Number(e.target.value))}
                    className="flex w-full rounded-xl border border-slate-200 bg-slate-50/50 h-11 text-lg font-black pl-11 focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticket Médio</Label>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">R$</span>
                   <input 
                    type="number" value={avgTicket} 
                    onChange={(e) => setAvgTicket(Number(e.target.value))}
                    className="flex w-full rounded-xl border border-slate-200 bg-slate-50/50 h-11 text-lg font-black pl-11 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="pt-4 space-y-6 border-t border-slate-50">
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black">
                       <span className="text-slate-500 uppercase tracking-widest">Lead → Agenda</span>
                       <span className="text-secondary font-black bg-secondary/5 px-2 py-0.5 rounded-lg border border-secondary/10">{schedulingRate}%</span>
                    </div>
                    <Slider value={[schedulingRate]} onValueChange={(v) => setSchedulingRate(v[0])} max={100} min={5} step={1} />
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black">
                       <span className="text-slate-500 uppercase tracking-widest">Agenda → Presença</span>
                       <span className="text-secondary font-black bg-secondary/5 px-2 py-0.5 rounded-lg border border-secondary/10">{showupRate}%</span>
                    </div>
                    <Slider value={[showupRate]} onValueChange={(v) => setShowupRate(v[0])} max={100} min={5} step={1} />
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black">
                       <span className="text-slate-500 uppercase tracking-widest">Presença → Venda</span>
                       <span className="text-emerald-500 font-black bg-emerald-500/5 px-2 py-0.5 rounded-lg border border-emerald-500/10">{closingRate}%</span>
                    </div>
                    <Slider value={[closingRate]} onValueChange={(v) => setClosingRate(v[0])} max={100} min={5} step={1} />
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 flex flex-col min-w-0">
           <div className="bg-[#001B3D] p-6 md:p-8 rounded-[2.5rem] relative overflow-hidden flex flex-col h-full border border-white/5 shadow-none transition-all">
              <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-secondary opacity-5 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col h-full space-y-6 md:space-y-8">
                 <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black font-headline text-white tracking-widest uppercase">Plano de Escala</h3>
                    <div className="flex items-center gap-2 text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-4 py-1.5 rounded-xl border border-emerald-400/20">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                       Viável
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <div className="p-4 md:p-5 bg-white/[0.03] rounded-2xl border border-white/5 space-y-3 hover:bg-white/[0.05] transition-all group min-w-0">
                       <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/20">
                          <span className="material-symbols-outlined text-xl text-white">groups</span>
                       </div>
                       <div className="space-y-0.5 overflow-hidden text-white">
                          <p className="text-white/60 text-[8px] font-black uppercase tracking-widest truncate">Leads</p>
                          <h4 className="text-xl md:text-2xl font-black text-secondary truncate">{results.leads.toLocaleString()}</h4>
                          <p className="text-white/20 text-[7px] font-bold uppercase tracking-widest truncate">Volume Necessário</p>
                       </div>
                    </div>

                    <div className="p-4 md:p-5 bg-white/[0.03] rounded-2xl border border-white/5 space-y-3 hover:bg-white/[0.05] transition-all group min-w-0">
                       <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/20">
                          <span className="material-symbols-outlined text-xl text-blue-500">calendar_month</span>
                       </div>
                       <div className="space-y-0.5 overflow-hidden text-white">
                          <p className="text-white/60 text-[8px] font-black uppercase tracking-widest truncate">Agendamentos</p>
                          <h4 className="text-xl md:text-2xl font-black text-white truncate">{results.appointments.toLocaleString()}</h4>
                          <p className="text-blue-500/40 text-[7px] font-black uppercase tracking-widest truncate">{schedulingRate}% de Taxa</p>
                       </div>
                    </div>

                    <div className="p-4 md:p-5 bg-white/[0.03] rounded-2xl border border-white/5 space-y-3 hover:bg-white/[0.05] transition-all group min-w-0">
                       <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
                          <span className="material-symbols-outlined text-xl text-indigo-400">how_to_reg</span>
                       </div>
                       <div className="space-y-0.5 overflow-hidden text-white">
                          <p className="text-white/60 text-[8px] font-black uppercase tracking-widest truncate">Presenças</p>
                          <h4 className="text-xl md:text-2xl font-black text-white truncate">{results.showups.toLocaleString()}</h4>
                          <p className="text-indigo-500/40 text-[7px] font-black uppercase tracking-widest truncate">{showupRate}% de Taxa</p>
                       </div>
                    </div>

                    <div className="p-4 md:p-5 bg-secondary/10 rounded-2xl border border-secondary/20 space-y-3 shadow-none relative min-w-0 overflow-hidden">
                       <div className="absolute top-0 right-0 w-1 h-full bg-secondary/30"></div>
                       <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/50">
                          <span className="material-symbols-outlined text-xl text-white">handshake</span>
                       </div>
                       <div className="space-y-0.5 overflow-hidden text-white">
                          <p className="text-secondary text-[8px] font-black uppercase tracking-widest truncate">Vendas</p>
                          <h4 className="text-xl md:text-2xl font-black text-white truncate">{results.sales.toLocaleString()}</h4>
                          <p className="text-white/30 text-[7px] font-bold uppercase tracking-widest truncate">{closingRate}% de Conversão</p>
                       </div>
                    </div>
                 </div>

                 <div className="mt-auto bg-gradient-to-br from-white/[0.03] to-transparent rounded-3xl border border-white/5 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
                    <div className="space-y-1 text-center md:text-left min-w-0">
                       <p className="text-secondary text-[9px] font-black uppercase tracking-[0.3em] truncate drop-shadow-[0_0_8px_rgba(255,122,0,0.3)]">Faturamento Projetado</p>
                       <h2 className="text-3xl md:text-5xl font-black font-headline text-white tracking-tighter leading-none">{formatCurrency(results.sales * avgTicket)}</h2>
                       <div className="flex flex-wrap items-center gap-3 mt-4 justify-center md:justify-start">
                          <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-white/50 text-[8px] font-black uppercase tracking-widest uppercase">
                             Ticket: {formatCurrency(avgTicket)}
                          </div>
                          <div className="px-3 py-1 bg-secondary/10 rounded-lg border border-secondary/10 text-secondary text-[8px] font-black uppercase tracking-widest">
                             CPL Máx: R$ {(results.leads > 0 ? (results.sales * avgTicket) / results.leads / 8 : 0).toFixed(2)}
                          </div>
                       </div>
                    </div>
                    
                    <Button className="h-14 md:h-16 px-10 rounded-2xl bg-secondary text-white hover:bg-orange-600 font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-secondary/30 active:scale-95 group/btn">
                       Salvar Plano
                       <span className="material-symbols-outlined ml-2 group-hover/btn:translate-x-1 transition-transform">send</span>
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
