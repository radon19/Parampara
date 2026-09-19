// Compact Parampara mark — same geometry and fills as public/diagram.svg:
// pine folio, unbroken ink thread, gold grain lines, ember seal diamond.
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Parampara logo">
      <path
        d="M24 3 C24 1 21 1 21 3.5 C21 5.5 24 5.5 24 8"
        fill="none"
        stroke="#f3e6d4"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <rect x="13" y="8" width="22" height="32" rx="11" fill="#1b3a2f" />
      <path
        d="M18.5 13 C21 19 20.5 29 19.5 36"
        fill="none"
        stroke="#c4a36a"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M29.5 13.5 C27 19.5 27.2 29.5 28.5 36"
        fill="none"
        stroke="#c4a36a"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M24 8 L24 40" stroke="#6e675f" strokeWidth="2" strokeLinecap="round" />
      <rect
        x="21.2"
        y="33.2"
        width="5.6"
        height="5.6"
        fill="#c46a1b"
        transform="rotate(45 24 36)"
      />
    </svg>
  )
}
