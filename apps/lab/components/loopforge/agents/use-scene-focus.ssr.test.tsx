/** @jest-environment node */
import {createRef} from 'react';
import {renderToString} from 'react-dom/server';
import {useSceneFocus} from './use-scene-focus';

it('does not advertise an enabled Focus control before hydration',()=>{
 function Control(){const state=useSceneFocus(false,false,createRef<HTMLElement>());return <button disabled={!state.focusReady}>Focus scene</button>;}
 expect(renderToString(<Control/>)).toContain('disabled=""');
});
