import { useMemo } from 'react'
import MindMap from '../components/MindMap.jsx'
import { buildMindMap } from '../data/mindmap.js'

export default function MindMapPage() {
  const tree = useMemo(() => buildMindMap(), [])
  return (
    <div className="page-1">
      <div className="page-head">
        <h1>Zihin haritası</h1>
        <p className="lead">Tekerlekle yakınlaştır, sürükleyerek kaydır. Bir kutuya ya da kelimeye tıklarsan ilgili sayfa açılır.</p>
      </div>
      <MindMap tree={tree} />
    </div>
  )
}
