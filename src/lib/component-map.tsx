import { Element } from '@craftjs/core'
<<<<<<< HEAD
=======
import { CodeGenerator } from '@/components/codeGenerator'
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
import { ResizableComponent } from '@/components/resizableComponent'
import { NodeButton } from '@/components/node/button'
import {
	NodeCardHeader,
	NodeCard,
	NodeCardContent,
	NodeCardDescription,
	NodeCardTitle,
	NodeCardFooter
} from '@/components/node/card'
import { NodeCalendar } from '@/components/node/calendar'
import {
	NodeAccordion,
	NodeAccordionTrigger,
	NodeAccordionItem,
	NodeAccordionContent
} from '@/components/node/accordion'
import { NodeAvatar } from '@/components/node/avatar'
import { NodeAlertDialog } from '@/components/node/alert-dialog'
<<<<<<< HEAD
import { NodeAlert } from '@/components/node/alert'
=======
import { NodeAlert, NodeAlertTitle, NodeAlertDescription } from '@/components/node/alert'
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
import { NodeAspectRatio } from '@/components/node/aspect-ratio'
import { DynamicContent } from '@/components/dynamicContent'
import { NodeBadge } from '@/components/node/badge'
import { NodeCollapsible } from '@/components/node/collapsible'
import { NodeCheckbox } from '@/components/node/checkbox'
import { NodeContextMenu } from '@/components/node/context-menu'
import { NodeCommand } from '@/components/node/command'
import { NodeDialog } from '@/components/node/dialog'
import { NodeInput } from '@/components/node/input'
import { NodeHoverCard } from '@/components/node/hover-card'
import { NodeMenubar,
  NodeMenubarMenu,
  NodeMenubarTrigger,
  NodeMenubarContent,
  NodeMenubarItem,
  NodeMenubarSeparator,
  NodeMenubarShortcut,
  NodeMenubarSub,
  NodeMenubarSubContent,
  NodeMenubarSubTrigger,
  NodeMenubarCheckboxItem,
  NodeMenubarRadioGroup,
  NodeMenubarRadioItem,
   } from '@/components/node/menubar';

export const componentMap = {
	Element,
	NodeButton,
	NodeCard,
	NodeCardHeader,
	NodeCardTitle,
	NodeCardDescription,
	NodeCardContent,
	NodeCardFooter,
	NodeCalendar,
<<<<<<< HEAD
	div: 'div',
	span: 'span',
=======
	// div: 'div',
	// span: 'span',
	// p: 'p',
	// h1: 'h1',
	// h2: 'h2',
	// h3: 'h3',
	// h4: 'h4',
	// h5: 'h5',
	// h6: 'h6',
	// li: 'li',
	// ul: 'ul',
	// ol: 'ol',
	// em: 'em',
	// strong: 'strong',
	CodeGenerator,
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
	ResizableComponent,
	NodeAccordion,
	NodeAccordionTrigger,
	NodeAccordionItem,
	NodeAccordionContent,
	NodeAspectRatio,
	NodeAvatar,
	NodeAlertDialog,
	NodeAlert,
<<<<<<< HEAD
=======
	NodeAlertTitle, NodeAlertDescription,
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
	NodeBadge,
	NodeCollapsible,
	NodeCheckbox,
	NodeContextMenu,
	NodeCommand,
	NodeDialog,
	NodeInput,
	NodeHoverCard,
  NodeMenubar,
  NodeMenubarMenu,
  NodeMenubarTrigger,
  NodeMenubarContent,
  NodeMenubarItem,
  NodeMenubarSeparator,
  NodeMenubarShortcut,
  NodeMenubarSub,
  NodeMenubarSubContent,
  NodeMenubarSubTrigger,
  NodeMenubarCheckboxItem,
  NodeMenubarRadioGroup,
  NodeMenubarRadioItem,
	DynamicContent
}

export const componentNameMap = {
	Button: 'NodeButton',
	Card: 'NodeCard',
	CardHeader: 'NodeCardHeader',
	CardContent: 'NodeCardContent',
	CardFooter: 'NodeCardFooter',
	CardTitle: 'NodeCardTitle',
	CardDescription: 'NodeCardDescription',
	Badge: 'NodeBadge',
	Accordion: 'NodeAccordion',
	AccordionTrigger: 'NodeAccordionTrigger',
	AccordionItem: 'NodeAccordionItem',
	AccordionContent: 'NodeAccordionContent',
	AspectRatio: 'NodeAspectRatio',
	Avatar: 'NodeAvatar',
	AlertDialog: 'NodeAlertDialog',
	Alert: 'NodeAlert',
<<<<<<< HEAD
=======
	AlertTitle: 'NodeAlertTitle',
	AlertDescription: 'NodeAlertDescription',
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
	Checkbox: 'NodeCheckbox',
	Collapsible: 'NodeCollapsible',
	Command: 'NodeCommand',
	ContextMenu: 'NodeContextMenu',
	Dialog: 'NodeDialog',
	HoverCard: 'NodeHoverCard',
  Input: 'NodeInput',
  Menubar: 'NodeMenubar',
  MenubarMenu: 'NodeMenubarMenu',
  MenubarTrigger: 'NodeMenubarTrigger',
  MenubarContent: 'NodeMenubarContent',
  MenubarItem: 'NodeMenubarItem',
  MenubarSeparator: 'NodeMenubarSeparator',
  MenubarShortcut: 'NodeMenubarShortcut',
  MenubarSub: 'NodeMenubarSub',
  MenubarSubContent: 'NodeMenubarSubContent',
  MenubarSubTrigger: 'NodeMenubarSubTrigger',
  MenubarCheckboxItem: 'NodeMenubarCheckboxItem',
  MenubarRadioGroup: 'NodeMenubarRadioGroup',
  MenubarRadioItem: 'NodeMenubarRadioItem',
}
