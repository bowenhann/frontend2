<<<<<<< HEAD
=======

// @/components/settings/avatar.tsx
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<<<<<<< HEAD
export const AvatarSettings: React.FC = () => {
=======
export const AvatarSettings = () => {
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="src">Image Source</Label>
        <Input
          id="src"
<<<<<<< HEAD
          value={props.src || ''}
          onChange={(e) => setProp((props: any) => (props.src = e.target.value))}
          placeholder="Enter image URL"
=======
          value={props.src}
          onChange={(e) => setProp((props) => (props.src = e.target.value))}
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
        />
      </div>
      <div>
        <Label htmlFor="alt">Alt Text</Label>
        <Input
          id="alt"
<<<<<<< HEAD
          value={props.alt || ''}
          onChange={(e) => setProp((props: any) => (props.alt = e.target.value))}
          placeholder="Enter alt text"
=======
          value={props.alt}
          onChange={(e) => setProp((props) => (props.alt = e.target.value))}
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
        />
      </div>
      <div>
        <Label htmlFor="fallback">Fallback Text</Label>
        <Input
          id="fallback"
<<<<<<< HEAD
          value={props.fallback || ''}
          onChange={(e) => setProp((props: any) => (props.fallback = e.target.value))}
          placeholder="Enter fallback text"
=======
          value={props.fallback}
          onChange={(e) => setProp((props) => (props.fallback = e.target.value))}
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
        />
      </div>
    </div>
  );
};