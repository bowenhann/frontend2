import React from 'react';
import { withNode } from '@/components/node/connector';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SettingsControl } from '@/components/settings-control';
import { cn } from '@/lib/utils';

interface AvatarComponentProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
  [key: string]: any;
}

const AvatarComponent: React.FC<AvatarComponentProps> = ({ 
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

interface CraftConfig {
  displayName: string;
  props: {
    [key: string]: any;
  };
  related: {
    toolbar: React.ComponentType<any>;
  };
}

type NodeAvatarType = React.ComponentType<AvatarComponentProps> & {
  craft: CraftConfig;
};

export const NodeAvatar: NodeAvatarType = withNode(AvatarComponent, {
  draggable,
}) as NodeAvatarType;

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