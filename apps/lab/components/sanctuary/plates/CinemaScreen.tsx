import styles from "./audience-economy.module.css";

export default function CinemaScreen({ id }: { id: string }) {
  const paint = (name: string) => `url(#${id}-${name})`;
  return <g clipPath={paint("screen-clip")}>
    <g transform="translate(216 128)">
      <circle cx="324" cy="61" r="94" fill={paint("light")}/>
      <circle cx="324" cy="61" r="28" fill="#dbc796"/>
      <g className={styles.screenCloud} fill="#aab39a" opacity=".36">
        <path d="M5 52q8-8 20-4 9-14 23-7 13-5 22 6 20-4 22 7H5Zm188-26q12-14 26-8 17-13 30 1 16-6 26 9h-82Z"/>
        <path d="M339 77q12-10 24-4 16-19 38-8 15-2 27 13h-89Z"/>
      </g>
      <path d="M0 109 32 93 63 105 91 84 119 108 156 94 191 109 239 91 270 106 300 85 335 108 383 92 412 106 468 77v157H0Z" fill="#536e69"/>
      <path d="M0 133q103-6 223 3t245-6v104H0Z" fill="#284d50"/>
      <path d="M0 140q76-8 144 1t163 1 161-8M0 158q106-10 205 2t263-8M0 183q112-9 216 1t252-6" fill="none" stroke="#879986" strokeOpacity=".34"/>
      <g className={styles.waterLight} stroke="#d1bd8a" strokeOpacity=".5" fill="none">
        <path d="M304 128h44m-60 8h77m-87 8h70m-48 8h91m-124 9h78m-68 10h129m-154 12h116m-95 13h155m-177 15h72"/>
      </g>
      <path d="m302 142 12-44 28-23 27 22 12 39 39 37 48 12v49H253l22-45Z" fill="#1c373d" stroke="#769182"/>
      <path d="m314 98 17-7 5 33-14 14 11 23-29 24-9 41h-24l12-45 28-31-4-23Z" fill="#5c7264"/>
      <path d="m343 96 8 17-5 17 24 24 7 30 27 17 14 33h-30l-10-36-19-11-9-37-15-19Z" fill="#3b5753"/>
      <path d="m317 106 7 21-11 14 12 22-32 25-9 36m71-88 19 23 12 31 24 16" fill="none" stroke="#a1a582" strokeOpacity=".5"/>
      <path d="m332 89 3-53h16l4 53Z" fill="#c5ba90" stroke="#293b3b"/><path d="m342 37 1 52h11l-3-52Z" fill="#7d8b78"/>
      <path d="M332 30h23v9h-23z" fill="#293d3e" stroke="#bfb386"/><path d="m330 30 14-12 14 12Z" fill="#21363b" stroke="#929879"/>
      <path d="M338 29h12v9h-12Z" fill="#f2dba4"/><path d="M342 29v9m4-9v9" stroke="#52665c"/>
      <path d="M337 69h5v9h-5m5-26h4v7h-4" fill="#243f44"/>
      <path d="m344 18 1-8m-19 79h34" stroke="#d1c08d"/>
      <g className={styles.projectedBoat}>
        <path d="m77 179 63 1-12 13-38-1Z" fill="#111f28" stroke="#a2ae95" strokeWidth=".8"/>
        <path d="M106 128v53m2-47 28 39h-27Z" fill="#c4c09e" stroke="#b5b793"/>
        <path d="m102 144-19 28h19Z" fill="#7b9588"/>
        <path d="M75 198h72m-62 5h48" stroke="#a4b29c" strokeOpacity=".4"/>
      </g>
      <path d="m176 69 5-2 5 2m17-8 4-2 5 2m-35 17 3-1 4 1" stroke="#1c363b" fill="none"/>
      <path d="M0 216 18 204 41 210 60 228 85 220 106 234H0Zm406 18 25-20 13 6 24-15v29Z" fill="#152a31"/>
    </g>
  </g>;
}
