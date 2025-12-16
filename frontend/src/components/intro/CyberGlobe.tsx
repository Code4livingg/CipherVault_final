import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function CyberGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const size = window.innerWidth < 768 ? 350 : 550
    canvas.width = size
    canvas.height = size

    let rotation = 0
    const radius = size * 0.35
    const centerX = size / 2
    const centerY = size / 2

    // Create wireframe sphere
    const latLines = 16
    const lonLines = 24

    function drawGlobe() {
      if (!ctx || !canvas) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)'
      ctx.lineWidth = 1

      // Draw latitude lines
      for (let i = 0; i <= latLines; i++) {
        const lat = (Math.PI * i) / latLines - Math.PI / 2
        const y = Math.sin(lat) * radius

        ctx.beginPath()
        for (let j = 0; j <= lonLines; j++) {
          const lon = (2 * Math.PI * j) / lonLines + rotation
          const x = Math.cos(lat) * Math.cos(lon) * radius
          const z = Math.cos(lat) * Math.sin(lon) * radius

          // Simple 3D projection
          const scale = 1 / (1 + z / (radius * 2))
          const projX = centerX + x * scale
          const projY = centerY + y * scale

          if (j === 0) {
            ctx.moveTo(projX, projY)
          } else {
            ctx.lineTo(projX, projY)
          }
        }
        ctx.stroke()
      }

      // Draw longitude lines
      for (let i = 0; i < lonLines; i++) {
        const lon = (2 * Math.PI * i) / lonLines + rotation

        ctx.beginPath()
        for (let j = 0; j <= latLines; j++) {
          const lat = (Math.PI * j) / latLines - Math.PI / 2
          const x = Math.cos(lat) * Math.cos(lon) * radius
          const y = Math.sin(lat) * radius
          const z = Math.cos(lat) * Math.sin(lon) * radius

          const scale = 1 / (1 + z / (radius * 2))
          const projX = centerX + x * scale
          const projY = centerY + y * scale

          if (j === 0) {
            ctx.moveTo(projX, projY)
          } else {
            ctx.lineTo(projX, projY)
          }
        }
        ctx.stroke()
      }

      rotation += 0.002
      requestAnimationFrame(drawGlobe)
    }

    drawGlobe()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    >
      <canvas ref={canvasRef} className="opacity-80" />
    </motion.div>
  )
}
