import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Search, Users, Shield, BookOpen, Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockUsers } from '@/data/mock-community-db';
import { useCreateStudyGroup } from '@/hooks/use-study-groups';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const createGroupSchema = z.object({
  name: z.string().min(3, 'Group name must be at least 3 characters'),
  description: z.string().optional(),
  subject: z.string().optional(),
  department: z.string().optional(),
  semester: z.string().optional(),
  section: z.string().optional(),
  privacy: z.enum(['Public', 'Private', 'Invite Only']),
});

type CreateGroupValues = z.infer<typeof createGroupSchema>;

export function CreateGroupDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const router = useRouter();
  const createGroupMutation = useCreateStudyGroup();

  const { register, handleSubmit, control, formState: { errors, isValid }, watch, reset, trigger } = useForm<CreateGroupValues>({
    resolver: zodResolver(createGroupSchema),
    mode: 'onChange',
    defaultValues: {
      privacy: 'Public',
      name: '',
      description: '',
      subject: '',
      department: '',
      semester: '',
      section: '',
    }
  });

  const formValues = watch();

  const handleCreate = async (data: CreateGroupValues) => {
    const currentUser = mockUsers['u1'];
    
    try {
      const newGroup = await createGroupMutation.mutateAsync({
        name: data.name,
        description: data.description || '',
        subject: data.subject,
        department: data.department,
        semester: data.semester ? parseInt(data.semester) : undefined,
        privacy: data.privacy,
        creator: currentUser,
        tags: [data.subject || 'Study', data.department || 'General'].filter(Boolean),
        bannerUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80',
        initialMembers: selectedMembers,
      });

      setOpen(false);
      reset();
      setStep(1);
      setSelectedMembers([]);
      
      toast.success('Study Group Created Successfully');
      router.push(`/community/group/${newGroup.id}`);
    } catch (error) {
      console.error('Failed to create group:', error);
      toast.error('Failed to create study group');
    }
  };

  const handleNextStep = async () => {
    if (step === 1) {
      const isStep1Valid = await trigger(['name', 'privacy']);
      if (!isStep1Valid) return;
    }
    setStep((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const handlePrevStep = () => {
    setStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  const toggleMember = (id: string) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(prev => prev.filter(m => m !== id));
    } else {
      setSelectedMembers(prev => [...prev, id]);
    }
  };

  const availableUsers = Object.values(mockUsers).filter(
    u => u.id !== 'u1' && u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) {
        setTimeout(() => {
          setStep(1);
          reset();
          setSelectedMembers([]);
          setSearchQuery('');
        }, 300);
      }
    }}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="w-[95vw] max-w-[720px] p-0 bg-background sm:rounded-2xl border-0 overflow-hidden"
        aria-describedby="create-group-description"
      >
        <form onSubmit={handleSubmit(handleCreate)} className="flex flex-col max-h-[90vh]">
          <DialogHeader className="px-6 py-5 border-b shrink-0 bg-muted/20">
            <DialogTitle className="text-xl font-semibold">
              {step === 1 && 'Create Study Group'}
              {step === 2 && 'Add Members'}
              {step === 3 && 'Review Details'}
            </DialogTitle>
            <p id="create-group-description" className="sr-only">
              Follow the steps to create a new study group.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-6">
              {/* Step 1: Basic Info */}
              <div className={step === 1 ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'hidden'}>
              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="name" className="text-sm font-medium">Group Name <span className="text-destructive">*</span></Label>
                <Input id="name" placeholder="e.g. OS Midterm Prep" {...register('name')} className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''} />
                {errors.name && <p className="text-xs text-destructive font-medium">{errors.name.message}</p>}
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea id="description" placeholder="What is this group about?" {...register('description')} className="resize-none min-h-[100px]" />
              </div>

              <div className="space-y-3">
                <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                <Input id="subject" placeholder="e.g. Computer Science" {...register('subject')} />
              </div>

              <div className="space-y-3">
                <Label htmlFor="department" className="text-sm font-medium">Department</Label>
                <Input id="department" placeholder="e.g. CSE" {...register('department')} />
              </div>

              <div className="space-y-3">
                <Label htmlFor="semester" className="text-sm font-medium">Semester</Label>
                <Input id="semester" type="number" min="1" max="10" placeholder="e.g. 5" {...register('semester')} />
              </div>

              <div className="space-y-3">
                <Label htmlFor="section" className="text-sm font-medium">Section</Label>
                <Input id="section" placeholder="e.g. A" {...register('section')} />
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label className="text-sm font-medium">Privacy <span className="text-destructive">*</span></Label>
                <Controller
                  name="privacy"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select privacy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Public">Public (Anyone can join)</SelectItem>
                        <SelectItem value="Private">Private (Request to join)</SelectItem>
                        <SelectItem value="Invite Only">Invite Only</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Step 2: Add Members */}
            <div className={step === 2 ? 'flex flex-col gap-5' : 'hidden'}>
              <div className="relative shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search students to invite..." 
                  className="pl-9 h-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 shrink-0">
                  {selectedMembers.map(id => {
                    const user = mockUsers[id];
                    if (!user) return null;
                    return (
                      <div key={id} className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium border border-primary/20">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={user.avatarUrl} />
                          <AvatarFallback className="text-[10px]">{user.name.substring(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {user.name}
                        <button type="button" onClick={() => toggleMember(id)} className="ml-1 text-primary/70 hover:text-destructive transition-colors rounded-full hover:bg-destructive/10 p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="border rounded-xl divide-y overflow-y-auto bg-card shadow-sm max-h-[300px]">
                {availableUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => toggleMember(user.id)}>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>{user.name.substring(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{user.department} • Semester {user.semester}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${selectedMembers.includes(user.id) ? 'bg-primary border-primary text-primary-foreground' : 'border-input hover:border-primary/50'}`}>
                      {selectedMembers.includes(user.id) && <Plus className="w-3.5 h-3.5 rotate-45" />}
                    </div>
                  </div>
                ))}
                {availableUsers.length === 0 && (
                  <div className="p-10 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                      <Users className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">No users found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try a different search term.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Review */}
            <div className={step === 3 ? 'space-y-6' : 'hidden'}>
              <div className="flex flex-col items-center text-center space-y-4 p-8 bg-gradient-to-b from-muted/50 to-transparent rounded-2xl border shadow-sm">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border shadow-sm">
                  <Users className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-2xl tracking-tight">{formValues.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 max-w-[400px] mx-auto leading-relaxed">{formValues.description || 'No description provided.'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-card border rounded-xl p-4 flex items-start gap-4 shadow-sm">
                  <div className="bg-muted p-2 rounded-lg shrink-0">
                    <Shield className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Privacy</p>
                    <p className="text-sm font-medium">{formValues.privacy}</p>
                  </div>
                </div>
                
                <div className="bg-card border rounded-xl p-4 flex items-start gap-4 shadow-sm">
                  <div className="bg-muted p-2 rounded-lg shrink-0">
                    <Users className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Members</p>
                    <p className="text-sm font-medium">{selectedMembers.length + 1} selected</p>
                  </div>
                </div>
                
                {(formValues.subject || formValues.department) && (
                  <div className="bg-card border rounded-xl p-4 flex items-start gap-4 sm:col-span-2 shadow-sm">
                    <div className="bg-muted p-2 rounded-lg shrink-0">
                      <BookOpen className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Academic Info</p>
                      <p className="text-sm font-medium">
                        {[formValues.subject, formValues.department, formValues.semester ? `Sem ${formValues.semester}` : null, formValues.section ? `Sec ${formValues.section}` : null].filter(Boolean).join(' • ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>

          <div className="px-6 py-5 border-t shrink-0 bg-muted/20 flex justify-between items-center">
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-2 rounded-full transition-all duration-300 ${step === s ? 'w-8 bg-primary' : 'w-2 bg-primary/20'}`} />
              ))}
            </div>
            <div className="flex gap-3">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={handlePrevStep} disabled={createGroupMutation.isPending}>
                  Back
                </Button>
              )}
              
              {step < 3 ? (
                <Button type="button" onClick={handleNextStep}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" disabled={createGroupMutation.isPending}>
                  {createGroupMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
                  ) : (
                    'Create Group'
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
