import {createRef} from 'react';
import {act,fireEvent,renderHook} from '@testing-library/react';
import {hydrateRoot,type Root} from 'react-dom/client';
import {useSceneFocus} from './use-scene-focus';

it('accepts one focus click while loading and preserves it when the scene becomes ready',()=>{
 const stage=createRef<HTMLElement>(),element=document.createElement('section');stage.current=element;
 element.scrollIntoView=jest.fn();
 const {result,rerender}=renderHook(({ready})=>useSceneFocus(false,ready,stage),{initialProps:{ready:false}});
 expect(result.current.focusReady).toBe(true);
 act(()=>result.current.toggleFocus());expect(result.current.focused).toBe(true);
 expect(element.scrollIntoView).toHaveBeenCalledTimes(1);
 rerender({ready:true});expect(result.current.focused).toBe(true);
 expect(element.scrollIntoView).toHaveBeenCalledTimes(2);
 act(()=>result.current.toggleFocus());expect(result.current.focused).toBe(false);
 rerender({ready:false});rerender({ready:true});
 expect(element.scrollIntoView).toHaveBeenCalledTimes(2);
});

it('hydrates the disabled Focus control, then accepts the first click while assets still load',()=>{
 const stage=createRef<HTMLElement>();
 const container=document.createElement('div');document.body.appendChild(container);
 container.innerHTML='<button disabled="" data-focused="false">Focus scene</button>';
 const hydrationErrors:unknown[]=[];
 function Control(){
  const state=useSceneFocus(false,false,stage);
  return <button disabled={!state.focusReady} data-focused={state.focused} onClick={state.toggleFocus}>Focus scene</button>;
 }
 expect(container.querySelector('button')).toBeDisabled();
 let root:Root|undefined;
 try{
  act(()=>{root=hydrateRoot(container,<Control/>,{onRecoverableError:error=>hydrationErrors.push(error)});});
  const button=container.querySelector('button')!;
  expect(hydrationErrors).toEqual([]);
  expect(button).toBeEnabled();
  fireEvent.click(button);
  expect(button).toHaveAttribute('data-focused','true');
 }finally{
  act(()=>{root?.unmount();});
  container.remove();
 }
});
