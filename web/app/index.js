
//import all the pages here which you want to be in the app and use engine.get.pageModule api to get the page
const listPage = require('./pages/listPage/page');
const projectPage = require('./pages/projectPage/page');
const editPage = require('./pages/editPage/page');
const newPage = require('./pages/newPage/page');

window.vegana_do_not_route_with_url = true;

const menuComp = require('./pages/listPage/comps/menuComp/comp');
const formComp = require('./pages/listPage/comps/formComp/comp');
const errorComp = require('./pages/listPage/comps/errorComp/comp');
const loaderComp = require('./pages/listPage/comps/loaderComp/comp');

engine.add.comp("menuComp",menuComp);
engine.add.comp("formComp",formComp);
engine.add.comp("errorComp",errorComp);


//declare the first page module here
let startPage = listPage;

if(false){
  engine.add.object("api_url","http://localhost:8000");
} else {
  engine.add.object("api_url","https://awaazinterview.herokuapp.com");
}

const supers = require('./supers');
supers.init();

/*set the base url to the native vegana cdn,
or if hosting on non native platform please
set the baseurl to where the files for the project are held*/
const baseHref = "/";
engine.router.set.baseHref(baseHref);
loaderComp.init('page-router');

function pageify(){
  console.log('pageify');
  const params = engine.params.native.get();
  if(params.page == "newPage"){
    startPage = newPage;
  }
  if(params.page == "editPage"){
    if(params.params.hasOwnProperty("id")){
      editPage.init(params.params.id);
      return;
    }
  }
  if(params.page == "projectPage"){
    if(params.params.hasOwnProperty("id")){
      projectPage.init(params.params.id);
      return;
    }
  }

}

pageify();

//------------------------------------------------------------------------------
//dont fuck with anything below
if(engine.router.active.page == null){
  startPage.init();
}
