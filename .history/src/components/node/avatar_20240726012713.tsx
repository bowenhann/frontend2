import React from 'react';
import { withNode } from '@/components/node/connector';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SettingsControl } from '@/components/settings-control';
import { cn } from '@/lib/utils';

const AvatarComponent = ({ 
  src = '',
  alt = '',
  fallback = '',
  className = '',
  ...props 
}) => {
  return (
    <Avatar className={cn(className)} {...props}>
      {src && <AvatarImage src={src} alt={alt} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};

const draggable = true;

export const NodeAvatar = withNode(AvatarComponent, {
  draggable,
});

NodeAvatar.craft = {
  displayName: 'Avatar',
  props: {
    src: '',
    alt: '',
    fallback: '',
    className: '',
  },
  related: {
    toolbar: SettingsControl,
  },
};