import React from 'react';
import { useNode } from '@craftjs/core';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export const NodeAlertDialog = ({
  triggerText = 'Open',
  title = 'Are you absolutely sure?',
  description = 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
  cancelText = 'Cancel',
  actionText = 'Continue',
  ...props
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button ref={(ref) => connect(drag(ref)) as any}>{triggerText}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction>{actionText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

NodeAlertDialog.craft = {
  displayName: 'Alert Dialog',
  props: {
    triggerText: 'Open',
    title: 'Are you absolutely sure?',
    description: 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
    cancelText: 'Cancel',
    actionText: 'Continue',
  },
  related: {
    toolbar: () => { /* ... */ },
  },
};