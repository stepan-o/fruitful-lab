const path=require('node:path');
const webpack=require('next/dist/compiled/webpack/webpack').webpack;
const app=path.resolve(__dirname,'../..');
const config={
  mode:'production',devtool:false,context:app,
  entry:{viewer:'./lib/loopforge/shifts/viewer.ts',kernel:'./lib/loopforge/shifts/worker.ts'},
  output:{path:path.join(app,'public/loopforge-shifts'),filename:'[name].js'},
  resolve:{extensions:['.ts','.js','.json']},
  module:{rules:[{test:/\.ts$/,use:path.join(__dirname,'typescript.cjs')}]},
  optimization:{minimize:false,minimizer:[]},performance:{hints:false}
};
webpack(config,async(err,stats)=>{
  if(err||stats.hasErrors()){console.error(err||stats.toString({all:false,errors:true,errorDetails:true}));process.exitCode=1;}
  else {
    const fs=require('node:fs');
    const {minify}=require('next/dist/compiled/terser');
    for(const name of ['viewer','kernel']){
      const file=path.join(config.output.path,name+'.js');
      const result=await minify(fs.readFileSync(file,'utf8'),{format:{comments:false}});
      fs.writeFileSync(file,result.code+'\n');
      console.log(name,fs.statSync(file).size,'bytes');
    }
  }
});
