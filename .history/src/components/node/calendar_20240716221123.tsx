import React from 'react';
import { useNode } from '@craftjs/core';
import { Calendar as UICalendar, CalendarProps } from '@/components/ui/calendar';
import { SettingsControl } from '@/components/nodes/settings-control'; // 假设你有这个组件

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

// 创建可拖拽组件的函数
const createDraggableComponent = (Component: React.ComponentType<any>, isDroppable = false) => {
  const DraggableComponent = React.forwardRef<HTMLElement, any>((props, ref) => {
    const { connectors: { connect, drag } } = useNode();
    
    return (
      <Component
        ref={(domNode: HTMLElement | null) => {
          if (domNode) {
            connect(isDroppable ? drag(domNode) : domNode);
            if (typeof ref === 'function') ref(domNode);
            else if (ref) ref.current = domNode;
          }
        }}
        {...props}
      />
    );
  });

  DraggableComponent.displayName = `Draggable${Component.displayName || Component.name || 'Component'}`;
  return DraggableComponent;
};

// 创建可拖拽的日历组件
const DraggableCalendar = createDraggableComponent(UICalendar);

// Craft.js 兼容的日历节点组件
export const NodeCalendar: CraftComponent<CalendarProps> = (props) => {
  return <DraggableCalendar {...props} />;
};

// 添加 Craft 配置
NodeCalendar.craft = {
  displayName: 'Calendar',
  props: {
    showOutsideDays: true,
    className: 'p-3',
  },
  related: {
    toolbar: SettingsControl,
  },
  custom: {
    importPath: '@/components/ui/calendar',
  },
};

// 可以添加自定义设置控件
// 这里只是一个示例，你需要根据实际需求实现 CalendarSettings
const CalendarSettings: React.FC = () => {
  const { props, actions } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div>
      <label>
        Show Outside Days:
        <input
          type="checkbox"
          checked={props.showOutsideDays}
          onChange={(e) => actions.setProp((props: CalendarProps) => (props.showOutsideDays = e.target.checked))}
        />
      </label>
      {/* 添加更多设置选项 */}
    </div>
  );
};

// 更新 Craft 配置以包含自定义设置控件
NodeCalendar.craft.related.toolbar = CalendarSettings;