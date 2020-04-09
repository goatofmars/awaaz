//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-goal';             //dont worry about this
const type = 'comp';                      //type of app

//ids
var parentId;
var compId;

const init = (pid,goal,task,project) => {         //pid referes to the parentPageId, pass this var when you init thiscomp.

  if(pid == null || pid == undefined){
    return engine.common.error('no_parent_page_ref_found'); //common error logger
  }

  parentId = pid;               //set parent page ref
  compId = parentId + compRef;  //set comp id
  engine.make.init.comp(compId,parentId,'comp');
  build(goal,task,project);                      //start build you can also start fetch here.

}

const addComp = require('../addComp/comp');

function build(goal,task,project){

  const list = engine.make.div({
    parent:compId,
    class:'page-project-comp-tasks-list-item-goal'
  });

  const top = engine.make.div({
    parent:list,
    class:'page-project-comp-tasks-list-item-top'
  });

  const left = engine.make.div({
    parent:top,
    class:'page-project-comp-tasks-list-item-top-left'
  });

    let which_image = 'assets/images/unchecked.png';
    if(goal.finished === true){
      which_image = 'assets/images/checked.png';
    }

    let status_image = engine.make.image({
      parent:left,
      class:"page-project-comp-tasks-list-item-top-left-image",
      type:'local',
      location:which_image,
      function:()=>{
        if(goal.finished === true){
          goal.finished = false;
          process_status();
        } else {
          goal.finished = true;
          process_status();
        }
      }
    });

    async function process_status(){
      let s_image = 'assets/images/checked.png';
      if(!task.finished){
        s_image = 'assets/images/unchecked.png';
      }
      engine.view.remove(status_image);
      status_image = engine.make.image({
        parent:left,
        class:"page-project-comp-tasks-list-item-top-left-image",
        type:'local',
        location:s_image,
        function:()=>{
          if(task.finished === true){
            task.finished = false;
            process_status();
          } else {
            task.finished = true;
            process_status();
          }
        }
      });
      const first = bind_goal(task,goal);
      const hold = bind_task(project,first);
      const run = await submit(hold);
      if(run){
        engine.global.function.reset_project();
      }
    }

  const center = engine.make.div({
    parent:top,
    class:'page-project-comp-tasks-list-item-top-center'
  });

    engine.make.div({
      parent:center,
      class:'page-project-comp-tasks-list-item-top-center-title',
      text:goal.title
    });

    const now = new Date().getTime();
    const from = new Date(goal.date).getTime();
    let days = 0;
    if(now < from){
      let diff = from - now;
      days = Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    engine.make.div({
      parent:center,
      class:'page-project-comp-tasks-list-item-top-center-days',
      text:days + ' days'
    });

  const right = engine.make.div({
    parent:top,
    class:'page-project-comp-tasks-list-item-top-right'
  });

    engine.make.image({
      parent:right,
      class:"page-project-comp-tasks-list-item-top-right-image",
      type:'local',
      location:'assets/images/edit.png',
      function:()=>{
        addComp.init(compId,goal,task,project);
      }
    });

    engine.make.image({
      parent:right,
      class:"page-project-comp-tasks-list-item-top-right-image",
      type:'local',
      location:'assets/images/delete.png',
      function:async ()=>{
        const first = bind_goal(task,goal,true);
        const hold = bind_task(project,first);
        const run = await submit(hold);
        if(run){
          engine.global.function.reset_project();
        }
      }
    });

}

function bind_goal(task,mgoal,remove){
  if(!task.hasOwnProperty("goals")){
    task.goals = [];
  }
  let found = false;
  let count = 0;
  for(let goal of task.goals){
    if(goal.id === mgoal.id){
      found = true;
      if(!remove){
        task.goals[count] = mgoal;
      } else {
        task.goals.splice(count,1);
      }
      break;
    } else{
      count += 1;
    }
  }
  if(!found && !remove){
    task.goals.push(mgoal);
  }
  return task;
}

function bind_task(project,mtask){
  if(!project.hasOwnProperty("tasks")){
    project.tasks = [];
  }
  let found = false;
  let count = 0;
  for(let task of project.tasks){
    if(task.id === mtask.id){
      found = true;
      project.tasks[count] = mtask;
      break;
    } else{
      count += 1;
    }
  }
  if(!found){
    return false;
  }
  return project;
}

async function submit(data,new_message){
  if(false){
    console.log(data);
    return true;
  }
  const query = await engine.global.function.request({
    to:'/update/project/',
    body:data
  });
  if(!query || false){
    if(new_message){
      new_message("something went wrong while we were submiting this task please try again.");
    }
    return false;
  }
  return true;
}


module.exports = {init:init,ref:compRef,type:type,trackers:null}
