// Hand-drawn (pure SVG) learning illustrations — no external photos.
// Palette kept calm and high-contrast so text stays readable for all ages.

export function HeroPattern({ className = "" }) {
  return <svg className={className} viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="hp-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#062a52" />
        <stop offset="0.55" stopColor="#0b4a86" />
        <stop offset="1" stopColor="#0c7a86" />
      </linearGradient>
      <radialGradient id="hp-glow" cx="0.8" cy="0.2" r="0.7">
        <stop offset="0" stopColor="#7fe3e0" stopOpacity="0.5" />
        <stop offset="1" stopColor="#7fe3e0" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="1200" height="600" fill="url(#hp-bg)" />
    <rect width="1200" height="600" fill="url(#hp-glow)" />
    <g opacity="0.16" fill="#ffffff" fontFamily="Georgia, serif" fontWeight="700">
      <text x="60" y="150" fontSize="120">A</text>
      <text x="220" y="420" fontSize="90">क</text>
      <text x="420" y="200" fontSize="140">B</text>
      <text x="640" y="470" fontSize="100">अ</text>
      <text x="820" y="160" fontSize="120">C</text>
      <text x="980" y="430" fontSize="110">ख</text>
      <text x="1080" y="230" fontSize="90">D</text>
      <text x="150" y="540" fontSize="80">ग</text>
    </g>
    <g opacity="0.14" stroke="#ffffff" fill="none" strokeWidth="3">
      <circle cx="1040" cy="120" r="70" />
      <circle cx="180" cy="470" r="46" />
      <path d="M0 560 Q300 500 600 560 T1200 560" />
    </g>
    <g opacity="0.22">
      <circle cx="950" cy="90" r="8" fill="#ffd166" />
      <circle cx="300" cy="120" r="6" fill="#8ecae6" />
      <circle cx="700" cy="300" r="7" fill="#95d5b2" />
      <circle cx="1120" cy="500" r="6" fill="#ffd166" />
    </g>
  </svg>;
}

function Block({ x, y, size, fill, letter, rotate = 0, dark = "#0b2e59" }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    <rect width={size} height={size} rx={size * 0.22} fill={fill} />
    <rect width={size * 0.84} height={size * 0.4} rx={size * 0.22} fill="#ffffff" opacity="0.12" x={size * 0.08} y={size * 0.08} />
    <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.55} fontWeight="800" fill={dark} fontFamily="Georgia, serif">{letter}</text>
  </g>;
}

export function IllustrationAlphabet() {
  return <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Alphabet blocks illustration">
    <defs>
      <linearGradient id="ia-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#eef7ff" /><stop offset="1" stopColor="#fdf6e9" /></linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#ia-bg)" />
    <circle cx="340" cy="52" r="30" fill="#ffd166" />
    <Block x={40} y={120} size={78} fill="#8ecae6" letter="A" rotate={-6} />
    <Block x={128} y={104} size={86} fill="#ffd166" letter="B" rotate={4} />
    <Block x={222} y={126} size={74} fill="#95d5b2" letter="C" rotate={-3} />
    <Block x={150} y={204} size={58} fill="#f4a6b8" letter="अ" rotate={3} dark="#7c1d3a" />
    <g transform="translate(300 210) rotate(28)">
      <rect width="16" height="70" rx="4" fill="#f4a261" />
      <polygon points="0,70 16,70 8,90" fill="#37352f" />
      <rect x="0" y="0" width="16" height="10" rx="3" fill="#e76f51" />
    </g>
  </svg>;
}

export function IllustrationStory() {
  return <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Story book illustration">
    <defs>
      <linearGradient id="is-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f3fbf6" /><stop offset="1" stopColor="#eef7ff" /></linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#is-bg)" />
    <path d="M60 214 Q200 178 340 214 L340 236 Q200 202 60 236 Z" fill="#dbe7f0" />
    <g>
      <path d="M60 210 Q130 184 200 206 L200 236 Q130 214 60 236 Z" fill="#ffffff" stroke="#c7d7e4" strokeWidth="2" />
      <path d="M340 210 Q270 184 200 206 L200 236 Q270 214 340 236 Z" fill="#ffffff" stroke="#c7d7e4" strokeWidth="2" />
      <text x="120" y="214" textAnchor="middle" fontSize="26" fontWeight="800" fill="#0b4a86" fontFamily="Georgia, serif">A a</text>
      <text x="280" y="214" textAnchor="middle" fontSize="26" fontWeight="800" fill="#1b7f4b">अ आ</text>
    </g>
    <g opacity="0.9">
      <circle cx="96" cy="96" r="26" fill="#f7c7a3" />
      <path d="M70 150 Q96 118 122 150 L122 176 L70 176 Z" fill="#12518f" />
      <circle cx="310" cy="104" r="22" fill="#f7c7a3" />
      <path d="M288 152 Q310 124 332 152 L332 176 L288 176 Z" fill="#b23a48" />
    </g>
    <g fill="#0b4a86" opacity="0.35" fontFamily="Georgia, serif" fontWeight="700">
      <text x="196" y="70" fontSize="30">क</text>
      <text x="236" y="58" fontSize="24">A</text>
      <text x="176" y="52" fontSize="22">B</text>
    </g>
  </svg>;
}

