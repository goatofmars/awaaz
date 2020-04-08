//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-menu';             //dont worry about this
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
    class:'page-list-comp-menu'
  });

  const left = engine.make.div({
    parent:main,
    class:'page-list-comp-menu-left'
  });

    engine.make.div({
      parent:left,
      class:'page-list-comp-menu-left-logo',
      text:'awaaz'
    });

  const right = engine.make.div({
    parent:main,
    class:'page-list-comp-menu-right'
  });

    make_link(right,{tag:'Twitter',link:'https://twitter.com/myCrazyGoat'});
    make_link(right,{tag:'Framework',link:'https://vegana.github.io/'});
    make_link(right,{tag:'Git',link:'https://github.com/gzbakku'});
    make_link(right,{tag:'Npm',link:'https://www.npmjs.com/~gzbakku'});

  return true;

}

function make_link(p,link){
  engine.make.div({
    parent:p,
    class:'page-list-comp-menu-right-link',
    text:link.tag,
    function:()=>{
      window.open(link.url);
    }
  });
}

module.exports = {init:init,ref:compRef,type:type,trackers:null}
