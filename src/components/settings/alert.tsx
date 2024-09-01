<<<<<<< HEAD
import React from 'react';
import { useNode } from '@craftjs/core';
=======
import React, { useState, useEffect } from 'react';
import { useNode, useEditor } from '@craftjs/core';
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const AlertSettings = () => {
<<<<<<< HEAD
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={props.title || ''}
          onChange={(e) => setProp((props: any) => (props.title = e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={props.description || ''}
          onChange={(e) => setProp((props: any) => (props.description = e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="variant">Variant</Label>
        <Select
          value={props.variant || 'default'}
          onValueChange={(value) => setProp((props: any) => (props.variant = value))}
        >
          <SelectTrigger id="variant">
=======
  const { actions: { setProp }, props, id } = useNode((node) => ({
    props: node.data.props,
    id: node.id,
  }));

  const { query, actions } = useEditor();

  const [titleText, setTitleText] = useState('');
  const [descriptionText, setDescriptionText] = useState('');

  useEffect(() => {
    const node = query.node(id).get();
    const titleNodeId = node.data.nodes[0];
    const descriptionNodeId = node.data.nodes[1];

    const titleNode = query.node(titleNodeId).get();
    const descriptionNode = query.node(descriptionNodeId).get();

    setTitleText(titleNode.data.props.children);
    setDescriptionText(descriptionNode.data.props.children);
  }, [id, query]);

  const handleReplace = (nodeId, newText) => {
    actions.setProp(nodeId, (props) => {
      props.children = newText;
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="variant">Variant</Label>
        <Select
          onValueChange={(value) => setProp((props) => (props.variant = value))}
          value={props.variant}
        >
          <SelectTrigger>
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
            <SelectValue placeholder="Select variant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="destructive">Destructive</SelectItem>
          </SelectContent>
        </Select>
      </div>
<<<<<<< HEAD
    </div>
  );
};
=======
      <div>
        <Label htmlFor="className">Class Name</Label>
        <Input
          id="className"
          value={props.className}
          onChange={(e) => setProp((props) => (props.className = e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="title">Alert Title</Label>
        <Input
          id="title"
          value={titleText}
          onChange={(e) => {
            setTitleText(e.target.value);
            const node = query.node(id).get();
            const titleNodeId = node.data.nodes[0];
            handleReplace(titleNodeId, e.target.value);
          }}
        />
      </div>
      <div>
        <Label htmlFor="description">Alert Description</Label>
        <Input
          id="description"
          value={descriptionText}
          onChange={(e) => {
            setDescriptionText(e.target.value);
            const node = query.node(id).get();
            const descriptionNodeId = node.data.nodes[1];
            handleReplace(descriptionNodeId, e.target.value);
          }}
        />
      </div>
    </div>
  );
};
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
