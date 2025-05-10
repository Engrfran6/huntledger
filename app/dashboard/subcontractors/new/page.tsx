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
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/components/ui/use-toast';
import {addSubcontractor} from '@/lib/api';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {ArrowLeft} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

export default function NewSubcontractorPage() {
  const router = useRouter();
  const {toast} = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    expertise: '',
    rate: '',
    notes: '',
  });

  const mutation = useMutation({
    mutationFn: addSubcontractor,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['subcontractors']});
      toast({
        title: 'Subcontractor added successfully',
        description: 'Your subcontractor has been added to your team.',
      });
      router.push('/dashboard/subcontractors');
    },
    onError: (error: any) => {
      toast({
        title: 'Error adding subcontractor',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

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
        <CardHeader>
          <CardTitle>Add New Subcontractor</CardTitle>
          <CardDescription>Add a new team member or subcontractor to your network.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="expertise">Expertise/Skills</Label>
                <Input
                  id="expertise"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  placeholder="e.g., UI Design, Frontend Development"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Rate (Optional)</Label>
                <Input
                  id="rate"
                  name="rate"
                  value={formData.rate}
                  onChange={handleChange}
                  placeholder="e.g., $50/hr, $500/project"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any notes about this subcontractor..."
                className="min-h-[100px]"
              />
            </div>
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
              disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Subcontractor'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
