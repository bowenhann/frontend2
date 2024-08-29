import { withNode } from '@/components/node/connector';
import { Button } from '@/components/ui/button';
import { SettingsControl } from '@/components/settings-control';

const draggable = true;

export const NodeButton = withNode(Button, {
  draggable,
});

(NodeButton as any).craft = {
  ...((NodeButton as any).craft || {}),
  related: {
    toolbar: SettingsControl,
  },
};
