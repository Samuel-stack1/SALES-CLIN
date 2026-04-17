import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  FileText, 
  Download, 
  Send, 
  Search, 
  Filter,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Trash2,
  MousePointer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PDFViewer } from '@/components/PDFViewer';
import { DocumentViewer } from '@/components/DocumentViewer';

interface Contract {
  id: string;
  clientName: string;
  documentName: string;
  status: 'pending' | 'signed' | 'sent';
  createdAt: string;
  signedAt?: string;
  documentUrl: string;
}

const ContractSignature = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string>('');
  const [isSignatureMode, setIsSignatureMode] = useState(false);
  const [signaturePosition, setSignaturePosition] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);
  const pdfViewerRef = useRef<HTMLDivElement>(null);

  // Mock data for contracts history
  const [contracts] = useState<Contract[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      // Criar URL temporária para visualização
      const url = URL.createObjectURL(file);
      setSelectedFileUrl(url);
      toast({
        title: "PDF carregado com sucesso",
        description: `Arquivo: ${file.name}`,
      });
    } else {
      toast({
        title: "Erro no upload",
        description: "Por favor, selecione apenas arquivos PDF.",
        variant: "destructive",
      });
    }
  };

  const handleSignaturePosition = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!isSignatureMode) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setSignaturePosition({ x, y });
    toast({
      title: "Posição da assinatura definida",
      description: `Coordenadas: X: ${Math.round(x)}, Y: ${Math.round(y)}`,
    });
  }, [isSignatureMode]);

  const handleApplySignature = () => {
    if (!selectedFile) {
      toast({
        title: "Erro",
        description: "Selecione um documento PDF primeiro.",
        variant: "destructive",
      });
      return;
    }

    // Simular aplicação da assinatura
    toast({
      title: "Assinatura aplicada com sucesso!",
      description: "O documento foi assinado digitalmente.",
    });
    setIsSignatureMode(false);
    setSelectedFile(null);
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.documentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewContract = (contract: Contract) => {
    setViewingContract(contract);
    setViewerOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'signed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Assinado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><Send className="w-3 h-3 mr-1" />Enviado</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Assinatura de Contratos</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Gerencie e assine documentos digitalmente
        </p>
      </div>

      <Tabs defaultValue="new-contract" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new-contract">Novo Contrato</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        {/* New Contract Tab */}
        <TabsContent value="new-contract">
          <div className="grid gap-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload do Documento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pdf-upload">Selecionar PDF</Label>
                    <Input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="mt-1"
                    />
                  </div>
                  
                  {selectedFile && (
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">{selectedFile.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Tamanho: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* PDF Viewer and Signature Positioning */}
            {selectedFile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointer className="w-5 h-5" />
                    Visualização e Assinatura
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={isSignatureMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setIsSignatureMode(!isSignatureMode);
                        if (isSignatureMode) {
                          setSignaturePosition({ x: 0, y: 0 });
                        }
                      }}
                    >
                      {isSignatureMode ? "Cancelar Posicionamento" : "Posicionar Assinatura"}
                    </Button>
                    {signaturePosition.x > 0 && signaturePosition.y > 0 && (
                      <Button onClick={handleApplySignature}>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Aplicar Assinatura
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div 
                    className="relative h-[600px] border rounded-lg overflow-hidden"
                    ref={pdfViewerRef}
                  >
                    <PDFViewer fileUrl={selectedFileUrl} />
                    
                    {isSignatureMode && (
                      <div 
                        className="absolute inset-0 cursor-crosshair z-50 pointer-events-auto"
                        onClick={handleSignaturePosition}
                        style={{ background: 'rgba(59, 130, 246, 0.05)' }}
                      />
                    )}
                    
                    {signaturePosition.x > 0 && signaturePosition.y > 0 && (
                      <div
                        className="absolute w-40 h-20 bg-blue-500/30 border-2 border-blue-600 rounded flex items-center justify-center z-40 shadow-lg"
                        style={{
                          left: signaturePosition.x - 80,
                          top: signaturePosition.y - 40,
                          pointerEvents: 'none'
                        }}
                      >
                        <span className="text-sm font-semibold text-blue-800 bg-white/80 px-2 py-1 rounded">
                          Assinatura Digital
                        </span>
                      </div>
                    )}
                  </div>
                  {isSignatureMode && (
                    <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Clique na posição desejada no documento para posicionar a assinatura
                    </p>
                  )}
                  {signaturePosition.x > 0 && signaturePosition.y > 0 && !isSignatureMode && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Posição da assinatura definida. Clique em "Aplicar Assinatura" para finalizar.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Contratos</CardTitle>
              <div className="flex gap-4 mt-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar por cliente ou documento..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="signed">Assinado</SelectItem>
                    <SelectItem value="sent">Enviado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredContracts.map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{contract.clientName}</span>
                        {getStatusBadge(contract.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{contract.documentName}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Criado: {new Date(contract.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                        {contract.signedAt && (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Assinado: {new Date(contract.signedAt).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewContract(contract)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Baixar
                      </Button>
                      {contract.status === 'signed' && (
                        <Button variant="outline" size="sm">
                          <Send className="w-4 h-4 mr-1" />
                          Reenviar
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {filteredContracts.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter !== 'all' 
                        ? "Nenhum contrato encontrado com os filtros aplicados."
                        : "Nenhum contrato encontrado."
                      }
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {viewingContract && (
        <DocumentViewer
          isOpen={viewerOpen}
          onClose={() => {
            setViewerOpen(false);
            setViewingContract(null);
          }}
          fileUrl="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
          fileName={viewingContract.documentName}
          fileType="pdf"
        />
      )}
    </div>
  );
};

export default ContractSignature;