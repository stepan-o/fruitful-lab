import {speechWords} from './speech-delivery';
it('preserves exact text, spaces, punctuation and repeated emphasis phrases',()=>{
 const text='Ten units. Ten sets of papers. No exceptions.';
 const words=speechWords(text,{tone:'command',emphasis:['Ten','No exceptions']});
 expect(words.map(w=>w.text).join('')).toBe(text);
 expect(words.filter(w=>w.stress).map(w=>w.text.trim())).toEqual(['Ten','Ten','No','exceptions.']);
 expect(Math.max(...words.map(w=>w.at))).toBeLessThanOrEqual(.65);
});
it('supports literal punctuation without interpreting markup or regular expressions',()=>{
 const words=speechWords('Wait… <script> [STOP]',{tone:'outburst',emphasis:['[STOP]','']});
 expect(words.map(w=>w.text).join('')).toBe('Wait… <script> [STOP]');
 expect(words.filter(w=>w.stress).map(w=>w.text)).toEqual(['[STOP]']);
 expect(words.at(-1)!.at).toBeLessThanOrEqual(.32);
});
