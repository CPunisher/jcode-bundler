import { Message, Grid, Form, Button, Input } from '@arco-design/web-react'
import { useCallback, useEffect, useState } from 'react';
import './App.css'
import CodeBlock from './CodeBlock';
import NetGraph from './NetGraph';

function App() {
  const [rawUrl, setRawUrl] = useState("https://code.juejin.cn/api/raw/7181761498023198779?id=7181761498023215163")
  const [bundleResult, setBundleResult] = useState({
    code: '',
    graph: {
      nodes: {},
      edges: {},
    }
  })

  const bundle = useCallback(() => {
    fetch('/api/bundle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rawUrl,
      })
    })
      .then(res => res.json())
      .then(res => {
        setBundleResult(res)
        Message.success('编译成功')
      })
      .catch(() => {
        Message.error('编译失败')
      })
  }, [rawUrl])

  useEffect(() => {
    bundle()
  }, [])

  return (
    <div className="App">
      <h1>JCode Bundler</h1>
      <Form>
        <Grid.Row justify='center'>
          <Form.Item label="入口" style={{ width: 370 }}>
            <Input
              placeholder="请输入 rawUrl"
              value={rawUrl}
              onChange={setRawUrl}
            />
          </Form.Item>
          <Button style={{ margin: "0 12px" }} onClick={bundle}>
            Bundle
          </Button>
        </Grid.Row>
      </Form>
      <div className='result'>
        <div className='result-block'>
          <h2>编译结果</h2>
          <CodeBlock lang="jsx" code={bundleResult.code ?? ''} />
        </div>
        <div className='result-block'>
          <h2>依赖图</h2>
          <NetGraph data={bundleResult.graph} />
          <CodeBlock lang="json" code={JSON.stringify(bundleResult.graph ?? {}, null, 4)} />
        </div>
      </div>
    </div>
  );
}

export default App
