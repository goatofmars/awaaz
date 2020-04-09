//controllers
const log = false;
const type = 'page';

//ids
const pageId = "page-edit";
const pageName = 'editPage';

//init page
const init = (project) => {
  engine.make.init.page(pageId,"page");  //init page
  fetch(project);                               //start build
}

//these trackers will be triggered when this module is routed
const trackers = {
  title:'Edit Project',
  meta:[
    {
      name:'description',
      content:'edit this project'
    },
    {
      name:'keywords',
      content:'page,vegana,awaaz,edit'
    }
  ],
  function_data:{},
  //function will be triggered with the function data as input when the module is routed to.
  function:(function_data)=>{}
};


async function fetch(project){
  engine.global.comp.menuComp.init(pageId);
  if(!project){
    engine.global.comp.errorComp.init(pageId,"no project found, please try again.");
    return;
  }
  if(typeof(project) === "string"){
    engine.params.add('id',project);
    const query = await engine.global.function.request({
      to:'/get/project/',
      body:{
        project:project
      }
    });
    if(!query){
      engine.global.comp.errorComp.init(pageId,"failed to fetch the project form our servers, its a possibility that this project is wipped out but you can reload the page to try again.");
      return;
    }
    build(query);
  } else {
    engine.params.add('id',project.id);
    build(project);
  }
}

function build(project){

  engine.global.comp.formComp.init(pageId,project);

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
