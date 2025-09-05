import React, { useState } from 'react';
import { Upload, Plus, Download, FileText, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Petition } from '@/types/scheduler';

interface BulkPetitionEntryProps {
  onPetitionsAdd: (petitions: Petition[]) => void;
}

// Sample petition templates for different case types
const PETITION_TEMPLATES = {
  bail: {
    description: "Application for bail in connection with case registered under criminal charges",
    estimatedDuration: 30,
    urgencyReason: "Accused in custody, requires immediate hearing"
  },
  civil: {
    description: "Civil suit for recovery of money/property/damages",
    estimatedDuration: 45,
    urgencyReason: ""
  },
  criminal: {
    description: "Criminal case proceedings for alleged offense",
    estimatedDuration: 60,
    urgencyReason: ""
  },
  constitutional: {
    description: "Constitutional petition challenging government action/policy",
    estimatedDuration: 90,
    urgencyReason: "Constitutional rights at stake"
  },
  writ: {
    description: "Writ petition for enforcement of fundamental rights",
    estimatedDuration: 75,
    urgencyReason: "Fundamental rights violation"
  }
};

const SAMPLE_PETITIONERS = [
  "John Smith", "Maria Garcia", "David Johnson", "Sarah Wilson", "Michael Brown",
  "Lisa Anderson", "Robert Taylor", "Jennifer Martinez", "William Davis", "Amanda Rodriguez",
  "James Miller", "Emily Thompson", "Christopher Lee", "Jessica White", "Daniel Harris"
];

const SAMPLE_RESPONDENTS = [
  "State of California", "City Council", "Department of Motor Vehicles", "Social Security Administration",
  "Internal Revenue Service", "Health Department", "Education Board", "Police Department",
  "Municipal Corporation", "State Housing Authority", "Environmental Protection Agency",
  "Labor Department", "Public Works Department", "Immigration Services", "Veterans Affairs"
];

const SAMPLE_LAWYERS = [
  "Attorney Smith & Associates", "Law Firm Johnson LLC", "Brown Legal Services",
  "Wilson & Partners Law", "Davis Legal Group", "Martinez Law Office",
  "Thompson Legal Associates", "Lee & White Attorneys", "Harris Law Firm",
  "Rodriguez Legal Services", "Miller & Associates", "Taylor Law Group"
];

