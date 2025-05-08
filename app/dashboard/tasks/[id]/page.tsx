'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/components/ui/use-toast';
import {deleteTask, fetchClients, fetchSubcontractors, fetchTask, updateTask} from '@/lib/api';
import {Task} from '@/lib/types';
// import { Task } from '@/lib/types';
import {yupResolver} from '@hookform/resolvers/yup';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {ArrowLeft, Loader2, Trash} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

// Define the validation schema with Yup
const taskSchema = yup.object({
  clientId: yup.string().required('Client is required'),
  subcontractorId: yup.string(),
  title: yup.string().required('Task title is required'),
  description: yup.string(),
  status: yup.string().required('Status is required'),
  priority: yup.string().required('Priority is required'),
  startDate: yup.string(),
  dueDate: yup.string(),
  completedDate: yup.string(),
  budget: yup.string(),
  paymentStatus: yup.string().required('Payment status is required'),
  paymentAmount: yup.string(),
  notes: yup.string(),
});

type TaskFormValues = yup.InferType<typeof taskSchema>;

export default function EditTaskPage({params}: {params: {id: string}}) {
  const router = useRouter();
  const {toast} = useToast();
  const queryClient = useQueryClient();

  // Set up React Hook Form with Yup validation
  const form = useForm<TaskFormValues>({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      clientId: '',
      subcontractorId: '',
      title: '',
      description: '',
      status: 'pending',
      priority: 'low',
      startDate: '',
      dueDate: '',
      completedDate: '',
      budget: '',
      paymentStatus: 'unpaid',
      paymentAmount: '',
      notes: '',
    },
  });

  // Fetch task data
  const {data: task, isLoading: isLoadingTask} = useQuery({
    queryKey: ['task', params.id],
    queryFn: () => fetchTask(params.id),
  });

  // Fetch clients for dropdown
  const {data: clients, isLoading: isLoadingClients} = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  // Fetch subcontractors for dropdown
  const {data: subcontractors, isLoading: isLoadingSubcontractors} = useQuery({
    queryKey: ['subcontractors'],
    queryFn: fetchSubcontractors,
  });

  // Update form values when task data is loaded
  useEffect(() => {
    if (task) {
      form.reset({
        clientId: task.clientId,
        subcontractorId: task.subcontractorId || '',
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        startDate: task.startDate ? task.startDate.split('T')[0] : '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        completedDate: task.completedDate ? task.completedDate.split('T')[0] : '',
        budget: task.budget || '',
        paymentStatus: task.paymentStatus || 'unpaid',
        paymentAmount: task.paymentAmount || '',
        notes: task.notes || '',
      });
    }
  }, [task, form]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tasks']});
      queryClient.invalidateQueries({queryKey: ['task', params.id]});
      toast({
        title: 'Task updated successfully',
        description: 'Your task has been updated.',
      });
      router.push('/dashboard/tasks');
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating task',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tasks']});
      toast({
        title: 'Task deleted successfully',
        description: 'Your task has been removed.',
      });
      router.push('/dashboard/tasks');
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting task',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: TaskFormValues) => {
    updateMutation.mutate({
      id: params.id,
      ...data,
      status: data.status as Task['status'],
      priority: data.priority as Task['priority'],
      paymentStatus: data.paymentStatus as Task['paymentStatus'],
    });
  };

  // Delete handler
  const handleDelete = () => {
    deleteMutation.mutate(params.id);
  };

  const isLoading = isLoadingTask || isLoadingClients || isLoadingSubcontractors;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-lg font-medium">Task not found</p>
        <Button onClick={() => router.push('/dashboard/tasks')} variant="link" className="mt-2">
          Return to Tasks
        </Button>
      </div>
    );
  }

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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Edit Task</CardTitle>
            <CardDescription>Update task details and assignments.</CardDescription>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this task.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe the task details..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients?.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name} - {client.project}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subcontractorId"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Assign To (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcontractor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {subcontractors?.map((subcontractor) => (
                            <SelectItem key={subcontractor.id} value={subcontractor.id}>
                              {subcontractor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="completedDate"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Completed Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="$500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentStatus"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Payment Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                          <SelectItem value="partial">Partially Paid</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentAmount"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Payment Amount</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="$250" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Add any notes about this task..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/tasks')}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700"
                disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
