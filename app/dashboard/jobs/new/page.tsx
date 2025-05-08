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
import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {addJob} from '@/lib/api';
import {yupResolver} from '@hookform/resolvers/yup';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {ArrowLeft} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import * as yup from 'yup';

const jobSchema = yup.object().shape({
  company: yup.string().required('Company name is required'),
  position: yup.string().required('Job title is required'),
  location: yup.string().optional(),
  status: yup.string().required(),
  url: yup.string().url('Invalid URL').optional(),
  salary: yup.string().optional(),
  notes: yup.string().optional(),
  appliedDate: yup.string().required('Date applied is required'),
});

type JobFormData = yup.InferType<typeof jobSchema>;

export default function NewJobPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<JobFormData>({
    resolver: yupResolver(jobSchema),
    defaultValues: {
      company: '',
      position: '',
      location: '',
      status: 'applied',
      url: '',
      salary: '',
      notes: '',
      appliedDate: new Date().toISOString().split('T')[0],
    },
  });

  const mutation = useMutation({
    mutationFn: addJob,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['jobs']});
      toast.success('Job added successfully', {
        description: 'Your job application has been added to your tracker.',
      });
      router.push('/dashboard/applications');
    },
    onError: (error: any) => {
      toast.error('Error adding job', {description: error.message});
    },
  });

  const onSubmit = (data: JobFormData) => {
    mutation.mutate({
      ...data,
      location: data.location || '',
      url: data.url || '',
      salary: data.salary || '',
      notes: data.notes || '',
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Job Application</CardTitle>
          <CardDescription>Track a new remote job application you've submitted.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" {...register('company')} />
                {errors.company && <p className="text-red-500 text-sm">{errors.company.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Job Title</Label>
                <Input id="position" {...register('position')} />
                {errors.position && (
                  <p className="text-red-500 text-sm">{errors.position.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register('location')} placeholder="Remote, US, etc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue="applied" onValueChange={(value) => setValue('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="withdrawn">Withdrawn</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="url">Job URL</Label>
                <Input
                  id="url"
                  type="url"
                  {...register('url')}
                  placeholder="https://example.com/job"
                />
                {errors.url && <p className="text-red-500 text-sm">{errors.url.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input id="salary" {...register('salary')} placeholder="$80,000 - $100,000" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appliedDate">Date Applied</Label>
              <Input id="appliedDate" type="date" {...register('appliedDate')} />
              {errors.appliedDate && (
                <p className="text-red-500 text-sm">{errors.appliedDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Add any notes about this application..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700"
              disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Job Application'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
