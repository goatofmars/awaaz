//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-add';             //dont worry about this
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

function build(goal,task,project){

  let goal_found = true;
  if(!goal){
    goal_found = false;
    goal = {};
  }

  if(true && !goal_found){
    goal = {
      title:'yolker goal',
      date:'2020-04-23'
    }
  }

  const wrapper = engine.make.div({
    parent:compId,
    class:'page-project-comp-tasks-form-wrapper'
  });

  const main = engine.make.div({
    parent:wrapper,
    class:'card page-project-comp-tasks-form'
  });

  let card_title = 'Add Goal';
  if(goal_found){
    card_title = 'Edit Goal';
  }

  const title = engine.make.div({
    parent:main,
    class:'page-project-comp-tasks-form-title'
  });

    engine.make.div({
      parent:title,
      class:'page-project-comp-tasks-form-title-left',
      text:card_title
    });

    const title_right = engine.make.div({
      parent:title,
      class:'page-project-comp-tasks-form-title-right'
    });

      engine.make.button({
        parent:title_right,
        class:'page-project-comp-tasks-form-title-right-button',
        value:"X",
        function:()=>{
          engine.view.remove(wrapper);
        }
      });

  const form = engine.make.div({
    parent:main,
    class:'page-project-comp-tasks-form-body'
  });

    const title_input = engine.make.input({
      parent:form,
      class:'page-project-comp-tasks-form-body-field',
      type:'string',
      placeholder:'Task Title',
      value:goal.title
    });

    const date_input = engine.make.element({
      parent:form,
      class:'page-project-comp-tasks-form-body-field',
      tag:'input',
      type:'date',
      value:goal.date
    });

    let message;
    let message_cont = engine.make.div({
      parent:form,
      class:'page-project-comp-tasks-form-body-message'
    });
    function new_message(m){
      if(message){
        engine.view.remove(message);
      }
      message = engine.make.div({
        parent:message_cont,
        class:'page-project-comp-tasks-form-body-message-text',
        text:m
      });
    }

    let button_text = 'Submit Task';
    if(goal_found){
      button_text = 'Update Task';
    }

    engine.make.button({
      parent:form,
      class:'page-project-comp-tasks-form-body-button',
      value:button_text,
      function:async ()=>{
        let data = {
          title:engine.binder.text(title_input),
          date:engine.binder.text(date_input)
        }
        if(!engine.validate.json({
          title:{type:'string',min:1,max:256},
          date:{type:'string',min:1,max:32},
        },data)){
          new_message("please make sure you fill the form correctly.");
          return;
        }
        if(goal_found){
          data.id = goal.id;
          data.finished = goal.finished;
        } else {
          data.id = engine.uniqid();
          data.finished = false;
        }
        const first = bind_goal(task,data);
        const hold = bind_task(project,first);
        const run = await submit(hold,new_message);
        if(run){
          engine.global.function.reset_project();
        }
      }
    });

  let background = engine.make.div({
    parent:wrapper,
    class:'page-project-comp-tasks-form-background'
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