export function IllustrationSounds() {
  return <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Sounds illustration">
    <defs>
      <linearGradient id="iu-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fdf3f5" /><stop offset="1" stopColor="#f5f1ff" /></linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#iu-bg)" />
    <g transform="translate(120 96)">
      <rect x="0" y="34" width="34" height="52" rx="8" fill="#7c3aed" />
      <polygon points="34,34 74,4 74,116 34,86" fill="#7c3aed" />
      {[0, 1, 2].map(i => <path key={i} d={`M ${92 + i * 22} ${36 - i * 8} Q ${112 + i * 22} 60 ${92 + i * 22} ${84 + i * 8}`} fill="none" stroke="#7c3aed" strokeWidth="7" strokeLinecap="round" opacity={0.9 - i * 0.2} />)}
    </g>
    <g fill="#0b4a86" fontFamily="Georgia, serif" fontWeight="800">
      <text x="64" y="248" fontSize="30">अ</text>
      <text x="118" y="252" fontSize="26">क</text>
      <text x="168" y="250" fontSize="30">A</text>
      <text x="212" y="252" fontSize="26">B</text>
      <text x="258" y="250" fontSize="30">आ</text>
      <text x="308" y="252" fontSize="26">म</text>
    </g>
    <circle cx="330" cy="70" r="26" fill="#ffd166" />
    <g stroke="#37352f" strokeWidth="3" opacity="0.5" fill="none">
      <circle cx="330" cy="70" r="36" />
    </g>
  </svg>;
}

