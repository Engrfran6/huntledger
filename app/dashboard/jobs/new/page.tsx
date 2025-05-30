'use client';

import {FieldLabel} from '@/components/dashboard/shared/custom-label';
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
import {addJob} from '@/lib/api';
import {yupResolver} from '@hookform/resolvers/yup';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {ArrowLeft} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import * as yup from 'yup';

const baseSchema = {
  company: yup.string().required('Company name is required'),
  position: yup.string().required('Job title is required'),
  location: yup.string().optional(),
  status: yup.string().required(),
  url: yup.string().url('Invalid URL').optional(),
  salary: yup.string().optional(),
  notes: yup.string().optional(),
  appliedDate: yup.string().required('Date applied is required'),
  interviewDate: yup.string().optional(),
  startDate: yup.string().optional(),
};

const jobSchema = yup.object().shape({
  ...baseSchema,
  interviewDate: yup
    .string()
    .when('status', (status, schema) =>
      (status?.[0] as string) === 'interview'
        ? schema.required('Interview date is required')
        : schema.optional()
    ),
  startDate: yup
    .string()
    .when('status', (status, schema) =>
      (status?.[0] as string) === 'offer'
        ? schema.required('Offer start date is required')
        : schema.optional()
    ),
});

type JobFormData = yup.InferType<typeof jobSchema>;

export default function NewJobPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
      interviewDate: '',
      startDate: '',
    },
  });

  const status = watch('status') as string;

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
    if (data.status === 'interview' && !data.interviewDate) {
      toast.error('Interview date required', {
        description: 'Please enter an interview date for jobs with interview status.',
      });
      return;
    }

    if (data.status === 'offer' && !data.startDate) {
      toast.error('Start date required', {
        description: 'Please enter a start date for jobs with offer status.',
      });
      return;
    }

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
      <div className="mb-6 ">
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
                <FieldLabel htmlFor="company" required>
                  Company Name
                </FieldLabel>
                <Input id="company" {...register('company')} />
                {errors.company && <p className="text-red-500 text-sm">{errors.company.message}</p>}
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="position" required>
                  Job Title
                </FieldLabel>
                <Input id="position" {...register('position')} />
                {errors.position && (
                  <p className="text-red-500 text-sm">{errors.position.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel htmlFor="location">Location</FieldLabel>
                <Input id="location" {...register('location')} placeholder="Remote, US, etc." />
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="status">Status</FieldLabel>
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

            {status === 'interview' && (
              <div className="space-y-2">
                <FieldLabel htmlFor="interviewDate" required>
                  Interview Date
                </FieldLabel>
                <Input
                  id="interviewDate"
                  type="datetime-local"
                  {...register('interviewDate')}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  You'll receive a reminder 24 hours before the interview.
                </p>
              </div>
            )}

            {status === 'offer' && (
              <div className="space-y-2">
                <FieldLabel htmlFor="startDate" required>
                  {' '}
                  Start Date
                </FieldLabel>
                <Input id="startDate" type="date" {...register('startDate')} required />
                <p className="text-xs text-muted-foreground">
                  You'll receive a reminder 24 hours before your start date.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel htmlFor="url">Job URL</FieldLabel>
                <Input
                  id="url"
                  type="url"
                  {...register('url')}
                  placeholder="https://example.com/job"
                />
                {errors.url && <p className="text-red-500 text-sm">{errors.url.message}</p>}
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="salary">Salary Range</FieldLabel>
                <Input id="salary" {...register('salary')} placeholder="$80,000 - $100,000" />
              </div>
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="appliedDate" required>
                Date Applied
              </FieldLabel>
              <Input id="appliedDate" type="date" {...register('appliedDate')} />
              {errors.appliedDate && (
                <p className="text-red-500 text-sm">{errors.appliedDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
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
