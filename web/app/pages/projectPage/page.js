//controllers
const log = false;
const type = 'page';

//ids
const pageId = "page-project";
const pageName = 'projectPage';

//init page
const init = (project) => {
  engine.make.init.page(pageId,"page");  //init page
  fetch(project);                               //start build
}

//these trackers will be triggered when this module is routed
const trackers = {
  title:'Project Page',
  meta:[
    {
      name:'description',
      content:'this is a project page'
    },
    {
      name:'keywords',
      content:'page,project,awaaz'
    }
  ],
  function_data:{},
  //function will be triggered with the function data as input when the module is routed to.
  function:(function_data)=>{}
};

async function fetch(project,redo){
  if(!redo){
      engine.global.comp.menuComp.init(pageId);
  }
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

const tasksComp = require('./comps/tasksComp/comp');

//build page
function build(project){

  engine.set.pageTitle("Project : " + project.title);

  const main = engine.make.div({
    parent:pageId,
    class:'page-project-main'
  });

  engine.add.function('reset_project',()=>{
    engine.view.remove(main);
    fetch(project.id,true);
  });

    const card = engine.make.div({
      parent:main,
      class:'card page-project-main-card'
    });

      engine.make.div({
        parent:card,
        class:'page-project-main-card-title',
        text:'Project : ' + project.title
      });

      make_banner(card,"Date");

      engine.make.div({
        parent:card,
        class:'page-project-main-card-date',
        text:new Date(project.date)
      });

      make_banner(card,"Discription");

      engine.make.div({
        parent:card,
        class:'page-project-main-card-discription',
        text:project.discription
      });

      const options = engine.make.div({
        parent:card,
        class:'page-project-main-card-options'
      });

        engine.make.button({
          parent:options,
          class:'page-project-main-card-options-button',
          value:'edit',
          function:()=>{
            let mod = engine.get.pageModule("editPage");
            if(mod){
              engine.router.navigate.new.page(mod,project);
            }
          }
        });

      tasksComp.init(card,project);

}

function make_banner(p,m){
  engine.make.div({
    parent:p,
    class:'page-project-main-card-banner',
    text:m
  });
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
