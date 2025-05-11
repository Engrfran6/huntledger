'use client';

import {FieldLabel} from '@/components/dashboard/shared/custom-label';
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
import {Form, FormControl, FormField, FormItem, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {deleteClient, fetchClient, updateClient} from '@/lib/api';
import {yupResolver} from '@hookform/resolvers/yup';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {ArrowLeft, Loader2, Trash} from 'lucide-react';
import Link from 'next/link';
import {useParams, useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import * as yup from 'yup';

// Define the validation schema with Yup
const clientSchema = yup.object({
  name: yup.string().required('Client name is required'),
  company: yup.string().optional(),
  project: yup.string().required('Project name is required'),
  status: yup.string().required('Status is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string(),
  budget: yup.string(),
  rate: yup.string(),
  contactEmail: yup.string().email('Must be a valid email'),
  contactPhone: yup.string(),
  notes: yup.string(),
});

type ClientFormValues = yup.InferType<typeof clientSchema>;

export default function EditClientPage() {
  const router = useRouter();
  const {id} = useParams<{id: string; item: string}>();
  const queryClient = useQueryClient();

  // Set up React Hook Form with Yup validation
  const form = useForm<ClientFormValues>({
    resolver: yupResolver(clientSchema),
    defaultValues: {
      name: '',
      company: '',
      project: '',
      status: '',
      startDate: '',
      endDate: '',
      budget: '',
      rate: '',
      contactEmail: '',
      contactPhone: '',
      notes: '',
    },
  });

  // Fetch client data
  const {data: client, isLoading} = useQuery({
    queryKey: ['client', id],
    queryFn: () => fetchClient(id as string),
  });

  // Update form values when client data is loaded
  useEffect(() => {
    if (client) {
      form.reset({
        name: client.name,
        company: client.company || '',
        project: client.project,
        status: client.status,
        startDate: client.startDate.split('T')[0],
        endDate: client.endDate ? client.endDate.split('T')[0] : '',
        budget: client.budget || '',
        rate: client.rate || '',
        contactEmail: client.contactEmail || '',
        contactPhone: client.contactPhone || '',
        notes: client.notes || '',
      });
    }
  }, [client, form]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateClient,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['clients']});
      queryClient.invalidateQueries({queryKey: ['client', id]});
      toast.success('Client updated successfully', {
        description: 'Your client information has been updated.',
      });
      router.push('/dashboard/clients');
    },
    onError: (error: any) => {
      toast.error('Error updating client', {description: error.message});
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['clients']});
      toast.success('Client deleted successfully', {description: 'Your client has been removed.'});
      router.push('/dashboard/clients');
    },
    onError: (error: any) => {
      toast.error('Error deleting client', {description: error.message});
    },
  });

  // Form submission handler
  const onSubmit = (data: ClientFormValues) => {
    updateMutation.mutate({id: id, ...data});
  };

  // Delete handler
  const handleDelete = () => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-lg font-medium">Client not found</p>
        <Button onClick={() => router.push('/dashboard/clients')} variant="link" className="mt-2">
          Return to Clients
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 ">
        <Link
          href="/dashboard/clients"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Edit Client</CardTitle>
            <CardDescription>Update client and project information.</CardDescription>
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
                  This action cannot be undone. This will permanently delete this client and all
                  associated data.
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({field}) => (
                    <FormItem>
                      <FieldLabel htmlFor="client name" required>
                        Client Name
                      </FieldLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({field}) => (
                    <FormItem>
                      <FieldLabel htmlFor="client name">Company</FieldLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="project"
                render={({field}) => (
                  <FormItem>
                    <FieldLabel htmlFor="project name" required>
                      Project Name
                    </FieldLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({field}) => (
                    <FormItem>
                      <FieldLabel htmlFor="Status" required>
                        Status
                      </FieldLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="on-hold">On Hold</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budget"
                  render={({field}) => (
                    <FormItem>
                      <FieldLabel htmlFor="budget">Budget</FieldLabel>

                      <FormControl>
                        <Input {...field} placeholder="$5,000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({field}) => (
                    <FormItem>
                      <FieldLabel htmlFor="start date" required>
                        Start Data
                      </FieldLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({field}) => (
                    <FormItem>
                      <FieldLabel htmlFor="end date">End Data</FieldLabel>

                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({field}) => (
                    <FormItem>
                      <FieldLabel htmlFor="email">Contact Email</FieldLabel>

                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({field}) => (
                    <FormItem>
                      <FieldLabel htmlFor="phone">Contact Phone</FieldLabel>

                      <FormControl>
                        <Input {...field} />
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
                    <FieldLabel htmlFor="notes">Notes</FieldLabel>

                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Add any notes about this client or project..."
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
                onClick={() => router.push('/dashboard/clients')}>
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
