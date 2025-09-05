import React, { useState } from 'react';
import { Building, Plus, Edit, Trash2, Monitor, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Courtroom } from '@/types/scheduler';

interface CourtroomManagementProps {
  courtrooms: Courtroom[];
  onCourtroomsUpdate: (courtrooms: Courtroom[]) => void;
}

const EQUIPMENT_OPTIONS = [
  'Audio System', 'Video Conferencing', 'Recording Equipment', 'Projector',
  'Document Camera', 'Microphones', 'Security Cameras', 'Air Conditioning',
  'Wi-Fi', 'Power Outlets', 'Wheelchair Access'
];

export const CourtroomManagement: React.FC<CourtroomManagementProps> = ({ 
  courtrooms, 
  onCourtroomsUpdate 
}) => {
  const [isAddingCourtroom, setIsAddingCourtroom] = useState(false);
  const [editingCourtroom, setEditingCourtroom] = useState<Courtroom | null>(null);
  const { toast } = useToast();

  const [courtroomForm, setCourtroomForm] = useState<Partial<Courtroom>>({
    name: '',
    capacity: 50,
    equipment: [],
    isActive: true
  });

  const resetForm = () => {
    setCourtroomForm({
      name: '',
      capacity: 50,
      equipment: [],
      isActive: true
    });
  };

  const handleAddCourtroom = () => {
    if (!courtroomForm.name?.trim()) {
      toast({
        title: "Error",
        description: "Courtroom name is required",
        variant: "destructive"
      });
      return;
    }

    const newCourtroom: Courtroom = {
      id: Date.now().toString(),
      name: courtroomForm.name.trim(),
      capacity: courtroomForm.capacity || 50,
      equipment: courtroomForm.equipment || [],
      isActive: courtroomForm.isActive ?? true
    };

    onCourtroomsUpdate([...courtrooms, newCourtroom]);
    resetForm();
    setIsAddingCourtroom(false);
    
    toast({
      title: "Success",
      description: "Courtroom added successfully"
    });
  };

  const handleDeleteCourtroom = (courtroomId: string) => {
    onCourtroomsUpdate(courtrooms.filter(c => c.id !== courtroomId));
    toast({
      title: "Success",
      description: "Courtroom removed successfully"
    });
  };

  const toggleEquipment = (equipment: string) => {
    const current = courtroomForm.equipment || [];
    const updated = current.includes(equipment) 
      ? current.filter(e => e !== equipment)
      : [...current, equipment];
    setCourtroomForm({ ...courtroomForm, equipment: updated });
  };

  const handleEditCourtroom = (courtroom: Courtroom) => {
    setCourtroomForm(courtroom);
    setEditingCourtroom(courtroom);
    setIsAddingCourtroom(true);
  };

  const handleUpdateCourtroom = () => {
    if (!courtroomForm.name?.trim()) {
      toast({
        title: "Error",
        description: "Courtroom name is required",
        variant: "destructive"
      });
      return;
    }

    const updatedCourtroom: Courtroom = {
      id: editingCourtroom!.id,
      name: courtroomForm.name.trim(),
      capacity: courtroomForm.capacity || 50,
      equipment: courtroomForm.equipment || [],
      isActive: courtroomForm.isActive ?? true
    };

    onCourtroomsUpdate(courtrooms.map(c => 
      c.id === editingCourtroom!.id ? updatedCourtroom : c
    ));
    
    resetForm();
    setEditingCourtroom(null);
    setIsAddingCourtroom(false);
    
    toast({
      title: "Success",
      description: "Courtroom updated successfully"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-judicial">Courtroom Management</h2>
          <p className="text-muted-foreground">Manage courtrooms, capacity, and equipment</p>
        </div>
        <Dialog open={isAddingCourtroom} onOpenChange={(open) => {
          setIsAddingCourtroom(open);
          if (!open) {
            resetForm();
            setEditingCourtroom(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-judicial text-judicial-foreground hover:bg-judicial/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Courtroom
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCourtroom ? 'Edit Courtroom' : 'Add New Courtroom'}
              </DialogTitle>
              <DialogDescription>
                Configure courtroom details and available equipment
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="courtroom-name">Courtroom Name *</Label>
                  <Input
                    id="courtroom-name"
                    value={courtroomForm.name}
                    onChange={(e) => setCourtroomForm({ ...courtroomForm, name: e.target.value })}
                    placeholder="e.g., Courtroom 1A, Main Hall"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Seating Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="10"
                    max="500"
                    value={courtroomForm.capacity}
                    onChange={(e) => setCourtroomForm({ ...courtroomForm, capacity: parseInt(e.target.value) || 50 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Available Equipment</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {EQUIPMENT_OPTIONS.map(equipment => (
                    <div key={equipment} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={equipment}
                        checked={(courtroomForm.equipment || []).includes(equipment)}
                        onChange={() => toggleEquipment(equipment)}
                        className="rounded border-border"
                      />
                      <Label htmlFor={equipment} className="text-sm">{equipment}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="courtroom-active"
                  checked={courtroomForm.isActive}
                  onCheckedChange={(checked) => setCourtroomForm({ ...courtroomForm, isActive: checked })}
                />
                <Label htmlFor="courtroom-active">Active Status</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingCourtroom(false)}>
                Cancel
              </Button>
              <Button 
                onClick={editingCourtroom ? handleUpdateCourtroom : handleAddCourtroom}
                className="bg-judicial text-judicial-foreground hover:bg-judicial/90"
              >
                {editingCourtroom ? 'Update' : 'Add'} Courtroom
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {courtrooms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No Courtrooms Added</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Add courtrooms to organize and schedule hearings effectively
              </p>
              <Button onClick={() => setIsAddingCourtroom(true)} className="bg-judicial text-judicial-foreground hover:bg-judicial/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Courtroom
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courtrooms.map(courtroom => (
              <Card key={courtroom.id} className={`transition-all ${!courtroom.isActive ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-judicial" />
                        {courtroom.name}
                        {!courtroom.isActive && <Badge variant="secondary">Inactive</Badge>}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-2">
                        <Users className="w-4 h-4" />
                        Capacity: {courtroom.capacity} people
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditCourtroom(courtroom)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteCourtroom(courtroom.id)}
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
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Monitor className="w-4 h-4" />
                        Equipment
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {courtroom.equipment.length > 0 ? (
                          courtroom.equipment.map(equipment => (
                            <Badge key={equipment} variant="outline" className="text-xs">
                              {equipment}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No equipment listed</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};