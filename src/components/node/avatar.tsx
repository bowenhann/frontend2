<<<<<<< HEAD
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
=======
// @/components/node/avatar.tsx
import React from 'react';
import { useNode } from '@craftjs/core';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AvatarSettings } from '@/components/settings/avatar';

export const NodeAvatar = ({ ...props }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <Avatar 
      {...props} 
      ref={(ref) => ref && connect(drag(ref)) as any}
    >
      <AvatarImage src={props.src} alt={props.alt} />
      <AvatarFallback>{props.fallback}</AvatarFallback>
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
    </Avatar>
  );
};

<<<<<<< HEAD
const draggable = true;

// 使用 Partial 使所有属性变为可选
type NodeProps = Partial<AvatarComponentProps>;

const NodeAvatarBase = withNode(AvatarComponent, {
  draggable,
});

export const NodeAvatar = Object.assign(NodeAvatarBase, {
  craft: {
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
  },
});

// 类型断言，确保 NodeAvatar 有正确的类型
(NodeAvatar as React.FC<NodeProps> & {
  craft: {
    displayName: string;
    props: NodeProps;
    related: {
      toolbar: typeof SettingsControl;
    };
  };
});
=======
NodeAvatar.craft = {
  displayName: 'Avatar',
  props: {
    src: 'https://github.com/shadcn.png',
    alt: '@shadcn',
    fallback: 'CN',
  },
  related: {
    toolbar: AvatarSettings,
  },
};
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
