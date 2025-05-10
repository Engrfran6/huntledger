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
import {deleteJob, fetchJob, updateJob} from '@/lib/api';
import {yupResolver} from '@hookform/resolvers/yup';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {ArrowLeft, Loader2, Trash} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {toast} from 'sonner';
import * as yup from 'yup';

type Job = {
  company: string;
  position: string;
  location?: string;
  status: string;
  url?: string;
  salary?: string;
  appliedDate: string;
  notes?: string;
  interviewDate: string;
  startDate: string;
};

const schema = yup.object().shape({
  company: yup.string().required('Company name is required'),
  position: yup.string().required('Job title is required'),
  location: yup.string().optional(),
  status: yup.string().required('Status is required'),
  url: yup.string().url('Enter a valid URL').optional(),
  salary: yup.string().optional(),
  appliedDate: yup.string().required('Date applied is required'),
  notes: yup.string().optional(),
  interviewDate: yup.string().required('Interview date is required'),
  startDate: yup.string().required('Offer start date is required'),
});

export default function EditJobPage({params}: {params: {id: string}}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm<Job>({
    resolver: yupResolver(schema),
    defaultValues: {
      company: '',
      position: '',
      location: '',
      status: 'applied',
      url: '',
      salary: '',
      appliedDate: '',
      notes: '',
      interviewDate: '',
      startDate: '',
    },
  });

  const status = watch('status');

  const {data: job, isLoading} = useQuery({
    queryKey: ['job', params.id],
    queryFn: () => fetchJob(params.id),
  });

  useEffect(() => {
    if (job) {
      Object.entries(job).forEach(([key, value]) => {
        if (key === 'appliedDate' && value) {
          setValue('appliedDate', (value as string).split('T')[0]);
        } else {
          setValue(key as keyof Job, value);
        }
      });
    }
  }, [job, setValue]);

  const updateMutation = useMutation({
    mutationFn: updateJob,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['jobs']});
      queryClient.invalidateQueries({queryKey: ['job', params.id]});
      toast.success('Job updated successfully', {
        description: 'Your job application has been updated.',
      });
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error('Error updating job', {description: error.message});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['jobs']});
      toast.success('Job deleted successfully', {
        description: 'Your job application has been removed from your tracker.',
      });
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error('Error deleting job', {description: error.message});
    },
  });

  const onSubmit = (data: Job) => {
    if (!data) return;

    // Validate conditional fields
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
    updateMutation.mutate({id: params.id, ...data});
  };

  const handleDelete = () => {
    deleteMutation.mutate(params.id);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-lg font-medium">Job not found</p>
        <Button onClick={() => router.push('/dashboard')} variant="link" className="mt-2">
          Return to Dashboard
        </Button>
      </div>
    );
  }

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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Edit Job Application</CardTitle>
            <CardDescription>Update the details of your job application.</CardDescription>
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
                  This action cannot be undone. This will permanently delete this job application
                  from your tracker.
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Controller
                  name="company"
                  control={control}
                  render={({field}) => <Input {...field} id="company" />}
                />
                {errors.company && <p className="text-sm text-red-500">{errors.company.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Job Title</Label>
                <Controller
                  name="position"
                  control={control}
                  render={({field}) => <Input {...field} id="position" />}
                />
                {errors.position && (
                  <p className="text-sm text-red-500">{errors.position.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Controller
                  name="location"
                  control={control}
                  render={({field}) => (
                    <Input {...field} id="location" placeholder="Remote, US, etc." />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({field}) => (
                    <Select value={field.value} onValueChange={field.onChange}>
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
                  )}
                />
                {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="url">Job URL</Label>
                <Controller
                  name="url"
                  control={control}
                  render={({field}) => (
                    <Input {...field} id="url" type="url" placeholder="https://example.com/job" />
                  )}
                />
                {errors.url && <p className="text-sm text-red-500">{errors.url.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Controller
                  name="salary"
                  control={control}
                  render={({field}) => (
                    <Input {...field} id="salary" placeholder="$80,000 - $100,000" />
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appliedDate">Date Applied</Label>
              <Controller
                name="appliedDate"
                control={control}
                render={({field}) => <Input {...field} id="appliedDate" type="date" />}
              />
              {errors.appliedDate && (
                <p className="text-sm text-red-500">{errors.appliedDate.message}</p>
              )}
            </div>

            {status === 'interview' && (
              <div className="space-y-2">
                <Label htmlFor="interviewDate">
                  Interview Date <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="interviewDate"
                  control={control}
                  render={({field}) => <Input {...field} id="interviewDate" type="date" />}
                />
                {errors.appliedDate && (
                  <p className="text-sm text-red-500">{errors.appliedDate.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  You'll receive a reminder 24 hours before the interview.
                </p>
              </div>
            )}

            {status === 'offer' && (
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({field}) => <Input {...field} id="startDate" type="date" />}
                />
                {errors.appliedDate && (
                  <p className="text-sm text-red-500">{errors.appliedDate.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  You'll receive a reminder 24 hours before your start date.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Controller
                name="notes"
                control={control}
                render={({field}) => (
                  <Textarea
                    {...field}
                    id="notes"
                    placeholder="Add any notes about this application..."
                    className="min-h-[100px]"
                  />
                )}
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
              disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
