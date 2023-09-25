let fns = require("date-fns");

const model = (function(){ 

    const fileOperator = {
        
        add(file) {
            file.parent = this;
            return this.children.push(file);
        },

        remove(file) {
            const childIndex = this.children.indexOf(file);
            if (childIndex !== -1)
                this.children.splice(childIndex, 1);
        },
        move(file){

        }

    }     
/*
    // File Types
    const makeStack  = function(name){
        // children can be stacks and books
        let children = [];
        
        const stack = {
            name,
            children,
            ...fileOperator,
            makeBook,        
            getType : ()  => "stack",
        }
        this.add(stack);
        return stack;
    }
*/
    let refBookID = -1;
    let refNoteID = -1;
    let bookList = [];
    const makeBook = function(name){
        let children = []; 
        const book = {
            name : name,
            setName: function (newName) { 
                this.name = newName; 
                return this.name;
              },
            id: ++refBookID, 
            parent,
            children, 
            hasSubFolders(){return children.find((file) =>file.getType() == "book")},
            ...fileOperator,
            makeBook,
            makeNote,
            makeTodo,
            getType : ()  => "book",
        }
        this.add(book);
        bookList.push(book);
        return book;
    }
    
    

    const defaultBook = {
        name : "Memobooks",
        id: ++refBookID, 
        children : [],
        ...fileOperator,
        makeBook,        
        getType : ()  => "book",
    };
    const defaultNotes = {
        name : "Notes",
        id:"N",
        children : [],
        ...fileOperator,
        getType : () => "book",
    }
    
    const defaultTodos = {
        name : "Todo",
        id:"T",
        children : [],
        ...fileOperator,
        getType : () => "book",
    }

    bookList.push(defaultBook, defaultNotes, defaultTodos);

    let openedBook;
    let focusBook;

    const getBookFromID = function(bookID){
        return bookList.find(book => book.id == bookID);  
    }
    const setOpenedBookFromID = function(clickedBookID){
        openedBook = getBookFromID(clickedBookID);
        
        return openedBook;
    };
    const getBookNoteFromID = function(bookID, noteID){
        const book = getBookFromID(bookID);
        return book.children.find(note => note.id == noteID);
    }
    const getOpenedNoteFromID = function(openedNoteID){
        //console.log(`Opened Book : ${openedBook.name}`);  
        return getBookNoteFromID(openedBook.id, openedNoteID);
    }
    const setOpenedBook = function(book){
        openedBook = book;
    }

    const deleteNote = function(noteID){
        const note = getOpenedNoteFromID(noteID);
        const noteIDX = note.parent.children.indexOf(note);
        const defaultNoteIDX = defaultNotes.children.indexOf(note);
        note.parent.children.splice(noteIDX, 1);
        defaultNotes.children.splice(defaultNoteIDX);
    }
    
    const deleteBook = function(bookID){
        const book =  getBookFromID(bookID);
        const parentBook = book.parent;
        const childIDX = parentBook.children.indexOf(book);
        const listChildIDX = bookList.indexOf(book);
        
        bookList.splice(listChildIDX, 1);
        parentBook.children.splice(childIDX, 1);
        
    };

    const noteMix = function(name, content){
        const creationDate = new Date();
        const editNote = function(text){content = text};
        return {
            name,
            id: ++refNoteID,
            creationDate,
            formattedCreationDate : {
                date : creationDate.toLocaleDateString(), 
                time : creationDate.toLocaleTimeString()
            },
            content,
            editNote,
        }
    };

    const makeNote = function(name, content = ""){ 
        const note = {
            ...noteMix(name, content),      
            getType : () => "note",
        }
        this.add(note);
        defaultNotes.children.push(note);
        return note;
    }

    const makeTodo = function(name, content = "", dueDate, status = "Ongoing"){
        const tasks = [];
        const addTask = function(content){
            tasks.push({
                content,
                checked : false,
            });
        }

        const removeTask = function(content){
            tasks.splice(tasks.indexOf(content), 1);
        } 
        
        const getStatus = function(){
            if(status != "Done"){
                let daysLeft = fns.differenceInCalendarDays(dueDate, new Date());
                let secLeft = fns.differenceInSeconds(dueDate, new Date());
                //console.log("Days Left : " + daysLeft);
                switch(true){
                    case (daysLeft == 0) : 
                        if(secLeft > 0)
                            return "Today";
                        else return "Overdue";
                    break;
                    case (daysLeft == 1) : return "Tomorrow"; break;
                    case (daysLeft < 0) : return "Overdue"; break;
                    default : return daysLeft + " days left"; break;
                }
            }
            else return status;
        }


        const getPreciseStatus = function(){
            if(status != "Done"){
                let timeLeft = fns.differenceInSeconds(dueDate, new Date());
                
                switch(true){        
                    case (timeLeft < 0) : return "Overdue"; break;
                    default : return `${Math.floor(timeLeft/60)} minutes left`; break;
                }
            }
            else return status; 
        }

        const updateTasksStatus = function(){
            tasks.forEach(task =>{
                if(!task.checked){
                    return;
                }
            })
            status = "Done";
        }

        const switchStatus = function(){
            if(status != "Done"){
                status = "Done";
                tasks.forEach(task => task.checked = true);
            }
            else {
                status = "Ongoing";
                status = this.getStatus();
                
                tasks.forEach(task => task.checked = false);
            }
            return status;
           
        

        } 
    
        const todo = {
            ...noteMix(name, content),
            dueDate,
            getStatus,
            getPreciseStatus,
            updateTasksStatus,
            switchStatus,
            tasks,
            addTask,
            removeTask,
            getType : ()  => "todo",
        };

        this.add(todo);
        defaultTodos.children.push(todo);
        return todo;
        
    } 
    
    // end

    
    
    return{
        defaultBook,
        defaultNotes,
        defaultTodos,
        bookList,
        setOpenedBook,
        get openedBook(){ return openedBook},
        focusBook,
        getBookFromID,
        setOpenedBookFromID,
        getBookNoteFromID,
        getOpenedNoteFromID,
        deleteBook,
        deleteNote,
        debugVar : "", 
    }
    
})();

export {model};