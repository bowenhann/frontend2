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

export const NodeCalendar: CraftComponent<CalendarProps> = ({ 
  className,
  showOutsideDays = true,
  ...props 
}) => {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <div 
      ref={(ref) => connect(drag(ref)) as any}
      className={`inline-flex ${className || ''}`}
      style={{ width: 'fit-content' }}
    >
      <UICalendar showOutsideDays={showOutsideDays} {...props} />
    </div>
  );
};

// 创建 Calendar 设置组件
const CalendarSettings = () => {
  const { actions: { setProp }, showOutsideDays } = useNode((node) => ({
    showOutsideDays: node.data.props.showOutsideDays,
  }));

  return (
    <div>
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={showOutsideDays}
          onChange={(e) => setProp((props) => props.showOutsideDays = e.target.checked)}
          className="mr-2"
        />
        Show Outside Days
      </label>
    </div>
  );
};

NodeCalendar.craft = {
  displayName: 'Calendar',
  props: {
    showOutsideDays: true,
    className: 'p-4',
  },
  related: {
    toolbar: CalendarSettings,
  },
};