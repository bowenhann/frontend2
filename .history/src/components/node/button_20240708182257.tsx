import { withNode } from '@/components/node';
import { Button } from '@/components/ui/button';
import { SettingsControl } from '@/components/settings-control';

const draggable = true;

export const NodeButton = withNode(Button, {
  draggable,
});

NodeButton.craft = {
  ...NodeButton.craft,
  related: {
    toolbar: SettingsControl,
  },
};
