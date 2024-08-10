import React from 'react';
import { withNode } from '@/components/node/connector';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SettingsControl } from '@/components/settings-control';
import { cn } from '@/lib/utils';

// 定义 AvatarComponent 的 props 类型
interface AvatarComponentProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
  [key: string]: any; // 允许其他属性
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

// 定义 NodeAvatar 的类型，包括 craft 属性
interface NodeAvatarType extends React.FC<AvatarComponentProps> {
  craft: {
    displayName: string;
    props: {
      src: string;
      alt: string;
      fallback: string;
      className: string;
    };
    related: {
      toolbar: React.ComponentType<any>;
    };
  };
}

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