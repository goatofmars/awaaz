//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-newProject';             //dont worry about this
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

function build(){

  const main = engine.make.div({
    parent:compId,
    class:'page-list-comp-newProject'
  });

    const card = engine.make.div({
      parent:main,
      class:'card page-list-comp-newProject-card',
      function:()=>{
        let mod = engine.get.pageModule("newPage");
        if(mod){
          engine.router.navigate.new.page(mod);
        }
      }
    });

      engine.make.div({
        parent:card,
        class:'page-list-comp-newProject-card-sign',
        text:'+'
      });

      engine.make.div({
        parent:card,
        class:'page-list-comp-newProject-card-text',
        text:'new project'
      });

  return true;

}

module.exports = {init:init,ref:compRef,type:type,trackers:null}
