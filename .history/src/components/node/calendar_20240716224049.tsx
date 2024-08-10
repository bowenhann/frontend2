import React from 'react';
import { useNode } from '@craftjs/core';
import { Calendar as UICalendar, CalendarProps } from '@/components/ui/calendar';

type CraftComponent<P = {}> = React.FC<P> & {
  craft: {
    displayName: string;
    props: Record<string, any>;
    related: {
      toolbar: React.ComponentType<any>;
    };
    custom?: Record<string, any>;
  };
};

export const NodeCalendar: CraftComponent<CalendarProps> = ({ className, ...props }) => {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <div 
      ref={(ref) => connect(drag(ref))}
      className={`inline-flex ${className || ''}`} // 使用 inline-flex 来保持内容宽度
      style={{ width: 'fit-content' }} // 确保宽度适应内容
    >
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
    toolbar: () => <></>, // 可以之后添加自定义工具栏
  },
};