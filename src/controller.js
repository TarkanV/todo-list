
import {model} from "./model.js";
import {view} from "./view.js";

//Test Books
const myStack = model.defaultBook.makeBook("First Book");
const myBook = model.defaultBook.makeBook("Book 2");
myBook.makeNote("How to make a bomb", `- First take powder
- Spread that shit on your face
- Finish`,
)
 
let book1 = model.defaultBook.makeBook("Book 1");
book1.makeNote("The Enchanted Forest", "Amidst the whispering leaves, magical creatures roam.");
book1.makeNote("Echoes of Eternity", "A tale of time travel and cosmic secrets.");
book1.makeNote("Sapphire Skies", "A journey through dreamscapes and starlit realms.");
book1.makeNote("Crimson Chronicles", "Blood, betrayal, and the rise of a fallen hero.");
book1.makeNote("Whispers in the Wind", "Mysteries unfold with every breeze in a quaint village.");


//Note Sample
myBook.makeNote("Great Sailor", "The great sailor was a well known sailor who has conquered all the seas.");
let todo = myBook.makeTodo("Muscu Time", "Schedule");

myBook.makeNote("Chronicles of the Celestial Pirate", "A spacefaring rogue seeks treasure beyond the stars.");
myBook.makeNote("The Alchemist's Daughter", "Potions, destiny, and the power of a hidden lineage.");
myBook.makeNote("Eclipse of Empires", "Worlds collide as empires clash under an ancient prophecy.");
myBook.makeNote("Songbird's Lament", "The music that awakens magic and changes destinies.");
myBook.makeNote("Sands of Serendipity", "In the desert's embrace, a lost city reveals its secrets.");
//




const controller = (function(){
    const loadAllBooks = function(){
        view.loadBookHierarchy(model.defaultBook);
    }

    const handleBookEvents = function(){
        view.setBookCollapsing();
        view.setOpenedBook(model.getOpenedBookFromID);
        console.log(myBook);
    }
    return{
        loadAllBooks,
        handleBookEvents,   
    }
})();

controller.loadAllBooks();
controller.handleBookEvents();

