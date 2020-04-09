//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-form';             //dont worry about this
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

  let project_found = false;
  let button_text = 'Submit Project';
  if(project){
    project_found = true;
    button_text = "Update Project";
  }
  if(!project && true){
    project = {
      title:'new project',
      discription:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      date:'2020-04-08'
    };
  }

  const main = engine.make.div({
    parent:compId,
    class:'page-list-comp-form'
  });

    const card = engine.make.div({
      parent:main,
      class:'card page-list-comp-form-card'
    });

      let title = 'New Project';
      if(project_found){
        title = 'Edit Project';
      }

      engine.make.div({
        parent:card,
        class:'page-list-comp-form-card-title',
        text:title
      });

      const form = engine.make.div({
        parent:card,
        class:'page-list-comp-form-card-form'
      });

        const title_input = engine.make.input({
          parent:form,
          class:'page-list-comp-form-card-form-field',
          placeholder:'project title',
          type:'string',
          value:project.title
        });

        const discription_input = engine.make.textarea({
          parent:form,
          class:'page-list-comp-form-card-form-field',
          placeholder:'project discription',
          type:'string',
          value:project.discription
        });

        const date_input = engine.make.element({
          parent:form,
          class:'page-list-comp-form-card-form-field',
          tag:'input',
          type:'date',
          placeholder:'project date',
          value:project.date
        });

        let message;
        let message_cont = engine.make.div({
          parent:form,
          class:'page-list-comp-form-card-form-message'
        });
        function new_message(m){
          if(message){
            engine.view.remove(message);
          }
          message = engine.make.div({
            parent:message_cont,
            class:'page-list-comp-form-card-form-message-text',
            text:m
          });
        }

        engine.make.button({
          parent:form,
          class:'page-list-comp-form-card-form-button',
          value:button_text,
          function:async ()=>{
            let data = {
              title:engine.binder.text(title_input),
              discription:engine.binder.text(discription_input),
              date:engine.binder.text(date_input)
            }
            if(!engine.validate.json({
              title:{type:'string',min:1,max:256},
              discription:{type:'string',min:1,max:4056},
              date:{type:'string',min:1,max:32},
            },data)){
              new_message("please make sure you fill the form correctly.");
              return;
            }
            if(project.hasOwnProperty('id')){
              data.id = project.id;
            } else {
              data.id = engine.uniqid();
            }
            let url = '/submit/project/';
            if(project_found){
              url = '/update/project/';
            }
            const query = await engine.global.function.request({
              to:url,
              body:data
            });
            if(!query || false){
              new_message("something went wrong while we were submiting your project please try again.");
              return;
            }
            let mod = engine.get.pageModule("projectPage");
            if(!mod){
              new_message("something went wrong while we were opening your project please go to the home page to see the project or resubmit to try again.");
              return;
            }
            engine.router.navigate.new.page(mod,query);
          }
        });

}

module.exports = {init:init,ref:compRef,type:type,trackers:null}
