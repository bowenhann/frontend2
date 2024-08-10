import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { CodeView } from '@/components/code-view';
import { useEditor } from '@craftjs/core';
import { useState } from 'react';
import { getOutputCode } from '@/lib/code-gen';

