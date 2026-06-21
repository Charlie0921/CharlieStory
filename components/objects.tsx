/* Flat SVG illustrations for the mini-room. No external assets. */
import * as React from "react";

type P = React.SVGProps<SVGSVGElement>;

export function AvatarArt(props: P) {
  return (
    <svg viewBox="0 0 120 180" width="100%" height="100%" {...props}>
      <ellipse cx="60" cy="170" rx="38" ry="8" fill="#26262B" opacity="0.12" />
      <rect x="44" y="120" width="13" height="44" rx="6" fill="#3A3A42" />
      <rect x="63" y="120" width="13" height="44" rx="6" fill="#3A3A42" />
      <rect x="42" y="158" width="18" height="9" rx="4" fill="#26262B" />
      <rect x="60" y="158" width="18" height="9" rx="4" fill="#26262B" />
      <path d="M36 78c0-13 11-22 24-22s24 9 24 22v40c0 6-5 10-11 10H47c-6 0-11-4-11-10z" fill="#E8736A" />
      <rect x="30" y="80" width="12" height="38" rx="6" fill="#E8736A" />
      <rect x="78" y="80" width="12" height="38" rx="6" fill="#E8736A" />
      <circle cx="34" cy="120" r="6" fill="#F2D6C2" />
      <circle cx="86" cy="120" r="6" fill="#F2D6C2" />
      <rect x="50" y="92" width="20" height="14" rx="3" fill="#FBFAF6" />
      <circle cx="60" cy="99" r="3" fill="#E8736A" />
      <circle cx="60" cy="42" r="22" fill="#F2D6C2" />
      <path d="M38 40c0-14 10-24 22-24s22 10 22 24c0 4-2 7-2 7-2-9-9-13-20-13s-18 4-20 13c0 0-2-3-2-7z" fill="#2E2A35" />
      <circle cx="52" cy="44" r="2.4" fill="#2E2A35" />
      <circle cx="68" cy="44" r="2.4" fill="#2E2A35" />
      <path d="M54 52c2 2.5 10 2.5 12 0" stroke="#C8554C" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="48" cy="50" r="3" fill="#F2B8C6" opacity="0.6" />
      <circle cx="72" cy="50" r="3" fill="#F2B8C6" opacity="0.6" />
    </svg>
  );
}

export function DeskArt(props: P) {
  return (
    <svg viewBox="0 0 220 170" width="100%" height="100%" {...props}>
      <ellipse cx="110" cy="160" rx="100" ry="9" fill="#26262B" opacity="0.1" />
      <rect x="26" y="44" width="120" height="70" rx="8" fill="#3A3A42" />
      <rect x="32" y="50" width="108" height="58" rx="4" fill="#DCE9F2" />
      <rect x="40" y="58" width="40" height="9" rx="2" fill="#E8736A" />
      <rect x="40" y="72" width="64" height="6" rx="2" fill="#AFCBE3" />
      <rect x="40" y="82" width="52" height="6" rx="2" fill="#B6A8E0" />
      <rect x="40" y="92" width="70" height="6" rx="2" fill="#C7CBD1" />
      <rect x="78" y="114" width="16" height="12" fill="#3A3A42" />
      <rect x="60" y="126" width="52" height="6" rx="3" fill="#3A3A42" />
      <rect x="14" y="120" width="192" height="14" rx="5" fill="#CDB39A" />
      <rect x="20" y="134" width="10" height="30" rx="3" fill="#B89878" />
      <rect x="190" y="134" width="10" height="30" rx="3" fill="#B89878" />
      <rect x="150" y="96" width="58" height="26" rx="4" fill="#FBFAF6" stroke="#DEDBD2" />
      <rect x="156" y="102" width="46" height="4" rx="2" fill="#DEDBD2" />
      <rect x="156" y="110" width="34" height="4" rx="2" fill="#DEDBD2" />
    </svg>
  );
}

export function CabinetArt(props: P) {
  return (
    <svg viewBox="0 0 110 170" width="100%" height="100%" {...props}>
      <ellipse cx="55" cy="163" rx="44" ry="7" fill="#26262B" opacity="0.1" />
      <rect x="14" y="14" width="82" height="148" rx="8" fill="#ECEAE3" stroke="#DEDBD2" />
      <rect x="20" y="22" width="70" height="40" rx="5" fill="#FBFAF6" stroke="#DEDBD2" />
      <rect x="20" y="66" width="70" height="40" rx="5" fill="#FBFAF6" stroke="#DEDBD2" />
      <rect x="20" y="110" width="70" height="44" rx="5" fill="#FBFAF6" stroke="#DEDBD2" />
      <rect x="40" y="38" width="30" height="6" rx="3" fill="#E8736A" />
      <rect x="40" y="82" width="30" height="6" rx="3" fill="#B6A8E0" />
      <rect x="40" y="128" width="30" height="6" rx="3" fill="#5E89AD" />
      <rect x="30" y="2" width="22" height="14" rx="2" fill="#F7EEC4" transform="rotate(-6 41 9)" />
      <rect x="52" y="2" width="22" height="14" rx="2" fill="#FBFAF6" transform="rotate(5 63 9)" stroke="#DEDBD2" />
    </svg>
  );
}

