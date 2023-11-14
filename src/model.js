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
        id: "M", 
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
        const targetNote = book.children.find(note => note.id == noteID);
        return targetNote;
    }
    const getSelectedNoteFromID = function(selectedNoteID){
           
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
        for(let i = 0; i < book.children.length; i++){
            const child = book.children[i];
            if(child.getType() != "book"){
                
                
                let allID;
                if(child.getType()  == "note"){
                    allID = defaultNotes.children.findIndex((childID) => childID == child.id);
                    defaultNotes.children.splice(allID, 1);
                }
                else if(child.getType()  == "todo"){
                    allID = defaultTodos.children.findIndex((childID) => childID == child.id);
                    defaultTodos.children.splice(allID, 1);
                }
                
                
            }
            else{
                child.splice(book.children[i], 1);
                deleteBook(child.id);
            }
        }

        const parentBook = book.parent;
        const childIDX = parentBook.children.indexOf(book);
        const listChildIDX = bookList.indexOf(book);
        
        bookList.splice(listChildIDX, 1);
        parentBook.children.splice(childIDX, 1);
        
    };

    const noteMix = function(name, content, modifiedDate){
        
        return {
            name,
            id: ++refNoteID,
            modifiedDate,
            formattedModifiedDate : function() {
                return{
                    date : modifiedDate.toLocaleDateString(), 
                    time : modifiedDate.toLocaleTimeString()
                }
            },
            content,
        }
    };

    const makeNote = function(name, content = "", modifiedDate = new Date()){ 
        const note = {
            ...noteMix(name, content, modifiedDate),      
            getType : () => "note",
        }
        this.add(note);
        defaultNotes.children.push(note);
        return note;
    }


        const taskMix = function(){
            //Task Stuff
            let refTaskID = -1;
            const makeTask = function(content, _checked = false){
                ++refTaskID;
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

        

        const statusMix = function(status) {
            return {
                //Status Functions
                setStatus(){
                    status = this.getStatus();
                },
                getStatus(){
                    
                    if(status != "Done"){
                        let daysLeft = fns.differenceInCalendarDays(this.dueDate, new Date());
                        let secLeft = fns.differenceInSeconds(this.dueDate, new Date());
         
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
                    
                        return status;
                    }
                },
                getPreciseStatus(){
                    if(status != "Done"){
                        let timeLeft = fns.differenceInSeconds(this.dueDate, new Date());
                        
                        switch(true){        
                            case (timeLeft < 0) : return "Overdue"; break;
                            default : return `${Math.floor(timeLeft/60)} minutes left`; break;
                        }
                    }
                    else return status; 
                },
                updateTasksStatus(){
                    if(!this.tasks.find(task => (!task.checked))) status = "Done";
                    else {status = "Ongoing"; status = this.getStatus()};
                },
                switchStatus(){
                    if(status != "Done"){
                        status = "Done";
                        this.tasks.forEach(task => task.checked = true);
                    }
                    else {
                        status = "Ongoing";
                        status = this.getStatus();
                        
                        this.tasks.forEach(task => task.checked = false);
                    }
                    return status;
                } 
            //
            }
        }
        const todoMethods = {...taskMix()};

    const makeTodo = function(name, content = "", _priority = "Normal", _dueDate, modifiedDate = new Date(), status = "Ongoing"){
        

        const tasks = [];
        const todo = {
            ...noteMix(name, content, modifiedDate),
            ...statusMix(status),
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