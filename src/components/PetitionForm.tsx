import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Petition } from '@/types/scheduler';
import { Scale, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PetitionFormProps {
  onAddPetition: (petition: Petition) => void;
}

export const PetitionForm = ({ onAddPetition }: PetitionFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    caseNumber: '',
    petitionerName: '',
    respondentName: '',
    petitionType: 'civil' as const,
    priority: 'medium' as const,
    isBailable: false,
    estimatedDuration: 60,
    lawyerName: '',
    description: '',
    urgencyReason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.caseNumber || !formData.petitionerName || !formData.lawyerName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const petition: Petition = {
      id: `petition-${Date.now()}`,
      ...formData,
      filingDate: new Date()
    };

    onAddPetition(petition);
    
    toast({
      title: "Petition Added",
      description: `${formData.caseNumber} has been added to the scheduling queue`,
      variant: "default"
    });

    // Reset form
    setFormData({
      caseNumber: '',
      petitionerName: '',
      respondentName: '',
      petitionType: 'civil',
      priority: 'medium',
      isBailable: false,
      estimatedDuration: 60,
      lawyerName: '',
      description: '',
      urgencyReason: ''
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="bg-judicial text-judicial-foreground">
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Add New Petition
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="caseNumber">Case Number *</Label>
              <Input
                id="caseNumber"
                value={formData.caseNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, caseNumber: e.target.value }))}
                placeholder="e.g., CRL.A.123/2024"
                required
              />
            </div>
            <div>
              <Label htmlFor="petitionType">Petition Type</Label>
              <Select
                value={formData.petitionType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, petitionType: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bail">Bail Petition</SelectItem>
                  <SelectItem value="civil">Civil Matter</SelectItem>
                  <SelectItem value="criminal">Criminal Appeal</SelectItem>
                  <SelectItem value="constitutional">Constitutional Petition</SelectItem>
                  <SelectItem value="writ">Writ Petition</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="petitionerName">Petitioner Name *</Label>
              <Input
                id="petitionerName"
                value={formData.petitionerName}
                onChange={(e) => setFormData(prev => ({ ...prev, petitionerName: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="respondentName">Respondent Name</Label>
              <Input
                id="respondentName"
                value={formData.respondentName}
                onChange={(e) => setFormData(prev => ({ ...prev, respondentName: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="priority">Priority Level</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">🔴 Urgent</SelectItem>
                  <SelectItem value="high">🟡 High</SelectItem>
                  <SelectItem value="medium">🟢 Medium</SelectItem>
                  <SelectItem value="low">⚪ Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="estimatedDuration">Duration (minutes)</Label>
              <Input
                id="estimatedDuration"
                type="number"
                min="15"
                max="180"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="lawyerName">Lawyer Name *</Label>
              <Input
                id="lawyerName"
                value={formData.lawyerName}
                onChange={(e) => setFormData(prev => ({ ...prev, lawyerName: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isBailable"
              checked={formData.isBailable}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isBailable: checked }))}
            />
            <Label htmlFor="isBailable">
              Bailable Petition (will avoid weekend scheduling)
            </Label>
          </div>

          <div>
            <Label htmlFor="description">Case Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the case..."
              rows={3}
            />
          </div>

          {(formData.priority as string) === 'urgent' && (
            <div>
              <Label htmlFor="urgencyReason">Urgency Reason</Label>
              <Textarea
                id="urgencyReason"
                value={formData.urgencyReason}
                onChange={(e) => setFormData(prev => ({ ...prev, urgencyReason: e.target.value }))}
                placeholder="Explain why this petition requires urgent hearing..."
                rows={2}
              />
            </div>
          )}

          <Button type="submit" className="w-full bg-judicial hover:bg-judicial/90 text-judicial-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Add Petition to Queue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};