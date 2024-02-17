const fns = require("date-fns");

const storageModel = (function(){
    
    const defaultData = {
        name: "Memobooks",
        children: [
            {
                name: "Example Book",
                children: [
                    {
                        name: "Example Note",
                        modifiedDate: "2023-10-17T13:20:24.437Z",
                        content: "Example text.",
                        type: "note",
                    },
                    {
                        name: "Example Todo",
                        modifiedDate: "2023-10-17T13:21:23.637Z",
                        dueDate: "2023-10-18T10:21:00.000Z",
                        priority: "Normal",
                        status: "Tomorrow",
                        content: "",
                        tasks: [
                            { content: "Example Task ", checked: false },
                            { content: "Example Checked Task ", checked: true },
                        ],
                        type: "todo",
                    },
                    {
                        name: "Example Completed Todo",
                        modifiedDate: "2023-10-17T15:17:38.409Z",
                        dueDate: "2023-09-18T13:17:00.000Z",
                        priority: "High",
                        status: "Done",
                        content: "",
                        tasks: [],
                        type: "todo",
                    },
                ],
                type: "book",
            },
        ],
        type: "book",
    };

    const convertNote = function(note){
        
        return{
            name: note.name,
            modifiedDate : note.modifiedDate.toISOString(),
            content : note.content,
            type : note.getType(),
        }
    }
    const convertTodo = function(todo){
       
        return{
            name: todo.name,
            modifiedDate : todo.modifiedDate.toISOString(),
            dueDate : todo.dueDate.toISOString(),
            priority : todo.priority,
            status : todo.getStatus(),
            content : todo.content,
            tasks : todo.tasks.map(task => convertTask(task)),
            type : todo.getType(),
        }
    }
    const convertTask = function(task){
        return{
            content : task.content,
            checked : task.checked,
        }
    }

    const convertBook = function(book){
       
        const dataBook = {
            name : book.name,
            children : book.children.map(child => {
                switch(child.getType()){
                    case "book" : return convertBook(child);
                    case "note" : return convertNote(child);
                    case "todo" : return convertTodo(child);
                }
            }),
            type : book.getType(),
            
        }
        
        return dataBook;

    } 
    const convertModel = function(root){
        
        return JSON.stringify(convertBook(root));
    }
    const saveModelData = function(modelRoot){
        
        localStorage.setItem("myTodoData", convertModel(modelRoot));
    }

    const loadItem = function(item, modelBook){
        switch(item.type){
            case "book" :  
                let book;
                if(item.name == "Memobooks")
                    book = modelBook;
                else
                    book = modelBook.makeBook(item.name);
                if(item.children.length){
                    item.children.forEach(child => {
                        loadItem(child, book);
                    });
                }
            break;
            case "note" :
                
                
                const note = modelBook.makeNote(item.name, item.content, 
                    fns.parseISO(item.modifiedDate));
                    
            break;
            case "todo" :
                
                const todo = modelBook.makeTodo(item.name, item.content, item.priority,
                    fns.parseISO(item.dueDate), fns.parseISO(item.modifiedDate), item.status);
                
                    if(item.tasks.length){
                        item.tasks.forEach(task =>{
                            todo.makeTask(task.content, task.checked);
                        })
                    }
            break;
            
        }
    }
    const loadDataToModel = function(model){
        if(localStorage.getItem("myTodoData")){
            const rootItem = JSON.parse(localStorage.getItem("myTodoData"));
            loadItem(rootItem, model.defaultBook);
        }else{
            //const rootItem = JSON.parse(defaultData);
            loadItem(defaultData, model.defaultBook);

        }
    }
    return{
        saveModelData,
        loadDataToModel,
    }
})();

export {storageModel};