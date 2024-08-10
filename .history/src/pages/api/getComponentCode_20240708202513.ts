import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 这里应该从数据库或其他存储中获取组件代码
  const componentCode = `
    function Component() {
      return (
        <div className="container">
          <Button variant="primary">Click me</Button>
          <Card title="Example Card">
            This is a card content
          </Card>
        </div>
      );
    }
  `;

  res.status(200).send(componentCode);
}