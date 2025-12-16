import { motion } from 'framer-motion'

const icons = [
  {
    id: 'btc',
    path: 'M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z',
    delay: 0,
    duration: 20,
    radius: 180,
    reverse: false
  },
  {
    id: 'eth',
    path: 'M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z',
    delay: 2,
    duration: 25,
    radius: 200,
    reverse: true
  },
  {
    id: 'usdt',
    path: 'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.5 9.5h-3.75v1.25h3.5v1.5h-3.5v5.25h-3v-5.25h-3.5v-1.5h3.5V9.5h-3.75v-2h11v2z',
    delay: 4,
    duration: 22,
    radius: 220,
    reverse: false
  },
  {
    id: 'lock',
    path: 'M12 2C9.243 2 7 4.243 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3zm0 9c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z',
    delay: 6,
    duration: 18,
    radius: 160,
    reverse: true
  },
  {
    id: 'key',
    path: 'M7 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm12.93-2.07l-7.86 7.86c-.39.39-.9.58-1.41.58H8c-.55 0-1-.45-1-1v-2.66c0-.51.19-1.02.58-1.41l7.86-7.86c.78-.78 2.05-.78 2.83 0l1.66 1.66c.78.78.78 2.05 0 2.83z',
    delay: 8,
    duration: 24,
    radius: 190,
    reverse: false
  },
  {
    id: 'shard',
    path: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    delay: 10,
    duration: 21,
    radius: 210,
    reverse: true
  }
]

export default function OrbitingIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
      {icons.map((icon) => (
        <motion.div
          key={icon.id}
          className="absolute top-1/2 left-1/2"
          style={{
            width: 40,
            height: 40,
            marginLeft: -20,
            marginTop: -20
          }}
          animate={{
            rotate: icon.reverse ? -360 : 360
          }}
          transition={{
            duration: icon.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: icon.delay
          }}
        >
          <motion.div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              marginLeft: icon.radius,
              marginTop: 0
            }}
            animate={{
              rotate: icon.reverse ? 360 : -360
            }}
            transition={{
              duration: icon.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: icon.delay
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              className="drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"
            >
              <path
                d={icon.path}
                stroke="#3B82F6"
                strokeWidth="0.5"
                fill="rgba(59, 130, 246, 0.15)"
              />
            </svg>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
