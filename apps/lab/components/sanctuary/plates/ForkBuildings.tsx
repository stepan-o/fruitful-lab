import { GATE_ROOF, HALL_ROOF, VILLAGE_RIDGE } from "./fork-geometry";

export function JourneyGate() {
  return <g strokeLinejoin="round" strokeLinecap="round">
    <path d="M187 310L195 229H313L321 310L329 320H179Z" fill="#4c5850" stroke="#a7a382" strokeWidth="1.4" />
    <path d="M195 233L212 237V306L202 320H182Z" fill="#243a3c" />
    <path d="M296 235L313 229L321 310L328 320H299Z" fill="#1e3236" />
    <g stroke="#1b3033" fill="none" strokeWidth="1.6">
      <path d="M191 266H224M187 288H224M182 310H226M283 264H315M283 288H319M283 309H326M208 266L205 286M197 289L193 309M304 265L307 286M298 290L300 307" />
    </g>
    <path d="M227 319V249Q227 239 254 235Q280 239 280 249V319Z" fill="#e8ce95" stroke="#c1af82" strokeWidth="2" />
    <path d="M238 319V250Q238 245 254 243Q269 245 269 250V319" fill="#fae7b3" />
    <path d="M220 318V239H228V318M280 318V238H288V318" fill="#253a39" stroke="#89927b" />
    <path d="M205 229H302V242H205Z" fill="#233936" stroke="#a4a182" />
    <path d="M211 234H297M216 240V249M291 240V249" fill="none" stroke="#c3b78d" />
    <path d={GATE_ROOF} fill="#273e40" stroke="#b2b594" strokeWidth="1.5" />
    <path d="M183 217Q208 222 235 185L253 167L271 186Q299 221 325 217L318 223Q286 229 253 222Q220 229 190 223Z" fill="#61766b" />
    <path d="M253 164V221M225 194L217 219M236 183L228 220M245 174L240 221M264 178L269 220M276 193L281 220M288 207L293 219" stroke="#263e40" strokeWidth="1.2" />
    <path d="M189 219Q220 224 253 217Q288 224 319 219M202 207Q225 209 239 189M267 188Q285 211 306 210" fill="none" stroke="#c4c3a1" strokeWidth=".9" opacity=".65" />
    <path d="M245 161L253 153L262 162M253 154V143" fill="none" stroke="#c6bb8f" strokeWidth="2" />
    <path d="M212 248V261H221V248M288 249V261H298V249" fill="#192d31" stroke="#99a089" />
    <path d="M202 321H307M213 314H221M290 315H304M190 275L198 273M301 297L313 299" stroke="#c1b08a" fill="none" opacity=".5" />
  </g>;
}

export function DistantVillage() {
  return <g strokeLinecap="round" strokeLinejoin="round">
    <path d={`${VILLAGE_RIDGE}V427H539Z`} fill="#23393c" stroke="#6e8475" strokeOpacity=".5" />
    <path d="M575 225Q596 231 618 225M580 248H614M579 265H615M590 234V242M602 234V242M847 205Q870 211 895 205M852 230H888M852 252H888M861 216V226M875 216V226" stroke="#789283" opacity=".5" fill="none" />
    <path d="M588 217L596 207L606 218M862 198L870 190L879 199" fill="none" stroke="#a5ad8e" opacity=".6" />
  </g>;
}

export function TownHall() {
  return <g strokeLinecap="round" strokeLinejoin="round">
    <path d="M694 350V289H811V350L817 358H688Z" fill="#788575" stroke="#a4b293" strokeWidth="1.4" />
    <path d="M791 290H811V350L817 358H791Z" fill="#324b48" />
    <path d="M694 326H811M694 345H811M704 293V349M725 293V349M778 293V350M796 293V351" stroke="#263e3d" strokeWidth="3" />
    <path d="M731 355V303L752 289L775 303V355Z" fill="#b19461" stroke="#debf87" />
    <path d="M741 355V305L752 298L766 305V355Z" fill="#edcf95" />
    <path d="M704 300H722V320H704ZM781 300H797V320H781Z" fill="#293d3b" stroke="#d0bc86" />
    <path d="M710 300V320M717 300V320M787 300V320M792 300V320M704 310H722M781 310H797" stroke="#adad84" strokeWidth=".8" />
    <path d={HALL_ROOF} fill="#213a3e" stroke="#a8b59a" strokeWidth="1.5" />
    <path d="M690 281Q716 284 739 248L752 232L767 249Q790 284 813 281L811 285Q781 288 752 282Q722 288 693 285Z" fill="#647d70" />
    <path d="M752 229V283M734 254L727 283M742 242L739 283M762 243L767 283M773 257L780 284M716 274L713 284M791 275L793 285" stroke="#29474a" strokeWidth="1.4" />
    <path d="M698 282Q724 284 752 278Q779 284 806 282" stroke="#c2c6a3" fill="none" />
    <path d="M741 231L752 219L763 231M689 353H815M700 358V363M803 358V363" stroke="#b0ac82" fill="none" />
    <path d="M732 332H739M768 332H775M700 340H720M783 340H802" stroke="#adc0a2" opacity=".55" />
  </g>;
}

export function House({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} strokeLinecap="round" strokeLinejoin="round">
    <path d="M-20 0V-43H18V0Z" fill="#66776a" stroke="#a4b294" strokeWidth="1.3" />
    <path d="M9 -42L21 -46V-1L9 3Z" fill="#304c49" />
    <path d="M-24 -46Q-11 -47 0 -68Q12 -48 27 -46L23 -39Q0 -34 -26 -40Z" fill="#2a4244" stroke="#a4b294" strokeWidth="1.4" />
    <path d="M-20 -44Q-6 -47 0 -61Q8 -47 22 -44L18 -41Q0 -38 -19 -41Z" fill="#829280" />
    <path d="M-12 -42L-7 -48M0 -59V-41M9 -49L15 -42M-15 -38V-3M13 -36V-3M-20 -7H20" stroke="#1e3739" strokeWidth="1.7" fill="none" />
    <path d="M-5 -35H5V-18H-5Z" fill="#ecc68a" stroke="#c3b991" />
    <path d="M0 -35V-18M-5 -27H5" stroke="#7b7857" strokeWidth=".8" />
    <path d="M-23 1H23M-18 -12H-8M8 -12H18" stroke="#97a78c" />
  </g>;
}