export const BulkPetitionEntry: React.FC<BulkPetitionEntryProps> = ({ onPetitionsAdd }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedCount, setGeneratedCount] = useState(20);
  const { toast } = useToast();

  const generateCaseNumber = (type: string, index: number): string => {
    const typePrefix = {
      bail: 'BA',
      civil: 'CV',
      criminal: 'CR',
      constitutional: 'CO',
      writ: 'WR'
    }[type] || 'GN';
    
    const year = new Date().getFullYear();
    const caseNum = String(index + 1).padStart(4, '0');
    return `${typePrefix}/${year}/${caseNum}`;
  };

  const getRandomElement = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const getRandomDate = (daysBack: number): Date => {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * daysBack);
    const date = new Date(today);
    date.setDate(date.getDate() - randomDays);
    return date;
  };

  const generateRandomPetitions = async (count: number): Promise<Petition[]> => {
    const petitions: Petition[] = [];
    const petitionTypes: Array<keyof typeof PETITION_TEMPLATES> = ['bail', 'civil', 'criminal', 'constitutional', 'writ'];
    const priorities: Array<'urgent' | 'high' | 'medium' | 'low'> = ['urgent', 'high', 'medium', 'low'];

    for (let i = 0; i < count; i++) {
      const type = getRandomElement(petitionTypes);
      const template = PETITION_TEMPLATES[type];
      const priority = getRandomElement(priorities);
      
      // Higher chance for bail cases to be urgent
      const adjustedPriority: 'urgent' | 'high' | 'medium' | 'low' = type === 'bail' && Math.random() > 0.7 ? 'urgent' : priority;
      
      const petition: Petition = {
        id: `bulk-${Date.now()}-${i}`,
        caseNumber: generateCaseNumber(type, i),
        petitionerName: getRandomElement(SAMPLE_PETITIONERS),
        respondentName: getRandomElement(SAMPLE_RESPONDENTS),
        petitionType: type,
        priority: adjustedPriority,
        isBailable: type === 'bail' || (type === 'criminal' && Math.random() > 0.5),
        filingDate: getRandomDate(30),
        estimatedDuration: template.estimatedDuration + Math.floor(Math.random() * 30) - 15, // ±15 minutes variation
        lawyerName: getRandomElement(SAMPLE_LAWYERS),
        description: template.description,
        urgencyReason: adjustedPriority === 'urgent' ? template.urgencyReason || 'Time-sensitive matter requiring immediate attention' : undefined
      };

      petitions.push(petition);

      // Update progress
      const progress = ((i + 1) / count) * 100;
      setGenerationProgress(progress);
      
      // Small delay to show progress
      if (i % 5 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return petitions;
  };

  const handleGeneratePetitions = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const petitions = await generateRandomPetitions(generatedCount);
      onPetitionsAdd(petitions);
      
      toast({
        title: "Success",
        description: `Generated ${petitions.length} sample petitions successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate petitions",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const downloadSampleCSV = () => {
    const csvHeaders = [
      'Case Number', 'Petitioner Name', 'Respondent Name', 'Petition Type',
      'Priority', 'Is Bailable', 'Filing Date', 'Estimated Duration',
      'Lawyer Name', 'Description', 'Urgency Reason'
    ].join(',');

    const sampleRows = [
      'BA/2024/0001,John Smith,State of California,bail,urgent,true,2024-01-15,30,Smith & Associates,Bail application for accused in custody,Accused in custody requiring immediate hearing',
      'CV/2024/0002,Maria Garcia,City Council,civil,medium,false,2024-01-14,45,Johnson Law LLC,Civil suit for property dispute,',
      'CR/2024/0003,David Wilson,Police Department,criminal,high,true,2024-01-13,60,Brown Legal Services,Criminal case for alleged fraud,',
    ].join('\n');

    const csvContent = csvHeaders + '\n' + sampleRows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_petitions.csv';
    link.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Sample CSV template downloaded"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-judicial">Bulk Petition Entry</h2>
        <p className="text-muted-foreground">Generate sample data or import existing petitions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Generate Sample Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-judicial" />
              Generate Sample Petitions
            </CardTitle>
            <CardDescription>
              Create realistic sample data for testing the scheduler
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Petitions</label>
              <select
                value={generatedCount}
                onChange={(e) => setGeneratedCount(parseInt(e.target.value))}
                className="w-full p-2 border rounded-md bg-background"
                disabled={isGenerating}
              >
                <option value={10}>10 Petitions</option>
                <option value={20}>20 Petitions</option>
                <option value={50}>50 Petitions</option>
                <option value={100}>100 Petitions</option>
              </select>
            </div>

            {isGenerating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Generating petitions...</span>
                  <span>{Math.round(generationProgress)}%</span>
                </div>
                <Progress value={generationProgress} className="w-full" />
              </div>
            )}

            <Button
              onClick={handleGeneratePetitions}
              disabled={isGenerating}
              className="w-full bg-judicial text-judicial-foreground hover:bg-judicial/90"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Sample Data
                </>
              )}
            </Button>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This will generate realistic petitions with varying priorities, types, and urgency levels to test the AI scheduling algorithm.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* CSV Import */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-judicial" />
              Import from CSV
            </CardTitle>
            <CardDescription>
              Upload existing petition data from spreadsheet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your CSV file here, or
              </p>
              <Button variant="outline" disabled>
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>

            <Button
              onClick={downloadSampleCSV}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Sample CSV Template
            </Button>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                CSV import feature will be available once connected to a database. For now, use the sample data generator.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Data Information</CardTitle>
          <CardDescription>
            The generated sample data includes diverse petition types and realistic scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {Object.entries(PETITION_TEMPLATES).map(([type, template]) => (
              <div key={type} className="space-y-2">
                <Badge variant="outline" className="capitalize">
                  {type} Cases
                </Badge>
                <p className="text-xs text-muted-foreground">
                  ~{template.estimatedDuration} min duration
                </p>
                <p className="text-xs text-muted-foreground">
                  {template.description.slice(0, 50)}...
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};