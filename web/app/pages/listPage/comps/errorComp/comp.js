//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-error';             //dont worry about this
const type = 'comp';                      //type of app

//ids
var parentId;
var compId;

const init = (pid,message) => {         //pid referes to the parentPageId, pass this var when you init thiscomp.

  if(pid == null || pid == undefined){
    return engine.common.error('no_parent_page_ref_found'); //common error logger
  }

  parentId = pid;               //set parent page ref
  compId = parentId + compRef;  //set comp id
  engine.make.init.comp(compId,parentId,'comp');
  build(message);                      //start build you can also start fetch here.

}

function build(message){

  let main = engine.make.div({
    parent:compId,
    class:'page-list-comp-error'
  });

  let card = engine.make.div({
    parent:main,
    class:'card page-list-comp-error-card'
  });

  let left = engine.make.div({
    parent:card,
    class:'page-list-comp-error-card-left'
  });

    engine.make.image({
      parent:left,
      class:'page-list-comp-error-card-left-image',
      type:'local',
      location:'assets/images/error.png'
    });

  let right = engine.make.div({
    parent:card,
    class:'page-list-comp-error-card-right',
    text:message
  });

  return true; //always return after build it can be

}

module.exports = {init:init,ref:compRef,type:type,trackers:null}
