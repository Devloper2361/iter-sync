import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function AttendanceCalculator() {
  const [total, setTotal] = useState('');
  const [attended, setAttended] = useState('');
  const [target, setTarget] = useState('75');
  const [result, setResult] = useState<{ message: string; type: 'success' | 'warning' | 'destructive' } | null>(null);

  const calculate = () => {
    const t = parseInt(total);
    const a = parseInt(attended);
    const tar = parseInt(target);

    if (isNaN(t) || isNaN(a) || isNaN(tar) || t === 0) {
      setResult({ message: 'Please enter valid numbers.', type: 'destructive' });
      return;
    }

    if (a > t) {
      setResult({ message: 'Attended classes cannot be greater than total classes.', type: 'destructive' });
      return;
    }

    const currentPercent = (a / t) * 100;

    if (currentPercent >= tar) {
      const bunks = Math.floor((a / (tar / 100)) - t);
      if (bunks > 0) {
        setResult({ message: `You can bunk ${bunks} more classes and maintain ${tar}%.`, type: 'success' });
      } else {
        setResult({ message: `You are exactly at your target. You cannot bunk any classes.`, type: 'warning' });
      }
    } else {
      const req = Math.ceil(((tar / 100) * t - a) / (1 - (tar / 100)));
      setResult({ message: `You need to attend ${req} more consecutive classes to reach ${tar}%.`, type: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="total">Total Classes</Label>
            <Input id="total" type="number" placeholder="e.g. 40" value={total} onChange={(e) => setTotal(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attended">Attended Classes</Label>
            <Input id="attended" type="number" placeholder="e.g. 30" value={attended} onChange={(e) => setAttended(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target">Target %</Label>
            <Input id="target" type="number" placeholder="75" value={target} onChange={(e) => setTarget(e.target.value)} />
          </div>
        </div>
        <Button onClick={calculate} className="w-full">Calculate</Button>
        {result && (
          <div className={`p-4 rounded-md mt-4 text-sm font-medium ${
            result.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
            result.type === 'warning' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {result.message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
