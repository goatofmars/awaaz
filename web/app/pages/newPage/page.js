//controllers
const log = false;
const type = 'page';

//ids
const pageId = "page-new";
const pageName = 'newPage';

//init page
const init = () => {
  engine.make.init.page(pageId,"page");  //init page
  build();                               //start build
}

//these trackers will be triggered when this module is routed
const trackers = {
  title:'new project',
  meta:[
    {
      name:'description',
      content:'make new project'
    },
    {
      name:'keywords',
      content:'awaaz new project'
    }
  ],
  function_data:{},
  //function will be triggered with the function data as input when the module is routed to.
  function:(function_data)=>{}
};

//build page
function build(){

  engine.global.comp.menuComp.init(pageId);
  engine.global.comp.formComp.init(pageId);

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
