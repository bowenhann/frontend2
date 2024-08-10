import React from 'react';
import { withNode } from '@/components/node/connector';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SettingsControl } from '@/components/settings-control';
import { AvatarSettings } from '@/components/settings/AvatarSettings';
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

(NodeAvatar as any).craft = {
  ...((NodeAvatar as any).craft || {}),
  related: {
    toolbar: SettingsControl,
  },
  props: {
    src: '',
    alt: '',
    fallback: '',
    className: '',
  },
};