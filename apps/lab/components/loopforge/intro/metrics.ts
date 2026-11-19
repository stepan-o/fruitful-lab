/** Fixed-size histograms: memory use is independent of playback length. */
export class Timing {
  bins=new Uint32Array(1002);
  count=0;total=0;max=0;over100=0;over500=0;
  add(ms:number){
    if(!Number.isFinite(ms)||ms<0)return;
    this.bins[Math.min(1001,Math.ceil(ms))]++;this.count++;this.total+=ms;
    this.max=Math.max(this.max,ms);if(ms>100)this.over100++;if(ms>500)this.over500++;
  }
  percentile(q:number){
    let seen=0;
    for(const [ms,n] of this.bins.entries()){seen+=n;if(seen>=Math.ceil(this.count*q))return ms;}
    return 0;
  }
  result(){return {samples:this.count,meanMs:this.count?this.total/this.count:0,p95CeilMs:this.percentile(.95),p99CeilMs:this.percentile(.99),maxMs:this.max,over100:this.over100,over500:this.over500};}
}
