const Tartarus = () => (
  <svg
    className="dark-hour-scene__tartarus"
    viewBox="0 0 420 900"
    preserveAspectRatio="xMidYMax meet"
    focusable="false"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="tartarus-shell" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#07140f" />
        <stop offset="0.46" stopColor="#0b1d17" />
        <stop offset="1" stopColor="#06100d" />
      </linearGradient>
      <linearGradient id="tartarus-edge" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#5bbd83" stopOpacity="0" />
        <stop offset="0.48" stopColor="#78c895" stopOpacity="0.32" />
        <stop offset="1" stopColor="#5bbd83" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="tartarus-window" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#9affc2" stopOpacity="0.34" />
        <stop offset="1" stopColor="#42a86c" stopOpacity="0.12" />
      </linearGradient>
    </defs>

    <path
      d="M30 1200V792h24v-44H39v-51h33v-61H55v-55h39v-75H76v-51h42v-68h-21v-48h44v-74h-19v-48h36v-77h19V92h22V38h28v54h22v43h18v75h37v47h-19v74h45v47h-22v68h42v50h-21v63h38v58h-22v59h42v55h-29v48h43v57h-32v67h35v52h-24v245z"
      fill="url(#tartarus-shell)"
      stroke="#254b38"
      strokeOpacity="0.42"
      strokeWidth="2"
      vectorEffect="non-scaling-stroke"
    />
    <path d="M181 1200V145h19V92h22v53h18v1055z" fill="#0d2119" fillOpacity="0.78" />
    <path d="M62 754h277M75 636h268M96 501h242M115 365h221M139 239h164" fill="none" stroke="#3d7954" strokeOpacity="0.19" strokeWidth="3" />
    <path d="M189 1188V154m45 1034V154M143 1188V275m129 913V275" fill="none" stroke="url(#tartarus-edge)" strokeOpacity="0.3" strokeWidth="3" />

    <g fill="url(#tartarus-window)" opacity="0.48">
      <path d="M104 466h7v19h-7zm27 0h7v19h-7zm-42 85h7v18h-7zm35 0h7v18h-7zm-44 78h7v18h-7zm41 0h7v18h-7zm-28 75h7v18h-7zm51 0h7v18h-7z" />
      <path d="M161 302h7v20h-7zm31-34h7v21h-7zm38 0h7v21h-7zm34 34h7v20h-7zm-59-124h7v21h-7zm39 0h7v21h-7z" />
      <path d="M298 388h7v19h-7zm-32 57h7v19h-7zm48 83h7v19h-7zm-40 0h7v19h-7zm58 78h7v18h-7zm-39 0h7v18h-7zm61 78h7v18h-7zm-43 0h7v18h-7z" />
      <path d="M202 109h6v17h-6zm24 0h6v17h-6zm-14-47h5v17h-5z" />
    </g>

    <path d="M167 222h87m-102 133h118m-136 137h153m-175 134h194m-211 133h231" fill="none" stroke="#142d20" strokeWidth="8" />
    <path d="M202 36h28M191 90h50M172 143h90" fill="none" stroke="#8be8ad" strokeOpacity="0.23" strokeWidth="2" />
  </svg>
);

export default Tartarus;
