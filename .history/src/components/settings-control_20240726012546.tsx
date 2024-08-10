import { useEditor, useNode } from '@craftjs/core';
import { ReactNode, useEffect, useState } from 'react';
import Select, { MultiValue, components, createFilter } from 'react-select';
import { suggestions } from '@/lib/tw-classes';
import { Option } from 'react-tailwindcss-select/dist/components/type';
import { FixedSizeList as List } from 'react-window';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AvatarSettings } from '@/components/settings/avatar';

// ... (保留其他导入和 MenuList, CustomOption 定义)

export const SettingsControl = () => {
  const { query, actions } = useEditor();
  const {
    id,
    classNames,
    deletable,
    text,
    nodeName,
    actions: { setProp },
  } = useNode((node) => ({
    classNames: node.data.props['className'] as string,
    text: node.data.props['children'] as string,
    deletable: query.node(node.id).isDeletable(),
    nodeName: node.data.displayName,
  }));

  // ... (保留现有的 state 和 effect)

  return (
    <div className="p-4 space-y-4">
      {deletable ? (
        <Button
          variant={'destructive'}
          className="cursor-pointer w-full"
          onClick={(event) => {
            event.stopPropagation();
            if (parent) {
              actions.delete(id);
            }
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      ) : null}
      
      {typeof text === 'string' ? (
        <Input
          type="text"
          value={text}
          onChange={(e) =>
            setProp(
              (props: { children: ReactNode }) =>
                (props.children = e.target.value.replace(/<\/?[^>]+(>|$)/g, ''))
            )
          }
        />
      ) : null}
      
      <div>
        <Label htmlFor="tailwind-classes">Tailwind Classes</Label>
        <Select
          options={selectOptions}
          isSearchable
          isClearable={false}
          components={{ MenuList, Option: CustomOption }}
          isMulti
          placeholder={'Add new class'}
          value={value}
          filterOption={createFilter({ ignoreAccents: false })}
          onChange={(option) => {
            if (option && Array.isArray(option)) {
              const classNames = option.map((item) => item.value).join(' ');
              setProp((props: { className: string }) => {
                console.log('Setting props ', props.className);
                props.className = classNames;
              });
            }

            if (!option) {
              setProp((props: { className: string }) => (props.className = ''));
            }

            setValue(option);
          }}
        />
      </div>

      {nodeName === 'Avatar' && <AvatarSettings />}
    </div>
  );
};