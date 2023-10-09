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
    let openedNote;
    let selectedNote;

    const getBookFromID = function(bookID){
        return bookList.find(book => book.id == bookID);  
    }
    const getOpenedBookFromID = function(clickedBookID){
        openedBook = getBookFromID(clickedBookID);
        
        return openedBook;
    };
    const getBookNoteFromID = function(bookID, noteID){
        const book = getBookFromID(bookID);
        return book.children.find(note => note.id == noteID);
    }
    const getSelectedNoteFromID = function(selectedNoteID){
        //console.log(`Opened Book : ${openedBook.name}`);    
        selectedNote = getBookNoteFromID(openedBook.id, selectedNoteID);
        return selectedNote;
    }
    const getOpenedNoteFromID = function(openedNoteID) {
        openedNote = getBookNoteFromID(openedBook.id, openedNoteID);
        return openedNote;
    }
    const setOpenedBook = function(book){
        openedBook = book;
    }

    const deleteNote = function(noteID){
        const note = getOpenedNoteFromID(noteID);
        const noteIDX = note.parent.children.indexOf(note);
        const defaultNoteIDX = defaultNotes.children.indexOf(note);
        note.parent.children.splice(noteIDX, 1);
        if(note.getType() == "note") 
            defaultNotes.children.splice(defaultNoteIDX);
        else if (note.getType() == "todo"){
            defaultTodos.children.splice(defaultNoteIDX);
        }
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


        const taskMix = function(){
            //Task Stuff
            let refTaskID = -1;
            const makeTask = function(content){
                ++refTaskID;
                let _checked = false;
                const task = {
                    id: refTaskID,
                    content,
                    set checked(value){_checked = value},
                    get checked(){return _checked},
                }
                this.tasks.push(task);
                return task;
            }
            const getTaskFromID = function(id){
                const taskIDX = this.tasks.findIndex((task) => task.id == id);
                return this.tasks[taskIDX];
            }
            const removeTaskFromID = function(id){
                const delTaskID = this.tasks.findIndex((task) => task.id == id);
                this.tasks.splice(delTaskID, 1);
            } 

            return{
                makeTask,
                getTaskFromID,
                removeTaskFromID,
            }
            //END 
        }

        

        const statusMix = {
            //Status Functions
            setStatus(){
                this.status = this.getStatus();
            },
            getStatus(){
                
                if(this.status != "Done"){
                    let daysLeft = fns.differenceInCalendarDays(this.dueDate, new Date());
                    let secLeft = fns.differenceInSeconds(this.dueDate, new Date());
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
                else {
                   
                    return this.status;
                }
            },
            getPreciseStatus(){
                if(this.status != "Done"){
                    let timeLeft = fns.differenceInSeconds(this.dueDate, new Date());
                    
                    switch(true){        
                        case (timeLeft < 0) : return "Overdue"; break;
                        default : return `${Math.floor(timeLeft/60)} minutes left`; break;
                    }
                }
                else return this.status; 
            },
            updateTasksStatus(){
                if(!this.tasks.find(task => (!task.checked))) this.status = "Done";
                else {this.status = "Ongoing"; this.status = this.getStatus()};
            },
            switchStatus(){
                if(this.status != "Done"){
                    this.status = "Done";
                    this.tasks.forEach(task => task.checked = true);
                }
                else {
                    this.status = "Ongoing";
                    this.status = this.getStatus();
                    
                    this.tasks.forEach(task => task.checked = false);
                }
                return this.status;
            } 
        //
        }

        const todoMethods = {...taskMix(), ...statusMix};

    const makeTodo = function(name, content = "", _dueDate, _priority = "Normal", status = "Ongoing"){
        
        
        const tasks = [];
        const todo = {
            ...noteMix(name, content),
            set dueDate(newDate){_dueDate = newDate},
            get dueDate(){return _dueDate},
            set priority(newPriority){
                _priority = newPriority;    
            },
            get priority(){return _priority},
            tasks,
            getType : ()  => "todo",
        };
        Object.setPrototypeOf(todo, todoMethods);

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
        get openedNote(){ return openedNote},
        get selectedNote(){ return selectedNote},
        focusBook,
        getBookFromID,
        getOpenedBookFromID,
        getBookNoteFromID,
        getSelectedNoteFromID,
        getOpenedNoteFromID,
        deleteBook,
        deleteNote,
        debugVar : "", 
    }
    
})();

export {model};