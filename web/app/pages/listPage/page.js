//controllers
const log = false;
const type = 'page';

//ids
const pageId = "page-list";
const pageName = 'listPage';

//init page
const init = () => {
  engine.make.init.page(pageId,"page");  //init page
  build();                               //start build
}

//these trackers will be triggered when this module is routed
const trackers = {
  title:'Awaaz Interview',
  meta:[
    {
      name:'description',
      content:'just a simple sample app for awaaz'
    },
    {
      name:'keywords',
      content:'awaaz,sample,interview'
    }
  ],
  function_data:{},
  //function will be triggered with the function data as input when the module is routed to.
  function:(function_data)=>{}
};

const projectComp = require('./comps/projectComp/comp');
const newProjectComp = require('./comps/newProjectComp/comp');

//build page
async function build(){

  engine.global.comp.menuComp.init(pageId);

  const messages = [
    '1. hey this is the sample app you asked for its in js frameowrk i developed.',
    '2. the api does not contains any db',
    '3. projects are wipped on regular intervals',
    '4. there seems to be a problem with gunicorn which i cannot debug for now please reload the page until you get the updated data from the api'
  ];

  const messages_cont = engine.make.div({
    parent:pageId,
    class:'card page-list-messages'
  })

    for(let message of messages){
      engine.make.div({
        parent:messages_cont,
        class:'page-list-messages-message',
        text:message
      })
    }

  if(false){
    return;
  }

  const query = await engine.global.function.request({
    to:'/list/',
    body:{
      get:true
    }
  });

  if(!query || false){
    engine.global.comp.errorComp.init(pageId,"something went wrong, while we were fetching projets from our servers please try again.");
    return;
  }

  const projects_cont = engine.make.div({
    parent:pageId,
    class:'page-list-projects',
  })

  newProjectComp.init(projects_cont);

  for(let project of query){
    projectComp.init(projects_cont,project);
  }

  if(false){
    engine.global.function.loader().show();
  }

  return true;

}

//do not change current exports you are free to add your own though.
let pageControllers = {
  init:init,
  ref:pageId,
  type:type,
  name:pageName,
  contModules:{},
  contList:{},
  trackers:trackers
};
module.exports = pageControllers;
window.pageModules[pageName] = pageControllers;
