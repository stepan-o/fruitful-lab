import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import ReadabilityStudio from './ReadabilityStudio';
import {READABILITY_DEFAULT} from '@/lib/loopforge/readability/settings';
const mockUpdate=jest.fn(),mockDispose=jest.fn();
const mockCreate=jest.fn(async()=>({update:mockUpdate,dispose:mockDispose,evidence:()=>({}),capture:async()=>'data:image/png;base64,AA=='}));
jest.mock('./readability-scene',()=>({createReadabilityScene:()=>mockCreate()}));
beforeEach(()=>{localStorage.clear();jest.clearAllMocks();});
test('A/B and sliders reuse one scene, preserve chosen treatment and dispose on exit',async()=>{
 const view=render(<ReadabilityStudio/>);
 await waitFor(()=>expect(screen.getByRole('button',{name:'Original'})).toBeEnabled());
 fireEvent.change(screen.getByRole('slider',{name:'LIMEN height / worker'}),{target:{value:'1.35'}});
 fireEvent.click(screen.getByRole('button',{name:'Original'}));
 expect(mockUpdate).toHaveBeenLastCalledWith(expect.objectContaining({original:true,limenHeight:1.35}));
 fireEvent.click(screen.getByRole('button',{name:'Your treatment'}));
 fireEvent.click(screen.getByRole('button',{name:'Console · 320px'}));
 expect(mockUpdate).toHaveBeenLastCalledWith(expect.objectContaining({original:false,limenHeight:1.35,size:'console'}));
 expect(mockCreate).toHaveBeenCalledTimes(1);view.unmount();expect(mockDispose).toHaveBeenCalledTimes(1);
});
test('saved settings survive hydration and pinned reference is a still image',async()=>{
 localStorage.setItem('loopforge-readability-v1',JSON.stringify({...READABILITY_DEFAULT,limenHeight:1.42}));
 render(<ReadabilityStudio/>);
 await waitFor(()=>expect(screen.getByRole('button',{name:'Pin reference shot'})).toBeEnabled());
 expect(mockUpdate).toHaveBeenLastCalledWith(expect.objectContaining({limenHeight:1.42}));
 fireEvent.click(screen.getByRole('button',{name:'Pin reference shot'}));
 expect(await screen.findByRole('img',{name:/pinned reference/})).toHaveAttribute('src','data:image/png;base64,AA==');
 expect(mockCreate).toHaveBeenCalledTimes(1);
});

test('CATHEXIS controls preserve the selected face through A/B and do not recreate the scene',async()=>{
 localStorage.setItem('loopforge-readability-v1',JSON.stringify({version:1,limenHeight:1.5,stilettoPaint:91}));
 const view=render(<ReadabilityStudio/>);
 await waitFor(()=>expect(screen.getByRole('button',{name:'Original'})).toBeEnabled());
 fireEvent.change(screen.getByLabelText('CATHEXIS ivory'),{target:{value:'#c8bc98'}});
 fireEvent.change(screen.getByRole('slider',{name:'CATHEXIS paint strength'}),{target:{value:'65'}});
 fireEvent.change(screen.getByRole('slider',{name:'CATHEXIS height / worker'}),{target:{value:'1.4'}});
 fireEvent.change(screen.getByRole('combobox',{name:'CATHEXIS face'}),{target:{value:'half-right'}});
 fireEvent.click(screen.getByRole('button',{name:'Original'}));
 expect(mockUpdate).toHaveBeenLastCalledWith(expect.objectContaining({original:true,limenHeight:1.5,stilettoPaint:91,cathexis:'#c8bc98',cathexisPaint:65,cathexisHeight:1.4,cathexisFace:'half-right'}));
 fireEvent.click(screen.getByRole('button',{name:'Your treatment'}));
 fireEvent.click(screen.getByRole('checkbox',{name:'Include CATHEXIS'}));
 expect(mockUpdate).toHaveBeenLastCalledWith(expect.objectContaining({original:false,cathexisVisible:false,cathexisFace:'half-right'}));
 expect(JSON.parse(localStorage.getItem('loopforge-readability-v1')!)).toMatchObject({cathexisPaint:65,cathexisVisible:false});
 expect(mockCreate).toHaveBeenCalledTimes(1);view.unmount();expect(mockDispose).toHaveBeenCalledTimes(1);
});
