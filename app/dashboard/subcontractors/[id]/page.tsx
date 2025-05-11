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
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/components/ui/use-toast';
import {useParams, useRouter} from 'next/navigation';
import {useEffect} from 'react';

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
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {deleteSubcontractor, fetchSubcontractor, updateSubcontractor} from '@/lib/api';
import {yupResolver} from '@hookform/resolvers/yup';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {ArrowLeft, Loader2, Trash} from 'lucide-react';
import Link from 'next/link';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

// Define the validation schema with Yup
const subcontractorSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Must be a valid email'),
  phone: yup.string(),
  expertise: yup.string().required('Expertise is required'),
  rate: yup.string(),
  notes: yup.string(),
});

type SubcontractorFormValues = yup.InferType<typeof subcontractorSchema>;

export default function EditSubcontractorPage() {
  const router = useRouter();
  const {toast} = useToast();
  const queryClient = useQueryClient();
  const {id} = useParams<{id: string; item: string}>();

  // Set up React Hook Form with Yup validation
  const form = useForm<SubcontractorFormValues>({
    resolver: yupResolver(subcontractorSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      expertise: '',
      rate: '',
      notes: '',
    },
  });

  // Fetch subcontractor data
  const {data: subcontractor, isLoading} = useQuery({
    queryKey: ['subcontractor', id],
    queryFn: () => fetchSubcontractor(id),
  });

  // Update form values when subcontractor data is loaded
  useEffect(() => {
    if (subcontractor) {
      form.reset({
        name: subcontractor.name,
        email: subcontractor.email || '',
        phone: subcontractor.phone || '',
        expertise: subcontractor.expertise,
        rate: subcontractor.rate || '',
        notes: subcontractor.notes || '',
      });
    }
  }, [subcontractor, form]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateSubcontractor,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['subcontractors']});
      queryClient.invalidateQueries({queryKey: ['subcontractor', id]});
      toast({
        title: 'Subcontractor updated successfully',
        description: 'Your subcontractor information has been updated.',
      });
      router.push('/dashboard/subcontractors');
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating subcontractor',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteSubcontractor,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['subcontractors']});
      toast({
        title: 'Subcontractor deleted successfully',
        description: 'Your subcontractor has been removed.',
      });
      router.push('/dashboard/subcontractors');
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting subcontractor',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: SubcontractorFormValues) => {
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

  if (!subcontractor) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-lg font-medium">Subcontractor not found</p>
        <Button
          onClick={() => router.push('/dashboard/subcontractors')}
          variant="link"
          className="mt-2">
          Return to Subcontractors
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 ">
        <Link
          href="/dashboard/subcontractors"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Subcontractors
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Edit Subcontractor</CardTitle>
            <CardDescription>Update subcontractor information.</CardDescription>
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
                  This action cannot be undone. This will permanently delete this subcontractor.
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
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
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
                  name="email"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="expertise"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Expertise/Skills</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., UI Design, Frontend Development" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rate"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Rate (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., $50/hr, $500/project" />
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
                        placeholder="Add any notes about this subcontractor..."
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
                onClick={() => router.push('/dashboard/subcontractors')}>
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
