
import {model} from "./model.js";
import {view} from "./view.js";


const myStack = model.defaultBook.makeBook("First Book");
const myBook = model.defaultBook.makeBook("My Book");
myBook.makeNote("How to make a bomb", `- First take powder
- Spread that shit on your face
- Finish`,
)

let note = myStack.makeBook("Book1").makeNote("Error Note", "OG");
let todo = myBook.makeTodo("Muscu Time", "Schedule");

view.loadAllBooks(model.defaultBook);

console.log("ID : " + myStack.id);




console.log("Hierarchy : ");
view.showHierarchy(model.defaultBook);


const controller = (function(){
    
})();

