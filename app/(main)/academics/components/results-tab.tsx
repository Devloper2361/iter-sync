import { AcademicsData, SemesterResult } from '@/types/academics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Download } from 'lucide-react';

export function ResultsTab({ data }: { data: AcademicsData }) {
  const [selectedSem, setSelectedSem] = useState(data.results[0]?.id);
  
  const result = data.results.find(r => r.id === selectedSem);

  if (!result) return <div>No results found.</div>;

  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-64">
          <Select value={selectedSem} onValueChange={setSelectedSem}>
            <SelectTrigger>
              <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent>
              {data.results.map(r => (
                <SelectItem key={r.id} value={r.id}>Semester {r.semester}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => alert('Downloading Mock Grade Sheet...')}>
            <Download className="w-4 h-4 mr-2" /> Grade Sheet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">SGPA</div>
            <div className="text-3xl font-bold text-primary">{result.sgpa.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">CGPA</div>
            <div className="text-3xl font-bold">{result.cgpa.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">Earned / Total Credits</div>
            <div className="text-3xl font-bold">{result.earnedCredits} / {result.totalCredits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">Status</div>
            <div className={`text-3xl font-bold ${result.status === 'Pass' ? 'text-green-500' : 'text-destructive'}`}>{result.status}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject Grades</CardTitle>
          <CardDescription>Semester {result.semester} Detailed Breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead className="text-right">Credits</TableHead>
                <TableHead className="text-right">Grade</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.subjects.map(sub => (
                <TableRow key={sub.code}>
                  <TableCell className="font-medium">{sub.code}</TableCell>
                  <TableCell>{sub.name}</TableCell>
                  <TableCell className="text-right">{sub.credits}</TableCell>
                  <TableCell className="text-right font-bold">{sub.grade}</TableCell>
                  <TableCell className="text-right">{sub.gradePoints}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
