import G6 from '@antv/g6';
import { useState, useEffect, useRef } from 'react';

const NetGraph = ({ data }) => {
  const containerRef = useRef()
  const [graph, setGraph] = useState()

  useEffect(() => {
    const g = new G6.Graph({
      container: containerRef.current,
      width: containerRef.current.scrollWidth,
      height: containerRef.current.scrollHeight || 500,
      layout: {
        type: "force",
        linkDistance: 200,
      },
      defaultNode: {
        size: 50,
        color: "#5B8FF9",
        style: {
          lineWidth: 4,
          fill: "#C6E5FF",
        },
      },
      defaultEdge: {
        size: 3,
        color: '#cccccc',
        style: {
          endArrow: true,
        }
      },
    })
    setGraph(g)
    return () => {
      g.destroy()
    } 
  }, []);

  useEffect(() => {
    if (graph && !graph.destroyed && data) {
      const mappedData = {
        nodes: Object.values(data.nodes).map(node => ({ id: node.id, label: node.id })),
        edges: [
          ...Object.entries(data.edges).flatMap(([source, targets]) => 
            targets.map(target => ({ source, target }))
          )
        ]
      };
      graph.data(mappedData)
      graph.render()
    }
  }, [graph, data])

  return (
    <div ref={containerRef} style={{ textAlign: 'center' }}>
    </div>
  )
}

export default NetGraph