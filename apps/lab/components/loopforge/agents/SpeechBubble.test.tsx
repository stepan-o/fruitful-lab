import {render,screen} from '@testing-library/react';
import SpeechBubble from './SpeechBubble';
import type {Bubble} from '@/lib/loopforge/encounters/contract';
const speech:Bubble={id:'test',speaker:'limen',to:[],text:'HEY YOU I SAID STOP!!!!',act:'instruction',age:0,delivery:{tone:'outburst',emotion:'anger',emphasis:['STOP']}};
it('keeps a complete accessible sentence and emotion while visually revealing it',()=>{
 const {container,rerender}=render(<SpeechBubble speech={speech} name='LIMEN' character='limen' playing expressive/>);
 expect(screen.getByText(speech.text)).toBeInTheDocument();expect(screen.getByRole('img',{name:'angry'})).toBeInTheDocument();
 expect(container.querySelector('[style="opacity: 0;"]')).not.toBeNull();
 rerender(<SpeechBubble speech={speech} name='LIMEN' character='limen' playing={false} expressive/>);
 expect(container.querySelector('[style="opacity: 0;"]')).toBeNull();
 rerender(<SpeechBubble speech={speech} name='LIMEN' character='limen' playing expressive={false}/>);
 expect(screen.queryByRole('img')).not.toBeInTheDocument();expect(container.querySelector('[style="opacity: 0;"]')).toBeNull();
});
