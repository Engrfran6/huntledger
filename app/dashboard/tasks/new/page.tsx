'use client';

import type React from 'react';

import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/components/ui/use-toast';
import {addTask, fetchClients, fetchSubcontractors} from '@/lib/api';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {ArrowLeft} from 'lucide-react';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {useState} from 'react';

export default function NewTaskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {toast} = useToast();
  const queryClient = useQueryClient();

  const clientId = searchParams.get('client');
  const subcontractorId = searchParams.get('subcontractor');

  const [formData, setFormData] = useState<{
    clientId: string;
    subcontractorId: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high';
    startDate: string;
    dueDate: string;
    budget: string;
    paymentStatus: 'unpaid' | 'partial' | 'paid';
    paymentAmount: string;
    notes: string;
  }>({
    clientId: clientId || '',
    subcontractorId: subcontractorId || '',
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    budget: '',
    paymentStatus: 'unpaid',
    paymentAmount: '',
    notes: '',
  });

  // Fetch clients and subcontractors for dropdowns
  const {data: clients} = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  const {data: subcontractors} = useQuery({
    queryKey: ['subcontractors'],
    queryFn: fetchSubcontractors,
  });

  const mutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tasks']});
      toast({
        title: 'Task added successfully',
        description: 'Your task has been added to your tracker.',
      });
      router.push('/dashboard/tasks');
    },
    onError: (error: any) => {
      toast({
        title: 'Error adding task',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/tasks"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tasks
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
          <CardDescription>Create a new task for a client project.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the task details..."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientId">Client</Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) => handleSelectChange('clientId', value)}
                  required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} - {client.project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcontractorId">Assign To (Optional)</Label>
                <Select
                  value={formData.subcontractorId}
                  onValueChange={(value) => handleSelectChange('subcontractorId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcontractor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {subcontractors?.map((subcontractor) => (
                      <SelectItem key={subcontractor.id} value={subcontractor.id}>
                        {subcontractor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleSelectChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date (Optional)</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (Optional)</Label>
                <Input
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="$500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select
                  value={formData.paymentStatus}
                  onValueChange={(value) => handleSelectChange('paymentStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="partial">Partially Paid</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentAmount">Payment Amount (Optional)</Label>
              <Input
                id="paymentAmount"
                name="paymentAmount"
                value={formData.paymentAmount}
                onChange={handleChange}
                placeholder="$250"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any notes about this task..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push('/dashboard/tasks')}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700"
              disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Task'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
