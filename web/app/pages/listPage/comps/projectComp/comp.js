//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-project';             //dont worry about this
const type = 'comp';                      //type of app

//ids
var parentId;
var compId;

const init = (pid) => {         //pid referes to the parentPageId, pass this var when you init thiscomp.

  if(pid == null || pid == undefined){
    return engine.common.error('no_parent_page_ref_found'); //common error logger
  }

  parentId = pid;               //set parent page ref
  compId = parentId + compRef;  //set comp id
  engine.make.init.comp(compId,parentId,'comp');
  build();                      //start build you can also start fetch here.

}

//these trackers will be triggered when this module is routed
const trackers = {
  title:'sample comp title',
  meta:[
    {
      name:'description',
      content:'this is a sample comp description'
    },
    {
      name:'keywords',
      content:'comp,vegana'
    }
  ],
  function_data:{},
  //function will be triggered with the function data as input when the module is routed to.
  function:(function_data)=>{}
};

//build the dom for comp here
function build(){

  engine.common.tell('building',log);

  //sample greetings
  let greetings = engine.make.div({
    id:"greetings",
    parent:compId,
    class:'greetings',
    text:'greetings this is the project comp'
  });

  return true; //always return after build it can be

}

module.exports = {init:init,ref:compRef,type:type,trackers:trackers}