// Hand-coded hero artwork for the Learning Hub landing — a glowing open book
// with a rising path of knowledge, stars and floating subject glyphs.
// Pure inline SVG: crisp at any size, no external asset, matches navy + amber.
export function HubHeroArt({ className = "" }) {
  return <svg viewBox="0 0 720 620" className={className} role="img" aria-label="Learning Hub illustration: an open book with a rising path of knowledge">
    <defs>
      <linearGradient id="hh-sky" x1="0" y1="0" x2="0.7" y2="1">
        <stop offset="0" stopColor="#001529" />
        <stop offset="0.55" stopColor="#0B3A63" />
        <stop offset="1" stopColor="#001529" />
      </linearGradient>
      <radialGradient id="hh-glow" cx="0.5" cy="0.42" r="0.62">
        <stop offset="0" stopColor="#f2c46a" stopOpacity="0.5" />
        <stop offset="0.55" stopColor="#e0a94a" stopOpacity="0.12" />
        <stop offset="1" stopColor="#e0a94a" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="hh-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFD166" />
        <stop offset="0.5" stopColor="#FF8C1A" />
        <stop offset="1" stopColor="#E85D04" />
      </linearGradient>
      <linearGradient id="hh-pageL" x1="0" y1="0" x2="1" y2="0.4">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#e9e3d2" />
      </linearGradient>
      <linearGradient id="hh-pageR" x1="1" y1="0" x2="0" y2="0.4">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#e9e3d2" />
      </linearGradient>
    </defs>

    <rect width="720" height="620" fill="url(#hh-sky)" />
    <rect width="720" height="620" fill="url(#hh-glow)" />

    <g fill="none" stroke="#FFD166" opacity="0.16">
      <circle cx="360" cy="300" r="250" />
      <circle cx="360" cy="300" r="196" strokeDasharray="3 10" />
    </g>
    <g fill="none" stroke="#ffffff" opacity="0.07">
      <circle cx="640" cy="90" r="120" />
      <circle cx="70" cy="540" r="150" />
    </g>

    <g fill="#FFD166">
      <circle cx="150" cy="120" r="3.2" />
      <circle cx="560" cy="150" r="2.6" />
      <circle cx="620" cy="330" r="2.4" />
      <circle cx="110" cy="330" r="2.6" />
      <circle cx="300" cy="70" r="2.2" />
      <circle cx="470" cy="88" r="2.8" />
      <path d="M600 210 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" opacity="0.9" />
      <path d="M120 210 l3.4 8 8 3.4 -8 3.4 -3.4 8 -3.4 -8 -8 -3.4 8 -3.4z" opacity="0.8" />
    </g>

    <path d="M120 470 C 220 430 250 360 330 330 C 410 300 470 250 600 200" fill="none" stroke="url(#hh-gold)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="1 13" opacity="0.85" />
    <g fill="#FFD166">
      <circle cx="180" cy="452" r="7" />
      <circle cx="300" cy="352" r="7" />
      <circle cx="452" cy="252" r="7" />
    </g>

    <g opacity="0.92">
      <g transform="translate(96 250)">
        <circle r="34" fill="#062A52" stroke="#FFD166" strokeOpacity="0.5" />
        <text y="9" textAnchor="middle" fontFamily="Georgia, serif" fontSize="30" fontWeight="800" fill="#FFD166">क</text>
      </g>
      <g transform="translate(628 250)">
        <circle r="34" fill="#062A52" stroke="#FFD166" strokeOpacity="0.5" />
        <text y="9" textAnchor="middle" fontFamily="Georgia, serif" fontSize="28" fontWeight="800" fill="#FFD166">A</text>
      </g>
      <g transform="translate(560 108)">
        <circle r="30" fill="#062A52" stroke="#FFD166" strokeOpacity="0.45" />
        <g fill="none" stroke="#FFA94D" strokeWidth="2.4">
          <ellipse rx="20" ry="8" />
          <ellipse rx="20" ry="8" transform="rotate(60)" />
          <ellipse rx="20" ry="8" transform="rotate(-60)" />
        </g>
        <circle r="3.4" fill="#FFD166" />
      </g>
      <g transform="translate(150 120)">
        <circle r="28" fill="#062A52" stroke="#FFD166" strokeOpacity="0.45" />
        <path d="M-9 6 a12 12 0 1 1 18 0 q-3 4 -3 9 h-12 q0 -5 -3 -9z" fill="#FFD166" />
        <rect x="-6" y="17" width="12" height="4" rx="2" fill="#FF8C1A" />
      </g>
      <g transform="translate(520 400)">
        <circle r="30" fill="#062A52" stroke="#FFD166" strokeOpacity="0.45" />
        <g transform="rotate(38)">
          <rect x="-6" y="-20" width="12" height="34" rx="3" fill="#FFD166" />
          <polygon points="-6,14 6,14 0,24" fill="#E85D04" />
          <rect x="-6" y="-24" width="12" height="6" rx="2" fill="#E85D04" />
        </g>
      </g>
      <g transform="translate(200 400)">
        <circle r="30" fill="#062A52" stroke="#FFD166" strokeOpacity="0.45" />
        <circle r="16" fill="none" stroke="#FFA94D" strokeWidth="2.2" />
        <ellipse rx="16" ry="7" fill="none" stroke="#FFA94D" strokeWidth="2.2" />
        <path d="M0 -16 V16" stroke="#FFA94D" strokeWidth="2.2" />
      </g>
    </g>

    <g transform="translate(360 150)">
      <path d="M0 6 L-58 -22 L0 -50 L58 -22 Z" fill="url(#hh-gold)" />
      <path d="M0 -50 L58 -22 L0 6 L-58 -22 Z" fill="none" stroke="#E85D04" strokeOpacity="0.4" strokeWidth="1.5" />
      <path d="M30 -16 v26 q0 10 -30 12 q-30 -2 -30 -12 v-26" fill="none" stroke="#FFD166" strokeWidth="3" strokeOpacity="0.85" />
      <path d="M30 -16 q26 6 42 16" fill="none" stroke="#FFD166" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="73" cy="2" r="6" fill="#FFD166" />
      <circle cx="73" cy="2" r="3" fill="#062A52" />
    </g>

    <g transform="translate(360 470)">
      <ellipse cy="60" rx="230" ry="26" fill="#000" opacity="0.28" />
      <path d="M0 -8 V58" stroke="#FFD166" strokeWidth="3" opacity="0.5" />
      <path d="M0 -6 C -60 -34 -150 -34 -210 -12 L -210 46 C -150 24 -60 24 0 52 Z" fill="url(#hh-pageL)" />
      <path d="M0 -6 C 60 -34 150 -34 210 -12 L 210 46 C 150 24 60 24 0 52 Z" fill="url(#hh-pageR)" />
      <g stroke="#b9a978" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round">
        <path d="M-186 -2 H-30" />
        <path d="M-186 12 H-44" />
        <path d="M-186 26 H-70" />
        <path d="M30 -2 H186" />
        <path d="M44 12 H186" />
        <path d="M70 26 H186" />
      </g>
      <g fill="#FF8C1A" opacity="0.55">
        <rect x="-176" y="34" width="96" height="6" rx="3" />
        <rect x="80" y="34" width="96" height="6" rx="3" />
      </g>
      <path d="M0 52 C -60 24 -150 24 -210 46 L -210 54 C -150 32 -60 32 0 60 Z" fill="#E85D04" opacity="0.6" />
      <path d="M0 52 C 60 24 150 24 210 46 L 210 54 C 150 32 60 32 0 60 Z" fill="#E85D04" opacity="0.6" />
    </g>

    <g transform="translate(360 545)">
      <path d="M-14 0 h28 v34 l-14 -10 -14 10z" fill="#FF8C1A" />
      <path d="M-14 0 h28 v10 h-28z" fill="#E85D04" />
    </g>
  </svg>;
}
