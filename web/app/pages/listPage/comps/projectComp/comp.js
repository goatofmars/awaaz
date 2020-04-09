//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-project';             //dont worry about this
const type = 'comp';                      //type of app

//ids
var parentId;
var compId;

const init = (pid,project) => {         //pid referes to the parentPageId, pass this var when you init thiscomp.

  if(pid == null || pid == undefined){
    return engine.common.error('no_parent_page_ref_found'); //common error logger
  }

  parentId = pid;               //set parent page ref
  compId = parentId + compRef;  //set comp id
  engine.make.init.comp(compId,parentId,'comp');
  build(project);                      //start build you can also start fetch here.

}
function build(project){

  const main = engine.make.div({
    parent:compId,
    class:'page-list-comp-project'
  });

  const card = engine.make.div({
    parent:main,
    class:'card page-list-comp-project-card',
    function:()=>{
      let mod = engine.get.pageModule("projectPage");
      if(mod){
        engine.router.navigate.new.page(mod,project);
      }
    }
  });

    engine.make.div({
      parent:card,
      class:'page-list-comp-project-card-tag',
      text:'open'
    });

    engine.make.div({
      parent:card,
      class:'page-list-comp-project-card-title',
      text:project.title
    });

}

module.exports = {init:init,ref:compRef,type:type,trackers:null}
