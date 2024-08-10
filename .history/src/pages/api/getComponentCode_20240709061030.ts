import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 这里应该从数据库或其他存储中获取组件代码
  const componentCode = `
    function Component() {
      return (
        <div className="container">
          <NodeButton>Button 1</NodeButton>
                  <NodeButton>Button 2</NodeButton>
                  <NodeButton>Button 3</NodeButton>
                  <NodeButton>Button 4</NodeButton>
        </div>
      );
    }
  `;

  res.status(200).send(componentCode);
}