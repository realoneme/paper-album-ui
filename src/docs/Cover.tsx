/** The system's face: the home hero's pop-up paper diorama, seen square-on. Static by design. */
const RIDGES: Record<string, string> = {
  far: 'M0 288 C 30 230 70 150 130 138 C 190 126 220 160 270 140 C 320 120 350 100 400 104 C 440 108 460 120 480 116 L480 288 Z',
  mid: 'M20 288 C 50 240 90 190 150 182 C 210 174 240 200 290 182 C 340 164 380 150 430 160 C 455 165 470 170 480 168 L480 288 Z',
  wood: 'M50 288 C 80 250 120 220 180 214 C 240 208 270 232 320 216 C 370 200 410 196 450 206 C 465 210 475 212 480 212 L480 288 Z',
  deep: 'M90 288 C 120 262 160 246 220 244 C 280 242 320 258 370 246 C 410 236 450 238 480 242 L480 288 Z',
  edge: 'M140 288 C 180 274 230 268 290 270 C 350 272 410 264 480 268 L480 288 Z',
};
const FLIES = [[150, 250], [236, 236], [300, 262], [340, 228], [420, 254], [452, 222]];

function Ridge({ id, cast = true }: { id: keyof typeof RIDGES; cast?: boolean }) {
  return (
    <>
      {cast && <path className="cv-cast" transform="translate(0 -3)" d={RIDGES[id]} />}
      <path className={`cv-${id}`} d={RIDGES[id]} />
    </>
  );
}

export function Cover() {
  return (
    <div className="cover">
      <div className="cover-words">
        <h1 className="cover-name">Paper Album<br />UI</h1>
        <p className="cover-tag">Layered paper for photography portfolios, built on shadcn/ui.</p>
      </div>
      <svg className="cover-art" viewBox="0 0 480 288" aria-hidden="true">
        <circle className="cv-glow" cx="384" cy="62" r="62" />
        <circle className="cv-glow" cx="384" cy="62" r="42" />
        <circle className="cv-moon" cx="384" cy="62" r="26" />
        <path className="cv-cloud" d="M118 96 C 108 96 106 84 116 82 C 114 70 132 66 140 76 C 146 60 172 60 176 76 C 186 68 204 72 202 84 C 214 84 220 96 212 96 Z" />
        <Ridge id="far" />
        <Ridge id="mid" />
        <g transform="rotate(-6 222 189)">
          <rect className="cv-print" x="196" y="154" width="52" height="68" />
          <rect className="cv-photo" x="201" y="159" width="42" height="46" />
        </g>
        <g transform="rotate(5 395 190)">
          <rect className="cv-env" x="360" y="168" width="70" height="46" rx="2" />
          <polygon className="cv-flap" points="360,168 430,168 395,194" />
          <circle className="cv-seal" cx="395" cy="192" r="6" />
        </g>
        <Ridge id="wood" />
        <Ridge id="deep" />
        <Ridge id="edge" cast={false} />
        {FLIES.map(([x, y]) => <circle key={`${x}-${y}`} className="cv-fly" cx={x} cy={y} r="2.2" />)}
      </svg>
    </div>
  );
}
