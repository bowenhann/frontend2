import React from 'react';
import { useNode } from '@craftjs/core';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogSettings } from '@/components/settings/dialog';

export const NodeDialog = ({
  triggerText = 'Open Dialog',
  title = 'Dialog Title',
  description = 'Dialog Description',
  content = 'Dialog Content',
  closeText = 'Close',
  ...props
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button ref={(ref) => connect(drag(ref)) as any}>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{content}</div>
        <DialogFooter>
          <Button type="button" variant="secondary">
            {closeText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

NodeDialog.craft = {
  displayName: 'Dialog',
  props: {
    triggerText: 'Open Dialog',
    title: 'Dialog Title',
    description: 'Dialog Description',
    content: 'Dialog Content',
    closeText: 'Close',
  },
  related: {
    toolbar: () => { DialogSettings },
  },
};
