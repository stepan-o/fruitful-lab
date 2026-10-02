import { fireEvent, render, screen } from "@testing-library/react";
import Reader from "@/components/sanctuary/Reader";
import { PriceLab, ProbabilityLab } from "@/components/sanctuary/Experiments";
import { appendix, chapters, parts, sources } from "@/lib/sanctuary/content";
import { chapterHref, successProbability } from "@/lib/sanctuary/types";
import { parseManifest } from "@/lib/assets/types";
import rawManifest from "@/lib/assets/generated/sanctuary.json";
import { readerCopy } from "@/lib/sanctuary/ui";
import { locales } from "@/app/(stepanoskin)/stepanoskin/translations";
import landingManifest from "@/lib/assets/generated/stepanoskin.json";
import { assetUrl } from "@/lib/assets/types";

const play = jest.fn().mockResolvedValue(undefined);
const audio = {play,volume:0,currentTime:0};
const AudioMock = jest.fn(()=>audio);
Object.defineProperty(window,"Audio",{writable:true,value:AudioMock});
beforeEach(()=>{window.localStorage.clear();play.mockClear();});

const refresh = jest.fn();
Object.defineProperty(window,"matchMedia",{writable:true,value:jest.fn().mockImplementation(()=>({matches:false,addEventListener:jest.fn(),removeEventListener:jest.fn()}))});
jest.spyOn(HTMLCanvasElement.prototype,"getContext").mockReturnValue(null);
jest.mock("next/navigation",()=>({useRouter:()=>({refresh})}));
const manifest = parseManifest(rawManifest,"sanctuary");
const navigation = chapters.map(({id,title,part})=>({id,title,part}));
const props = {locale:"en" as const,current:null,index:-1,navigation,parts,assets:manifest,sources:[],rules:appendix};

beforeAll(()=>{
  HTMLDialogElement.prototype.showModal = function(){this.setAttribute("open","");};
  HTMLDialogElement.prototype.close = function(){this.removeAttribute("open");this.dispatchEvent(new Event("close"));};
});

describe("Sanctuary reader",()=>{
  it("has a complete navigable 21-chapter edition with resolvable evidence and media",()=>{
    expect(chapters).toHaveLength(21);
    expect(new Set(chapters.map(c=>c.id)).size).toBe(21);
    expect(new Set(chapters.map(c=>c.part)).size).toBe(7);
    for(const chapter of chapters){
      expect(chapter.paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(chapter.evidence.length).toBeGreaterThan(30);
      expect(chapter.visual.diagram.nodes).toHaveLength(4);
      expect(chapter.visual.sceneTitle.length).toBeGreaterThan(3);
      expect(chapter.figures?.[0].asset).toBe(chapter.visual.screenshot.asset);
      for(const id of chapter.sources) expect(sources.some(s=>s.id===id)).toBe(true);
      for(const figure of chapter.figures??[]) expect(manifest.assets[figure.asset]?.kind).toBe("image");
    }
    expect(appendix).toHaveLength(10);
    for(const locale of locales) expect(Object.values(readerCopy[locale]).every(Boolean)).toBe(true);
  });
  it("shows real content, an honest language label and an entry into the study",()=>{
    render(<Reader {...props}/>);
    expect(screen.getByRole("heading",{level:1,name:/Sanctuary.*Economics/})).toBeVisible();
    expect(screen.getByRole("link",{name:/Enter the study/})).toHaveAttribute("href",chapterHref("the-fork"));
    expect(screen.queryByText("Module loading")).not.toBeInTheDocument();
    expect(screen.getAllByText("English editorial edition").length).toBeGreaterThan(0);
  });
  it("uses original art by default and offers no public research switch",()=>{
    const {container}=render(<Reader {...props} current={chapters[0]} index={0}/>);
    expect(screen.getByRole("figure",{name:/Diagram:/})).toBeVisible();
    expect(screen.getByText("Original procedural scene · illustrative, not a game capture")).toBeVisible();
    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(container.querySelector("main")).toHaveAttribute("data-media-mode","original");
    expect(screen.queryByText(/INTERNAL REFERENCE/)).not.toBeInTheDocument();
  });
  it("opens and closes contents and persists the navigation language",()=>{
    render(<Reader {...props}/>);
    fireEvent.click(screen.getByRole("button",{name:/Contents/}));
    expect(screen.getByRole("dialog",{name:"Contents"})).toBeVisible();
    fireEvent.click(screen.getByRole("button",{name:"Close ×"}));
    expect(screen.queryByRole("dialog",{name:"Contents"})).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox",{name:"English"}),{target:{value:"ru"}});
    expect(document.cookie).toContain("stepanoskin_locale_v1=ru");
    expect(refresh).toHaveBeenCalled();
  });
  it("plays the exact landing clang on chapter activation, with silent hover and persistent mute",()=>{
    render(<Reader {...props}/>);
    const link=screen.getByRole("link",{name:/Enter the study/});
    fireEvent.mouseOver(link);
    fireEvent.focus(link);
    expect(play).not.toHaveBeenCalled();
    fireEvent.click(link,{ctrlKey:true});
    expect(play).not.toHaveBeenCalled();
    fireEvent.click(link);
    expect(play).toHaveBeenCalledTimes(1);
    expect(AudioMock).toHaveBeenCalledWith(assetUrl(parseManifest(landingManifest,"stepanoskin"),"click"));
    fireEvent.click(screen.getByRole("button",{name:"Sound on"}));
    expect(window.localStorage.getItem("stepanoskin_sound_v1")).toBe("off");
    fireEvent.click(link);
    expect(play).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button",{name:"Motion on"}));
    expect(window.localStorage.getItem("stepanoskin_motion_v1")).toBe("off");
    expect(document.querySelector("main")).toHaveAttribute("data-motion","off");
  });
  it("keeps source notes and chapter links available and mounts zoom on request",()=>{
    const current=chapters[2];
    render(<Reader {...props} current={current} index={2} research sources={sources.filter(s=>current.sources.includes(s.id))}/>);
    expect(screen.getByRole("heading",{level:1,name:"Where progress lives"})).toBeVisible();
    expect(screen.getByRole("navigation",{name:"Chapter"}).querySelector('a:last-child')).toHaveAttribute("href",chapterHref(chapters[3].id));
    expect(screen.queryByRole("dialog",{name:"Enlarge image"})).not.toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button",{name:/Enlarge image:/})[0]);
    expect(screen.getByRole("dialog",{name:"Enlarge image"})).toBeVisible();
  });
  it("calculates independent fixed-chance attempts, including endpoints",()=>{
    expect(successProbability(0,20)).toBe(0);
    expect(successProbability(100,20)).toBe(1);
    expect(successProbability(5,20)).toBeCloseTo(0.641514,5);
    render(<ProbabilityLab/>);
    expect(screen.getByText("64.2%")).toBeVisible();
    fireEvent.change(screen.getByRole("slider",{name:/Number of attempts/}),{target:{value:"1"}});
    expect(screen.getByText("5.0%")).toBeVisible();
  });
  it("keeps CAD cash and virtual-currency shortfall separate",()=>{
    render(<PriceLab/>);
    expect(screen.getByText("400 PT")).toBeVisible();
    fireEvent.change(screen.getByRole("combobox",{name:"One pack purchase"}),{target:{value:"0"}});
    expect(screen.getByText("1,900 PT")).toBeVisible();
    expect(screen.getByText("Still needed for item")).toBeVisible();
    expect(screen.getAllByText("CAD 6.99")).toHaveLength(2);
  });
});
