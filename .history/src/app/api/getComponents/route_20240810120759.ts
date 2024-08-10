import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 这里应该从数据库或其他存储中获取组件结构
  const components = {
    type: 'div',
    props: { className: 'container' },
    children: [
      {
        type: 'Button',
        props: { variant: 'primary' },
        children: ['Click me']
      },
      {
        type: 'Card',
        props: { title: 'Example Card' },
        children: ['This is a card content']
      }
    ]
  };

  res.status(200).json(components);
}