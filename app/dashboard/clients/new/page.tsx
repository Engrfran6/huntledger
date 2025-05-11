'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {addClient} from '@/lib/api';
import {yupResolver} from '@hookform/resolvers/yup';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {ArrowLeft} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import * as yup from 'yup';

// Schema
const clientSchema = yup.object().shape({
  name: yup.string().required('Client name is required'),
  company: yup.string().optional(),
  project: yup.string().required('Project name is required'),
  status: yup.string().required('Status is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().optional(),
  budget: yup.string().optional(),
  rate: yup.string().optional(),
  contactEmail: yup.string().email('Invalid email').optional(),
  contactPhone: yup.string().optional(),
  notes: yup.string().optional(),
});

type ClientFormData = yup.InferType<typeof clientSchema>;

export default function NewClientPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<ClientFormData>({
    resolver: yupResolver(clientSchema),
    defaultValues: {
      name: '',
      company: '',
      project: '',
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      budget: '',
      rate: '',
      contactEmail: '',
      contactPhone: '',
      notes: '',
    },
  });

  const mutation = useMutation({
    mutationFn: addClient,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['clients']});
      toast.success('Client added successfully', {
        description: 'Your client has been added to your tracker.',
      });
      router.push('/dashboard/clients');
    },
    onError: (error: any) => {
      toast.error('Error adding client', {description: error.message});
    },
  });

  const onSubmit = (data: ClientFormData) => {
    mutation.mutate({
      ...data,
    });
  };

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
        <CardHeader>
          <CardTitle>Add New Client</CardTitle>
          <CardDescription>Track a new client and their project details.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel htmlFor="name">Client Name</FieldLabel>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="company">Company</FieldLabel>
                <Input id="company" {...register('company')} />
              </div>
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="project">Project Name</FieldLabel>
              <Input id="project" {...register('project')} />
              {errors.project && <p className="text-red-500 text-sm">{errors.project.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel>Status</FieldLabel>
                <Select defaultValue="active" onValueChange={(value) => setValue('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="budget">Budget</FieldLabel>
                <Input id="budget" {...register('budget')} placeholder="$5,000" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
                <Input id="startDate" type="date" {...register('startDate')} />
                {errors.startDate && (
                  <p className="text-red-500 text-sm">{errors.startDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="endDate">End Date</FieldLabel>
                <Input id="endDate" type="date" {...register('endDate')} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel htmlFor="contactEmail">Contact Email</FieldLabel>
                <Input id="contactEmail" type="email" {...register('contactEmail')} />
                {errors.contactEmail && (
                  <p className="text-red-500 text-sm">{errors.contactEmail.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="contactPhone">Contact Phone</FieldLabel>
                <Input id="contactPhone" {...register('contactPhone')} />
              </div>
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Add any notes about this client or project..."
                className="min-h-[100px]"
              />
            </div>
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
              disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Client'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