export function FrameArt(props: P) {
  return (
    <svg viewBox="0 0 140 110" width="100%" height="100%" {...props}>
      <rect x="6" y="6" width="128" height="98" rx="6" fill="#C7CBD1" />
      <rect x="12" y="12" width="116" height="86" rx="3" fill="#FBFAF6" />
      <rect x="22" y="22" width="96" height="14" rx="3" fill="#8E7BC4" />
      <rect x="22" y="44" width="60" height="6" rx="3" fill="#DEDBD2" />
      <rect x="22" y="56" width="84" height="6" rx="3" fill="#DEDBD2" />
      <rect x="22" y="68" width="72" height="6" rx="3" fill="#DEDBD2" />
      <rect x="22" y="80" width="50" height="6" rx="3" fill="#DEDBD2" />
      <circle cx="104" cy="80" r="11" fill="none" stroke="#E8736A" strokeWidth="2" />
      <path d="M99 80l4 4 7-8" stroke="#E8736A" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MailboxArt(props: P) {
  return (
    <svg viewBox="0 0 130 110" width="100%" height="100%" {...props}>
      <ellipse cx="65" cy="101" rx="42" ry="5" fill="#26262B" opacity="0.1" />

      {/* Cream shell with a gently arched top, like a small room prop. */}
      <path
        d="M22 49c0-20 16-36 36-36h22c16 0 28 13 28 28v49H22z"
        fill="#ECEAE3"
        stroke="#DEDBD2"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M80 13c16 0 28 13 28 28v8H80z" fill="#D7DDCF" opacity="0.7" />

      {/* Recessed sage front door. */}
      <path
        d="M29 50h72v35a6 6 0 0 1-6 6H35a6 6 0 0 1-6-6z"
        fill="#E4EBDD"
        stroke="#AEB5A7"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect x="43" y="58" width="44" height="5" rx="2.5" fill="#7F9477" />
      <path d="M52 76h26" stroke="#AEB5A7" strokeWidth="3" strokeLinecap="round" />

      {/* A single dusty accent reads as a mailbox flag, not a UI control. */}
      <path d="M96 47V26" stroke="#C96D60" strokeWidth="4" strokeLinecap="round" />
      <path d="M96 26h13a3 3 0 0 1 3 3v8H96z" fill="#E8736A" />
      <circle cx="96" cy="48" r="4" fill="#C96D60" />

      {/* Short feet ground the object in the room. */}
      <rect x="34" y="89" width="8" height="9" rx="3" fill="#AEB5A7" />
      <rect x="88" y="89" width="8" height="9" rx="3" fill="#AEB5A7" />
    </svg>
  );
}

export function CdPlayerArt(props: P) {
  return (
    <svg viewBox="0 0 150 110" width="100%" height="100%" {...props}>
      <ellipse cx="75" cy="103" rx="64" ry="6" fill="#26262B" opacity="0.1" />
      <rect x="10" y="18" width="130" height="76" rx="12" fill="#FBFAF6" stroke="#DEDBD2" />
      <circle cx="44" cy="56" r="26" fill="#3A3A42" />
      <circle cx="44" cy="56" r="22" fill="#AFCBE3" />
      <circle cx="44" cy="56" r="14" fill="#B6A8E0" />
      <circle cx="44" cy="56" r="5" fill="#FBFAF6" />
      <circle cx="112" cy="40" r="11" fill="#ECEAE3" stroke="#DEDBD2" />
      <path d="M109 35l8 5-8 5z" fill="#E8736A" />
      <rect x="98" y="62" width="32" height="6" rx="3" fill="#DEDBD2" />
      <rect x="98" y="72" width="22" height="6" rx="3" fill="#DEDBD2" />
      <rect x="98" y="26" width="6" height="6" rx="2" fill="#E8736A" />
    </svg>
  );
}

export function PlantArt(props: P) {
  return (
    <svg viewBox="0 0 90 130" width="100%" height="100%" {...props}>
      <ellipse cx="45" cy="124" rx="26" ry="5" fill="#26262B" opacity="0.1" />
      <path d="M45 80c0-26 6-46 6-46M45 80c0-22-12-40-12-40M45 80c0-22 14-38 14-38" stroke="#7BA67A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M51 36c8-6 16-4 16-4s-2 10-10 12-12-2-12-2 6-2 6-6z" fill="#9CC79A" />
      <path d="M33 40c-8-6-16-2-16-2s3 10 11 11 11-3 11-3-4-3-6-6z" fill="#7BA67A" />
      <path d="M45 30c0-9 4-16 4-16s5 8 3 16-7 9-7 9 0-6 0-9z" fill="#9CC79A" />
      <path d="M30 84h30l-4 34a4 4 0 0 1-4 4H38a4 4 0 0 1-4-4z" fill="#E8736A" />
      <rect x="28" y="80" width="34" height="8" rx="3" fill="#C8554C" />
    </svg>
  );
}

export function WindowArt(props: P) {
  return (
    <svg viewBox="0 0 160 130" width="100%" height="100%" {...props}>
      <rect x="6" y="6" width="148" height="118" rx="8" fill="#C7CBD1" />
      <rect x="14" y="14" width="132" height="102" rx="4" fill="#DCE9F2" />
      <rect x="14" y="14" width="132" height="102" rx="4" fill="url(#sky)" />
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBFAF6" />
          <stop offset="1" stopColor="#DCE9F2" />
        </linearGradient>
      </defs>
      <circle cx="116" cy="44" r="16" fill="#F7EEC4" />
      <rect x="78" y="14" width="4" height="102" fill="#C7CBD1" />
      <rect x="14" y="62" width="132" height="4" fill="#C7CBD1" />
    </svg>
  );
}
