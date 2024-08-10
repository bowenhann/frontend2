import React from 'react';
import { withNode, NodeComponentProps } from '@/components/node/connector';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SettingsControl } from '@/components/settings-control';
import { cn } from '@/lib/utils';

// 定义 Avatar 组件的属性
interface AvatarProps extends React.ComponentProps<typeof Avatar> {
  src?: string;
  alt?: string;
  fallback?: string;
}

// 定义 Craft 配置的类型
interface CraftConfig {
  displayName: string;
  props: Partial<AvatarProps>;
  related: {
    toolbar: React.ComponentType<any>;
  };
}

// 结合 NodeComponentProps 和 AvatarProps
type NodeAvatarProps = NodeComponentProps & AvatarProps;

const AvatarComponent: React.FC<NodeAvatarProps> = ({ 
  src = '',
  alt = '',
  fallback = '',
  className = '',
  ...props 
}) => (
  <Avatar className={cn(className)} {...props}>
    {src && <AvatarImage src={src} alt={alt} />}
    <AvatarFallback>{fallback}</AvatarFallback>
  </Avatar>
);

// 使用 const assertion 来确保 draggable 的类型
const draggable = true as const;

// 创建具有 craft 属性的组件类型
type CraftComponent<T> = React.FC<T> & {
  craft: CraftConfig;
};

// 使用 withNode 创建 NodeAvatar 组件
export const NodeAvatar: CraftComponent<NodeAvatarProps> = withNode(AvatarComponent, {
  draggable,
});

// 定义 craft 配置
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