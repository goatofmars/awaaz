//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-loader';             //dont worry about this
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
    class:'page-list-comp-loader'
  });

  if(true){
    engine.view.hide(main);
  }

  const card = engine.make.div({
    parent:main,
    class:'card page-list-comp-loader-card'
  });

    engine.make.image({
      parent:card,
      class:'page-list-comp-loader-card-image',
      type:'local',
      location:'assets/images/loader.gif'
    });

    engine.make.div({
      parent:card,
      class:'page-list-comp-loader-card-message',
      text:'please wait heroku takes time to boot the app.'
    });

  if(true){
    engine.make.div({
      parent:main,
      class:'page-list-comp-loader-background'
    });
  }

  engine.add.function('loader',()=>{
    return {
      show:()=>{
        engine.view.show(main);
      },
      hide:()=>{
        engine.view.hide(main);
      }
    }
  });

  return true; //always return after build it can be

}

module.exports = {init:init,ref:compRef,type:type,trackers:null}
