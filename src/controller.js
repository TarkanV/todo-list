
import {model} from "./model.js";
import {view} from "./view.js";
import { storageModel } from "./storageModel.js";

const fns = require("date-fns");

storageModel.loadDataToModel(model);
const doto = model.getBookNoteFromID(0, 0);

const controller = (function(){
    const saveAll = function(){
        storageModel.saveModelData(model.defaultBook);
        
    }
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

        saveAll();
        view.enableEditBookName(newBookNode);        
    }

    const handleDeleteBook = function(bookID){
        model.deleteBook(bookID);
        saveAll();
    }
    const handleEditBookName = function(bookID, newBookName){
        const book = model.getBookFromID(bookID);
        book.setName(newBookName);
        
        saveAll();
        if(book == model.openedBook)
            view.loadBookNotes(model.openedBook);
    }

    const handleSelectedNote = function(noteID){    
        const note = model.getSelectedNoteFromID(noteID);
        return Object.assign(note);
    }
    const handleOpenedNote = function(noteID){    
        const note = model.getOpenedNoteFromID(noteID);
        return Object.assign(note);
    }
    
    const handleAddNote = function(noteType){
        let newNote;
        if(noteType == "note")
            newNote = model.openedBook.makeNote("Untitled Note");
        else if(noteType == "todo"){
            newNote = model.openedBook.makeTodo("Untitled Todo", "", "Normal", fns.add(new Date(), {days : 1}));
        }
        model.getOpenedNoteFromID(newNote.id);
        model.getSelectedNoteFromID(newNote.id);
        saveAll();
        return {newNote : newNote, selectedBook: model.openedBook};
    }

    const handleSaveNote = function(saveData){
        model.openedNote.name = saveData.name;
        model.openedNote.content = saveData.content;
        if(model.openedNote.getType() == "todo"){
            const todo = model.openedNote;
            const tasks = todo.tasks;
            
            tasks.forEach((task) =>{
                task.content = saveData.taskContentList[tasks.indexOf(task)];
            });  
            todo.dueDate = new Date(saveData.dueDate);
            todo.setStatus();
            todo.priority = saveData.priority;
            
        }
        view.loadBookNotes(model.openedBook);   
        saveAll();
    }

    const handleDeleteNote = function(noteID){
        model.deleteNote(noteID);
        saveAll();
    }

    const handleTodoCheck = function(todoID){
        
        const todo = model.getSelectedNoteFromID(todoID);
        const status = todo.switchStatus();

        saveAll();
        return status;
    }

    const getTodoStatus = function(noteID){
        const todo = model.getSelectedNoteFromID(noteID);
        return todo.getStatus();
    }

    const handleTaskCheck = function(taskID, taskChecked){
        const todo = model.selectedNote;
        const task = todo.getTaskFromID(taskID);
        
        task.checked = taskChecked;
        todo.updateTasksStatus();
        saveAll();
        return todo.getStatus();
    }

    const handleAddTask = function(){
        const todo = model.openedNote;
        const task = todo.makeTask("New Task", false);
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
        view.catchMoreBook(handleAddBook, handleDeleteBook);
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
