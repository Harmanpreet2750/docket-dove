import React, { useState } from 'react';
import { Plus, Edit, Trash2, User, Calendar, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Judge } from '@/types/scheduler';

interface JudgeManagementProps {
  judges: Judge[];
  onJudgesUpdate: (judges: Judge[]) => void;
}

const SPECIALIZATIONS = [
  'Criminal Law', 'Civil Law', 'Constitutional Law', 'Bail Matters', 'Writ Petitions',
  'Family Law', 'Corporate Law', 'Labor Law', 'Tax Law', 'Environmental Law'
];

const WORKING_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const JudgeManagement: React.FC<JudgeManagementProps> = ({ judges, onJudgesUpdate }) => {
  const [isAddingJudge, setIsAddingJudge] = useState(false);
  const [editingJudge, setEditingJudge] = useState<Judge | null>(null);
  const { toast } = useToast();

  const [judgeForm, setJudgeForm] = useState<Partial<Judge>>({
    name: '',
    email: '',
    phone: '',
    specialization: [],
    courtrooms: [],
    workingHours: {},
    unavailableDates: [],
    isActive: true
  });

  const handleAddJudge = () => {
    if (!judgeForm.name || !judgeForm.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive"
      });
      return;
    }

    const newJudge: Judge = {
      id: Date.now().toString(),
      name: judgeForm.name,
      email: judgeForm.email,
      phone: judgeForm.phone || '',
      specialization: judgeForm.specialization || [],
      courtrooms: judgeForm.courtrooms || [],
      workingHours: judgeForm.workingHours || {},
      unavailableDates: judgeForm.unavailableDates || [],
      isActive: judgeForm.isActive ?? true
    };

    onJudgesUpdate([...judges, newJudge]);
    setJudgeForm({
      name: '',
      email: '',
      phone: '',
      specialization: [],
      courtrooms: [],
      workingHours: {},
      unavailableDates: [],
      isActive: true
    });
    setIsAddingJudge(false);
    
    toast({
      title: "Success",
      description: "Judge added successfully"
    });
  };

  const handleDeleteJudge = (judgeId: string) => {
    onJudgesUpdate(judges.filter(j => j.id !== judgeId));
    toast({
      title: "Success",
      description: "Judge removed successfully"
    });
  };

  const toggleSpecialization = (spec: string) => {
    const current = judgeForm.specialization || [];
    const updated = current.includes(spec) 
      ? current.filter(s => s !== spec)
      : [...current, spec];
    setJudgeForm({ ...judgeForm, specialization: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-judicial">Judge Management</h2>
          <p className="text-muted-foreground">Manage judges, their specializations, and availability</p>
        </div>
        <Dialog open={isAddingJudge} onOpenChange={setIsAddingJudge}>
          <DialogTrigger asChild>
            <Button className="bg-judicial text-judicial-foreground hover:bg-judicial/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Judge
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Judge</DialogTitle>
              <DialogDescription>
                Enter the judge's information and set their specializations
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={judgeForm.name}
                    onChange={(e) => setJudgeForm({ ...judgeForm, name: e.target.value })}
                    placeholder="Justice John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={judgeForm.email}
                    onChange={(e) => setJudgeForm({ ...judgeForm, email: e.target.value })}
                    placeholder="judge@court.gov"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={judgeForm.phone}
                  onChange={(e) => setJudgeForm({ ...judgeForm, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label>Specializations</Label>
                <div className="grid grid-cols-2 gap-2">
                  {SPECIALIZATIONS.map(spec => (
                    <div key={spec} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={spec}
                        checked={(judgeForm.specialization || []).includes(spec)}
                        onChange={() => toggleSpecialization(spec)}
                        className="rounded border-border"
                      />
                      <Label htmlFor={spec} className="text-sm">{spec}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={judgeForm.isActive}
                  onCheckedChange={(checked) => setJudgeForm({ ...judgeForm, isActive: checked })}
                />
                <Label htmlFor="active">Active Status</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingJudge(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddJudge} className="bg-judicial text-judicial-foreground hover:bg-judicial/90">
                Add Judge
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {judges.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <User className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No Judges Added</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Start by adding judges to manage court schedules effectively
              </p>
              <Button onClick={() => setIsAddingJudge(true)} className="bg-judicial text-judicial-foreground hover:bg-judicial/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Judge
              </Button>
            </CardContent>
          </Card>
        ) : (
          judges.map(judge => (
            <Card key={judge.id} className={`transition-all ${!judge.isActive ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-judicial" />
                      {judge.name}
                      {!judge.isActive && <Badge variant="secondary">Inactive</Badge>}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {judge.email}
                      </span>
                      {judge.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {judge.phone}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteJudge(judge.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Specializations</h4>
                    <div className="flex flex-wrap gap-1">
                      {judge.specialization.length > 0 ? (
                        judge.specialization.map(spec => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No specializations set</span>
                      )}
                    </div>
                  </div>
                  
                  {judge.courtrooms.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Assigned Courtrooms</h4>
                      <div className="flex flex-wrap gap-1">
                        {judge.courtrooms.map(courtroom => (
                          <Badge key={courtroom} variant="outline" className="text-xs">
                            {courtroom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};