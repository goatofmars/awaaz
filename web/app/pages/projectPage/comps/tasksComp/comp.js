//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-tasks';             //dont worry about this
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
    class:'page-project-comp-tasks'
  });

    if(project.hasOwnProperty("tasks")){
      if(project.tasks.length > 0){
        const list = engine.make.div({
          parent:main,
          class:'page-project-comp-tasks-list'
        });
        for(let task of project.tasks){
          make_task_card(list,task,project);
        }
      }
    }

    add_task(main,project);

}

const goalComp = require("./comps/goalComp/comp");
const addComp = require("./comps/addComp/comp");

function make_task_card(p,task,project,full){

  const list = engine.make.div({
    parent:p,
    class:'page-project-comp-tasks-list-item'
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
      if(task.finished === true){
        which_image = 'assets/images/checked.png';
      }

      let status_image = engine.make.image({
        parent:left,
        class:"page-project-comp-tasks-list-item-top-left-image",
        type:'local',
        location:which_image,
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
        const hold = bind_task(project,task);
        const run = await submit(hold);
        if(run){
          engine.global.function.reset_project(hold);
        }
      }

    const center = engine.make.div({
      parent:top,
      class:'page-project-comp-tasks-list-item-top-center'
    });

      engine.make.div({
        parent:center,
        class:'page-project-comp-tasks-list-item-top-center-title',
        text:task.title
      });

      const now = new Date().getTime();
      const from = new Date(task.date).getTime();
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
        location:'assets/images/add.png',
        function:()=>{
          addComp.init(compId,null,task,project);
        }
      });

      engine.make.image({
        parent:right,
        class:"page-project-comp-tasks-list-item-top-right-image",
        type:'local',
        location:'assets/images/edit.png',
        function:()=>{
          open_task_form(task,project);
        }
      });

      engine.make.image({
        parent:right,
        class:"page-project-comp-tasks-list-item-top-right-image",
        type:'local',
        location:'assets/images/delete.png',
        function:async ()=>{
          const hold = bind_task(project,task,true);
          const run = await submit(hold);
          if(run){
            engine.global.function.reset_project(hold);
          }
        }
      });

  if(!full && false){
    return;
  }

  if(!task.hasOwnProperty('goals')){
    return true;
  }

  if(task.goals.length == 0){
    return true;
  }

  const goals = engine.make.div({
    parent:list,
    class:'page-project-comp-tasks-list-item-goals'
  });

    for(let goal of task.goals){
      goalComp.init(goals,goal,task,project);
    }

}

function add_task(p,project){

  const main = engine.make.div({
    parent:p,
    class:'card page-project-comp-tasks-add',
    function:()=>{
      open_task_form(null,project);
    }
  });

    engine.make.div({
      parent:main,
      class:'page-project-comp-tasks-add-tag',
      text:'+'
    });

    engine.make.div({
      parent:main,
      class:'page-project-comp-tasks-add-text',
      text:'Add Task'
    });

  if(false){
    open_task_form(null,project);
  }

}

function open_task_form(task,project){

  let task_found = true;
  if(!task){
    task_found = false;
    task = {};
  }

  if(true && !task_found){
    task = {
      title:'yoker task',
      date:'2020-04-19'
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

  let card_title = 'Add Task';
  if(task_found){
    card_title = 'Edit Task';
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
      value:task.title
    });

    const date_input = engine.make.element({
      parent:form,
      class:'page-project-comp-tasks-form-body-field',
      tag:'input',
      type:'date',
      value:task.date
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
    if(task_found){
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
        if(task_found){
          data.id = task.id;
          data.finished = task.finished;
        } else {
          data.id = engine.uniqid();
          data.finished = false;
        }
        const hold = bind_task(project,data);
        const run = await submit(hold,new_message);
        if(run){
          engine.global.function.reset_project(hold);
        }
      }
    });

  let background = engine.make.div({
    parent:wrapper,
    class:'page-project-comp-tasks-form-background'
  });

}

function bind_task(project,mtask,remove){
  if(!project.hasOwnProperty("tasks")){
    project.tasks = [];
  }
  let found = false;
  let count = 0;
  for(let task of project.tasks){
    if(task.id === mtask.id){
      found = true;
      if(!remove){
        project.tasks[count] = mtask;
      } else {
        project.tasks.splice(count,1);
      }
      break;
    } else{
      count += 1;
    }
  }
  if(!found && !remove){
    project.tasks.push(mtask);
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
