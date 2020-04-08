
const api_url = engine.global.object.api_url;

const functions = {
  request:async (object,log)=>{
    const build = {
      method:'POST',
      url:api_url + object.to,
      body:object.body
    };
    if(log){
      console.log(build);
    }
    engine.global.function.loader().show();
    const run = await engine.request(build);
    engine.global.function.loader().hide();
    if(log){
      console.log(run);
    }
    if(!run){
      console.log(build);
      console.log(run);
      console.log("!!! request failed");
      return false;
    }
    if(!run.hasOwnProperty("result")){
      console.log(build);
      console.log(run);
      console.log("!!! invalid request");
      return false;
    }
    if(run.result === "success"){
      if(run.hasOwnProperty("data")){
        return run.data;
      }
      return true;
    }
    console.log(build);
    console.log(run);
    console.log("!!! request error");
    return false;
  }
};

module.exports = {
  init:()=>{
    for(let key in functions){
      engine.add.function(key,functions[key]);
    }
  }
};
