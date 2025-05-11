import {Label} from '@/components/ui/label';
import React from 'react';

interface FieldLabelProps {
  children: React.ReactNode;
  htmlFor: string;
  required?: boolean; // Make it optional with boolean type
}

export const FieldLabel = ({
  children,
  htmlFor,
  required = false, // Default value
}: FieldLabelProps) => (
  <Label htmlFor={htmlFor} className="flex items-center gap-0.5">
    {children}
    {required ? (
      <span className="text-red-600">*</span>
    ) : (
      <span className="text-gray-500 text-xs ml-1">(optional)</span>
    )}
  </Label>
);
