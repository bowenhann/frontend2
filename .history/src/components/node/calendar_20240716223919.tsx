import React from 'react';
import { useNode } from '@craftjs/core';
import { Calendar as UICalendar, CalendarProps } from '@/components/ui/calendar';

// Craft 组件属性接口
interface CraftComponentProps {
  displayName: string;
  props: Record<string, any>;
  related: {
    toolbar: React.ComponentType<any>;
  };
  custom?: Record<string, any>;
}

// Craft 组件类型
type CraftComponent<P = {}> = React.FC<P> & {
  craft: CraftComponentProps;
};

export const NodeCalendar: CraftComponent<CalendarProps> = ({ ...props }) => {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <div ref={(ref) => connect(drag(ref))}>
      <UICalendar {...props} />
    </div>
  );
};

NodeCalendar.craft = {
  displayName: 'Calendar',
  props: {
    className: 'p-4',
  },
  related: {
    toolbar: () => <></>, // 可以later添加自定义工具栏
  },
};