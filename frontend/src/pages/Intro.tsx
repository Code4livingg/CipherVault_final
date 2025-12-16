import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import CyberGlobe from '../components/intro/CyberGlobe'
import VaultRing from '../components/intro/VaultRing'
import OrbitingIcons from '../components/intro/OrbitingIcons'
import FloatingHolograms from '../components/intro/FloatingHolograms'
import ApprovalNetwork from '../components/intro/ApprovalNetwork'
import PageTransition from '../components/ui/PageTransition'
import FloatingPanel from '../components/ui/FloatingPanel'
import GlobalCinematicEnvironment from '../components/environment/GlobalCinematicEnvironment'

export default function Intro() {
  const navigate = useNavigate()

  return (
    <PageTransition direction="horizontal">
      <div className="relative min-h-screen bg-[#0A0F14] flex flex-col items-center justify-center overflow-hidden">
        {/* Global Cinematic Environment */}
        <GlobalCinematicEnvironment />
      {/* Security grid pattern */}
      <div className="absolute inset-0 security-grid opacity-60" style={{ zIndex: 0 }} />
      
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />

      {/* Circuit paths overlay */}
      <div className="absolute inset-0 opacity-10" style={{ zIndex: 0 }}>
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,20 L30,20 L30,40 L60,40" stroke="#3B82F6" strokeWidth="0.1" fill="none" />
          <path d="M100,30 L70,30 L70,60 L40,60" stroke="#3B82F6" strokeWidth="0.1" fill="none" />
          <path d="M0,80 L20,80 L20,50 L50,50" stroke="#D1A954" strokeWidth="0.1" fill="none" />
          <circle cx="30" cy="20" r="0.5" fill="#3B82F6" />
          <circle cx="30" cy="40" r="0.5" fill="#3B82F6" />
          <circle cx="70" cy="30" r="0.5" fill="#3B82F6" />
          <circle cx="20" cy="80" r="0.5" fill="#D1A954" />
        </svg>
      </div>

      {/* Layer 0: Approval Network (behind everything) */}
      <ApprovalNetwork />

      {/* Layer 1: Cyber Globe (centered) */}
      <div style={{ zIndex: 10 }}>
        <CyberGlobe />
      </div>

      {/* Layer 2: Vault Ring (on top of globe) */}
      <div style={{ zIndex: 20 }}>
        <VaultRing />
      </div>

      {/* Layer 3: Orbiting Icons (around globe) */}
      <div style={{ zIndex: 30 }}>
        <OrbitingIcons />
      </div>

      {/* Layer 4: Floating Holograms (sides) */}
      <div style={{ zIndex: 40 }}>
        <FloatingHolograms />
      </div>

      {/* Layer 5: Hero Content (front) */}
      <div className="relative z-50 flex flex-col items-center justify-center px-4 py-16 max-w-5xl mx-auto text-center w-full">
        {/* Title with neon outline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 font-heading relative"
          style={{ 
            letterSpacing: '-0.03em',
            textShadow: '0 0 40px rgba(59, 130, 246, 0.12)'
          }}
        >
          <span className="relative inline-block">
            CIPHER VAULT
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                WebkitTextStroke: '1px #3B82F6',
                color: 'transparent'
              }}
            >
              CIPHER VAULT
            </div>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-xl lg:text-2xl text-[#CBD5E1] mb-12 max-w-3xl leading-relaxed font-body"
        >
          Autonomous Multi-Party Crypto Vaults with Auto-Swaps
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          {/* Primary CTA */}
          <motion.button
            whileHover={{ 
              y: -2,
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/create')}
            className="px-10 py-4 bg-transparent border border-[#3B82F6] text-white text-lg font-semibold rounded-lg transition-all hover:border-[#60A5FA] font-heading"
          >
            Create a Vault
          </motion.button>

          {/* Secondary CTA */}
          <motion.button
            whileHover={{ 
              y: -2,
              borderColor: '#3B82F6'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/create')}
            className="px-10 py-4 bg-transparent border border-[#1E293B] text-[#94A3B8] text-lg font-semibold rounded-lg transition-all hover:text-white font-heading"
          >
            View Demo
          </motion.button>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 flex flex-wrap gap-3 justify-center max-w-2xl"
        >
          {['Multi-Party', 'Auto-Swap', 'Self-Destruct', 'MPC-Inspired', 'Encrypted'].map((feature, idx) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.2 + idx * 0.1 }}
              className="px-4 py-2 bg-[#0A0F14]/60 backdrop-blur-sm border border-[#3B82F6]/20 rounded-full text-[#CBD5E1] text-sm font-mono"
            >
              {feature}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #0A0F14, transparent)',
          zIndex: 45
        }}
      />

      {/* Floating Crypto OS Panels */}
      <FloatingPanel
        variant="sticker"
        icon="₿"
        label="BTC"
        x={85}
        y={75}
        size={70}
        zIndex={50}
      />
      <FloatingPanel
        variant="badge"
        icon="🔐"
        label="Vault"
        x={8}
        y={50}
        size={90}
        zIndex={50}
      />
      <FloatingPanel
        variant="badge"
        icon="🔑"
        label="MPC"
        x={12}
        y={15}
        size={75}
        zIndex={50}
      />
      <FloatingPanel
        variant="chip"
        icon="⚡"
        label="AutoSwap"
        x={88}
        y={20}
        size={85}
        zIndex={50}
      />
    </div>
    </PageTransition>
  )
}
