export default function VaultIcon({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Vault Body */}
      <rect x="15" y="35" width="70" height="55" rx="4" fill="#11161C" stroke="#3B82F6" strokeWidth="2"/>
      
      {/* Vault Door */}
      <circle cx="50" cy="62" r="18" fill="#0F1317" stroke="#3B82F6" strokeWidth="2"/>
      <circle cx="50" cy="62" r="12" fill="#11161C" stroke="#4A90E2" strokeWidth="1.5"/>
      <circle cx="50" cy="62" r="6" fill="#3B82F6"/>
      
      {/* Lock Mechanism */}
      <rect x="48" y="72" width="4" height="12" fill="#3B82F6" rx="1"/>
      
      {/* Vault Top */}
      <rect x="20" y="15" width="60" height="22" rx="3" fill="#0F1317" stroke="#3B82F6" strokeWidth="2"/>
      
      {/* Hinges */}
      <rect x="18" y="40" width="4" height="8" fill="#D1A954" rx="1"/>
      <rect x="18" y="70" width="4" height="8" fill="#D1A954" rx="1"/>
      
      {/* Security Bolts */}
      <circle cx="25" cy="44" r="2" fill="#D1A954"/>
      <circle cx="25" cy="74" r="2" fill="#D1A954"/>
      <circle cx="75" cy="44" r="2" fill="#D1A954"/>
      <circle cx="75" cy="74" r="2" fill="#D1A954"/>
    </svg>
  )
}
