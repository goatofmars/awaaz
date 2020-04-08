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
  title:'sample page title',
  meta:[
    {
      name:'description',
      content:'this is a sample page description'
    },
    {
      name:'keywords',
      content:'page,vegana'
    }
  ],
  function_data:{},
  //function will be triggered with the function data as input when the module is routed to.
  function:(function_data)=>{}
};

const menuComp = require('./comps/menuComp/comp');
const projectComp = require('./comps/menuComp/comp');
const loaderComp = require('./comps/loaderComp/comp');

//build page
async function build(){

  engine.add.comp("menuComp",menuComp);

  menuComp.init(pageId);
  loaderComp.init(pageId);

  const messages = [
    '1. hey this is the sample app you asked for its in js frameowrk i developed.',
    '2. the api does not contains any db',
    '3. projects are wipped on regular intervals'
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
    body:{}
  });

  console.log(query);

  return true; //always return after the build completes

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
