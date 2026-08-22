import React from 'react';

export function ApplianceIcon({ type, className = "w-6 h-6", color = "#A3FF6B" }) {
  const normalized = (type || '').toLowerCase();

  // 1. Air Conditioner
  if (normalized.includes('ac') || normalized.includes('air_conditioner') || normalized.includes('cooler')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="4" width="20" height="11" rx="2" fill="#111111" />
        <line x1="6" y1="11" x2="18" y2="11" />
        <circle cx="18" cy="7.5" r="0.75" fill={color} />
        {/* Cool Air Flow Waves */}
        <path d="M6 18c0.8 1 1.6 1 2.4 0s1.6-1 2.4 0" strokeWidth="1.5" />
        <path d="M13 18c0.8 1 1.6 1 2.4 0s1.6-1 2.4 0" strokeWidth="1.5" />
        <line x1="6" y1="7.5" x2="10" y2="7.5" strokeWidth="1.5" />
      </svg>
    );
  }

  // 2. Refrigerator
  if (normalized.includes('fridge') || normalized.includes('refrigerator')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="5" y="2" width="14" height="20" rx="2" fill="#111111" />
        <line x1="5" y1="10" x2="19" y2="10" />
        <line x1="8" y1="5.5" x2="8" y2="8" />
        <line x1="8" y1="13.5" x2="8" y2="17" />
        <circle cx="15" cy="6" r="0.75" fill={color} />
      </svg>
    );
  }

  // 3. Ceiling Fan
  if (normalized.includes('fan')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="3" fill="#111111" />
        <line x1="12" y1="3" x2="12" y2="9" />
        <path d="M12 9c-3-4-8-3-8 1s4 4 8 2" />
        <path d="M14.5 13.5c4 2 6 6 3 9s-6-1-5-7" />
        <path d="M9.5 13.5c-4 2-6 6-3 9s6-1 5-7" />
      </svg>
    );
  }

  // 4. LED Lights
  if (normalized.includes('light') || normalized.includes('bulb') || normalized.includes('lamp')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-7 7c0 3.03 1.97 5.61 4.73 6.57a1 1 0 0 1 .67.94V17a1 1 0 0 0 1 1h1.2a1 1 0 0 0 1-1v-.49a1 1 0 0 1 .67-.94C17.03 14.61 19 12.03 19 9a7 7 0 0 0-7-7z" fill="#111111" />
        <line x1="12" y1="6" x2="12" y2="10" />
      </svg>
    );
  }

  // 5. Television / Home Theater
  if (normalized.includes('tv') || normalized.includes('television') || normalized.includes('theater')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="5" width="20" height="13" rx="2" fill="#111111" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="18" x2="12" y2="21" />
        {/* Antenna / screen glow line */}
        <line x1="5" y1="9" x2="13" y2="9" strokeWidth="1.2" opacity="0.6" />
      </svg>
    );
  }

  // 6. Washing Machine
  if (normalized.includes('washing') || normalized.includes('laundry')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="4" y="2" width="16" height="20" rx="2" fill="#111111" />
        <circle cx="12" cy="13" r="5" strokeWidth="1.5" />
        <circle cx="12" cy="13" r="2.5" strokeDasharray="2 2" />
        <circle cx="8" cy="5.5" r="1" fill={color} />
        <circle cx="12" cy="5.5" r="1" fill={color} />
        <line x1="15" y1="5.5" x2="17" y2="5.5" />
      </svg>
    );
  }

  // 7. Water Heater / Geyser
  if (normalized.includes('heater') || normalized.includes('geyser')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="6" y="3" width="12" height="17" rx="6" fill="#111111" />
        <line x1="9" y1="20" x2="9" y2="22" />
        <line x1="15" y1="20" x2="15" y2="22" />
        {/* Flame / Heat coil */}
        <path d="M12 8v4" strokeWidth="2" />
        <circle cx="12" cy="14" r="1.5" fill={color} />
        <circle cx="12" cy="6" r="0.75" fill={color} />
      </svg>
    );
  }

  // 8. Laptop / Computer
  if (normalized.includes('laptop') || normalized.includes('computer') || normalized.includes('pc')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="4" y="4" width="16" height="11" rx="1.5" fill="#111111" />
        <line x1="2" y1="18" x2="22" y2="18" strokeWidth="2" />
        <line x1="10" y1="18" x2="14" y2="18" stroke={color} strokeWidth="2" />
      </svg>
    );
  }

  // 9. Microwave Oven
  if (normalized.includes('microwave') || normalized.includes('oven')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="4" width="20" height="15" rx="2" fill="#111111" />
        <rect x="4.5" y="7" width="11" height="9" rx="1" strokeWidth="1.2" />
        <line x1="18" y1="8" x2="19.5" y2="8" strokeWidth="2" />
        <line x1="18" y1="11" x2="19.5" y2="11" strokeWidth="2" />
        <line x1="18" y1="14" x2="19.5" y2="14" strokeWidth="2" />
      </svg>
    );
  }

  // 10. Rice Cooker / Induction Cooktop
  if (normalized.includes('rice') || normalized.includes('cooker') || normalized.includes('induction')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 11h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-6z" fill="#111111" />
        <path d="M5 11c0-4 3-7 7-7s7 3 7 7" />
        <circle cx="12" cy="3" r="1" fill={color} />
        <line x1="12" y1="15" x2="12" y2="17" strokeWidth="2" />
        <circle cx="15" cy="16" r="0.75" fill={color} />
      </svg>
    );
  }

  // 11. Water Purifier RO
  if (normalized.includes('purifier') || normalized.includes('water_purifier') || normalized.includes('filter')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="6" y="3" width="12" height="18" rx="2" fill="#111111" />
        <path d="M12 8c-1.5 2-2 3-2 4a2 2 0 1 0 4 0c0-1-.5-2-2-4z" fill={color} />
        <line x1="9" y1="16" x2="15" y2="16" strokeWidth="1.2" />
      </svg>
    );
  }

  // 12. EV Charger
  if (normalized.includes('ev') || normalized.includes('charger') || normalized.includes('vehicle')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="3" width="11" height="18" rx="2" fill="#111111" />
        <path d="M8 8l-2 4h3l-1 4" strokeWidth="2" stroke={color} />
        {/* Cable & Plug */}
        <path d="M14 9h3a2 2 0 0 1 2 2v4a1 1 0 0 0 1 1h1" />
        <rect x="19" y="11" width="3" height="4" rx="1" fill={color} />
      </svg>
    );
  }

  // 13. WiFi Router
  if (normalized.includes('router') || normalized.includes('wifi')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="14" width="20" height="7" rx="2" fill="#111111" />
        <line x1="6" y1="14" x2="6" y2="7" strokeWidth="2" />
        <line x1="18" y1="14" x2="18" y2="7" strokeWidth="2" />
        <circle cx="8" cy="17.5" r="0.75" fill={color} />
        <circle cx="12" cy="17.5" r="0.75" fill={color} />
        <circle cx="16" cy="17.5" r="0.75" fill={color} />
      </svg>
    );
  }

  // 14. Iron Box
  if (normalized.includes('iron')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 18h18l-3-9H8c-3 0-5 3-5 9z" fill="#111111" />
        <path d="M7 9V6h8v3" />
        <circle cx="14" cy="14" r="1" fill={color} />
      </svg>
    );
  }

  // Default / Energy Generic Bolt
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#111111" />
    </svg>
  );
}

export default ApplianceIcon;
