const StreetLamp = ({ x, top, direction = 1, tone = 'warm' }) => (
  <g className={`dark-hour-scene__street-lamp dark-hour-scene__street-lamp--${tone}`} transform={`translate(${x} 0) scale(${direction} 1)`}>
    <path className="dark-hour-scene__street-metal" d={`M 0 184 V ${top + 17} M 0 ${top + 17} Q -5 ${top + 8} -18 ${top + 3} L -43 ${top - 3} M 0 ${top + 17} Q 5 ${top + 8} 18 ${top + 3} L 43 ${top - 3}`} />
    <path className="dark-hour-scene__lamp-shade" d={`M -46 ${top - 4} L -30 ${top - 8} L -29 ${top - 5} L -45 ${top - 1} Z M 46 ${top - 4} L 30 ${top - 8} L 29 ${top - 5} L 45 ${top - 1} Z`} />
  </g>
);

const CityStreet = () => (
  <svg
    className="dark-hour-scene__street"
    viewBox="0 0 1600 220"
    preserveAspectRatio="none"
    focusable="false"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="street-road" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#091522" stopOpacity="0.18" />
        <stop offset="0.22" stopColor="#050d17" stopOpacity="0.72" />
        <stop offset="1" stopColor="#030811" stopOpacity="0.94" />
      </linearGradient>
      <linearGradient id="street-headlight" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#bcecff" stopOpacity="0.28" />
        <stop offset="0.45" stopColor="#8bc9e9" stopOpacity="0.12" />
        <stop offset="1" stopColor="#8bc9e9" stopOpacity="0" />
      </linearGradient>
    </defs>

    <rect className="dark-hour-scene__street-road" x="0" y="163" width="1600" height="57" />
    <path className="dark-hour-scene__street-curb" d="M 0 164 H 1600" />
    <path className="dark-hour-scene__street-mark" d="M 85 197 H 182 M 340 197 H 432 M 1150 197 H 1240 M 1410 197 H 1500" />

    <StreetLamp x={132} top={53} direction={-1} tone="warm" />
    <StreetLamp x={470} top={68} direction={-1} tone="cool" />
    <StreetLamp x={812} top={78} direction={-1} tone="cool" />
    <StreetLamp x={1100} top={64} direction={-1} tone="warm" />
    <StreetLamp x={1434} top={59} direction={-1} tone="warm" />

    <g className="dark-hour-scene__street-car dark-hour-scene__street-car--truck">
      <g transform="translate(0 174) scale(0.62 1.35) translate(0 -174)">
        <path className="dark-hour-scene__headlight-beam" d="M 180 160 L 310 151 L 310 184 L 180 168 Z" />
        <path className="dark-hour-scene__car-body dark-hour-scene__car-body--truck" d="M 4 164 L 8 157 L 17 155 V 128 Q 17 125 21 125 H 116 L 138 132 H 153 Q 160 132 165 142 L 171 154 L 179 157 Q 183 159 183 164 V 169 H 164 C 162 158 147 158 144 169 H 48 C 45 158 31 158 28 169 H 4 Z" />
        <path className="dark-hour-scene__car-window" d="M 120 148 V 136 H 151 Q 157 136 161 148 Z" />
        <path className="dark-hour-scene__car-trim" d="M 18 151 H 116 M 116 127 V 153 M 119 151 H 169 M 162 151 V 159 M 26 132 V 149 M 109 132 V 149" />
        <path className="dark-hour-scene__car-grille" d="M 178 158 V 165 M 181 158 V 165" />
        <circle className="dark-hour-scene__car-wheel" cx="38" cy="173" r="7" />
        <circle className="dark-hour-scene__car-wheel" cx="154" cy="173" r="7" />
        <circle className="dark-hour-scene__car-rim" cx="38" cy="173" r="3" />
        <circle className="dark-hour-scene__car-rim" cx="154" cy="173" r="3" />
        <path className="dark-hour-scene__car-taillight" d="M 6 156 L 12 157 V 163 L 6 164 Z" />
        <path className="dark-hour-scene__car-headlight" d="M 180 157 L 184 158 V 161 L 180 161 Z M 180 165 L 184 166 V 169 L 180 169 Z" />
      </g>
    </g>

    <g className="dark-hour-scene__street-car dark-hour-scene__street-car--citycar">
      <g transform="translate(1600 174) scale(-0.72 1.4) translate(0 -174)">
        <path className="dark-hour-scene__headlight-beam" d="M 101 160 L 222 151 L 222 182 L 101 168 Z" />
        <path className="dark-hour-scene__car-body dark-hour-scene__car-body--citycar" d="M 4 164 L 7 155 Q 9 151 18 150 L 22 136 Q 24 130 31 129 H 65 Q 75 130 82 143 L 89 151 L 99 154 Q 104 156 105 162 V 168 H 90 C 88 158 75 158 72 168 H 35 C 32 158 18 158 15 168 H 4 Z" />
        <path className="dark-hour-scene__car-window" d="M 27 146 L 30 135 Q 31 133 35 133 H 47 V 147 Z M 52 133 H 64 Q 72 134 78 147 H 52 Z" />
        <path className="dark-hour-scene__car-trim" d="M 6 163 H 101 M 22 150 H 85 M 49 131 V 149 M 37 152 V 160 M 70 152 V 160 M 90 153 L 99 156" />
        <path className="dark-hour-scene__car-grille" d="M 100 158 V 164 M 103 158 V 164" />
        <circle className="dark-hour-scene__car-wheel" cx="24" cy="173" r="6.5" />
        <circle className="dark-hour-scene__car-wheel" cx="82" cy="173" r="6.5" />
        <circle className="dark-hour-scene__car-rim" cx="24" cy="173" r="2.8" />
        <circle className="dark-hour-scene__car-rim" cx="82" cy="173" r="2.8" />
        <path className="dark-hour-scene__car-taillight" d="M 5 157 L 10 158 V 162 L 5 163 Z" />
        <path className="dark-hour-scene__car-headlight" d="M 102 157 L 106 158 V 161 L 102 161 Z M 102 165 L 106 166 V 169 L 102 169 Z" />
      </g>
    </g>

    <g className="dark-hour-scene__street-car dark-hour-scene__street-car--van">
      <g transform="translate(0 174) scale(0.72 1.4) translate(0 -174)">
        <path className="dark-hour-scene__headlight-beam" d="M 139 160 L 292 150 L 292 184 L 139 169 Z" />
        <path className="dark-hour-scene__car-body dark-hour-scene__car-body--van" d="M 4 164 L 7 153 Q 9 149 18 148 L 21 133 Q 22 128 29 128 H 92 Q 101 128 106 142 L 111 151 L 132 155 Q 138 157 139 163 V 169 H 119 C 117 158 101 158 98 169 H 43 C 40 158 24 158 21 169 H 4 Z" />
        <path className="dark-hour-scene__car-window" d="M 27 146 L 30 133 Q 31 132 35 132 H 48 V 147 Z M 53 132 H 74 V 147 H 53 Z M 79 132 H 91 Q 97 132 102 147 H 79 Z" />
        <path className="dark-hour-scene__car-trim" d="M 6 163 H 135 M 23 150 H 108 M 50 130 V 149 M 76 130 V 149 M 106 151 L 130 156" />
        <path className="dark-hour-scene__car-grille" d="M 134 158 V 165 M 137 158 V 165" />
        <circle className="dark-hour-scene__car-wheel" cx="31" cy="173" r="7" />
        <circle className="dark-hour-scene__car-wheel" cx="108" cy="173" r="7" />
        <circle className="dark-hour-scene__car-rim" cx="31" cy="173" r="3" />
        <circle className="dark-hour-scene__car-rim" cx="108" cy="173" r="3" />
        <path className="dark-hour-scene__car-taillight" d="M 6 156 L 11 157 V 162 L 6 163 Z" />
        <path className="dark-hour-scene__car-headlight" d="M 136 157 L 140 158 V 161 L 136 161 Z M 136 165 L 140 166 V 169 L 136 169 Z" />
      </g>
    </g>
  </svg>
);

export default CityStreet;
