import {createFrameWindow} from './frame-window';
it('counts long stalls instead of reporting a falsely smooth animation',()=>{
 const w=createFrameWindow();w.frame(0,'active');for(let i=1;i<=9;i++)w.frame(i*20,'active');w.frame(680,'active');
 expect(w.snapshot()).toMatchObject({sampleCount:10,fps:15,p50:20,p95:500,p99:500});
});
it('excludes paused and loading gaps, including a later resumed take',()=>{
 const w=createFrameWindow();w.frame(0,'active');w.frame(20,'active');w.frame(1000,'idle');
 expect(w.snapshot()).toMatchObject({sampleMode:'idle',sampleCount:0,fps:0});
 w.frame(2000,'loading');w.frame(3000,'active');w.frame(3033,'active');
 expect(w.snapshot()).toMatchObject({sampleCount:1,p50:33});
 w.reset();w.frame(9000,'active');expect(w.snapshot().sampleCount).toBe(0);
});
it('bounds samples while retaining a recent bad frame',()=>{
 const w=createFrameWindow(3);[0,10,20,30,70].forEach(t=>w.frame(t,'active'));
 expect(w.snapshot()).toMatchObject({sampleCount:3,p50:10,p95:40,fps:50});
});
