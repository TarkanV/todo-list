
import {model} from "./model.js";
import {view} from "./view.js";

const fns = require("date-fns");

//Test Books
const myStack = model.defaultBook.makeBook("First Book");
const myBook = model.defaultBook.makeBook("Book 1");
myBook.makeNote("How to make a bomb", `- First take powder
- Spread that shit on your face
- Finish`,
)
 
let book1 = model.defaultBook.makeBook("Book 2");
book1.makeNote("The Enchanted Forest", "Amidst the whispering leaves, magical creatures roam.");
book1.makeNote("Echoes of Eternity", "A tale of time travel and cosmic secrets.");
book1.makeNote("Sapphire Skies", "A journey through dreamscapes and starlit realms.");
book1.makeNote("Crimson Chronicles", "Blood, betrayal, and the rise of a fallen hero.");
book1.makeNote("Whispers in the Wind", "Mysteries unfold with every breeze in a quaint village.");


//Note Sample
myBook.makeNote("Great Sailor", "The great sailor was a well known sailor who has conquered all the seas.");
let todo = myBook.makeTodo("Workout Time", `- Do 10 pushups 
- Eat healthy`, fns.add(new Date(), {days: 0, seconds: 15,}));
const redLight = myBook.makeTodo("Red Light Therapy", "The Good Stuff", fns.add(new Date(), {days: 0, minutes: 10,}));
redLight.makeTask("Read Book");
redLight.makeTask("Meditate");
redLight.makeTask("Feel entitled");
const toastTodo  = myBook.makeTodo("Workout Ting", "Program", fns.add(new Date(),{days : 2}));
toastTodo.makeTask("100 push-ups");
toastTodo.makeTask("100 sit-ups");
myBook.makeNote("Chronicles of the Celestial Pirate", "A spacefaring rogue seeks treasure beyond the stars.");
myBook.makeNote("The Alchemist's Daughter", "Potions, destiny, and the power of a hidden lineage.");
myBook.makeNote("Eclipse of Empires", "Worlds collide as empires clash under an ancient prophecy.");
myBook.makeNote("Songbird's Lament", "The music that awakens magic and changes destinies.");
myBook.makeNote("Sands of Serendipity", "In the desert's embrace, a lost city reveals its secrets.");
myBook.makeBook("The Third Book Of the Guy");

//




const controller = (function(){
    const loadDefaultBook = function(book){
        model.setOpenedBook(book);
        
        
        view.loadBookNotes(model.openedBook);
    }
    const loadAllBooks = function(){
        view.loadBookHierarchy(model.defaultBook);
    }
    const handleAddBook = function(bookID){
        const parentBook = model.getBookFromID(bookID);
        const newBook = parentBook.makeBook("New Book");
        const newBookNode = view.loadBook(newBook, view.focusBookNode);
        view.enableEditBookName(newBookNode);        
    }
    const handleEditBookName = function(bookID, newBookName){
        const book = model.getBookFromID(bookID);
        book.setName(newBookName);
    }

    const handleSelectedNote = function(noteID){    
        const note = model.getSelectedNoteFromID(noteID);
        return Object.assign(note);
    }
    const handleOpenedNote = function(noteID){    
        const note = model.getOpenedNoteFromID(noteID);
        return Object.assign(note);
    }
    
    const handleAddNote = function(){
        const newNote = model.openedBook.makeNote("Untitled Note");
        model.getOpenedNoteFromID(newNote.id);
        model.getSelectedNoteFromID(newNote.id);
        return {newNote : newNote, selectedBook: model.openedBook};
    }

    const handleSaveNote = function(newNoteName, newNoteContent, newTaskContentList){
        model.openedNote.name = newNoteName;
        model.openedNote.content = newNoteContent;
        if(model.openedNote.getType() == "todo"){
            const tasks = model.openedNote.tasks;
            console.log(`Task Lgt : ${tasks.length}`);
            tasks.forEach((task) =>{
                task.content = newTaskContentList[tasks.indexOf(task)];
            });     
        }
        view.loadBookNotes(model.openedBook);   
    }

    const handleDeleteNote = function(noteID){
        model.deleteNote(noteID);
    }

    const handleTodoCheck = function(todoID){
        
        const todo = model.getSelectedNoteFromID(todoID);
        const status = todo.switchStatus();
        
        return status;
    }

    const getTodoStatus = function(noteID){
        const todo = model.getSelectedNoteFromID(noteID);
        return todo.getStatus();
    }

    const handleTaskCheck = function(taskID, taskChecked){
        const todo = model.selectedNote;
        const task = todo.getTaskFromID(taskID);
        console.log(task);
        task.checked = taskChecked;
        todo.updateTasksStatus();
        return todo.getStatus();
    }

    const handleAddTask = function(){
        const todo = model.openedNote;
        const task = todo.makeTask("New Task");
        todo.updateTasksStatus();
        todo.getStatus();
        return task;
    }
    const handleDeleteTask = function(taskID){
        const todo = model.openedNote;
        todo.removeTaskFromID(taskID);
        view.loadEditNote(todo);
        view.loadBookNotes(model.openedBook);
    }

    const handleBookEvents = function(){
        view.setBookCollapsing();
        view.setOpenedBook(model.getOpenedBookFromID);
        view.catchMoreBook(handleAddBook, model.deleteBook);
        view.setEditBookName(handleEditBookName);  
    }
    const handleNoteEvents = function(){
        view.catchSelectedNote(handleSelectedNote)
        view.catchOpenedNote(handleOpenedNote)
        view.catchTodoCheck(handleTodoCheck);
        view.watchTodoStatus(getTodoStatus);
        view.catchAddNote(handleAddNote);
        view.catchNoteEdition(handleSaveNote);
        view.catchDeleteNote(handleDeleteNote);
        view.catchTaskCheck(handleTaskCheck);
        view.catchAddTask(handleAddTask);
        view.catchDeleteTask(handleDeleteTask);
        
    }
    return{
        loadAllBooks,
        handleBookEvents, 
        handleNoteEvents,
        loadDefaultBook,  
    }
})();

controller.loadAllBooks();
controller.handleBookEvents();
controller.handleNoteEvents();
controller.loadDefaultBook(model.defaultTodos);


document.addEventListener("keyup", (e) =>{
    //console.log(`KEY : ${e.key}`);
    if(e.key == "MediaTrackNext") console.log(`DEBUG : ${model.debugVar.name}`);
});
