// used to save and load this shopping list in the browser
const STORAGE_KEY = "shopping-list-items";

// restore the saved list, or start with an empty list if nothing is saved yet
let shoppinglist = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// save the current shopping list so it is available after a page reload
function saveItems() {
    // convert the array into text because localStorage stores string values
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shoppinglist));
}


// the input where the user types an item's name
const nameInput = document.getElementById("itemname");
// find the input where the user enters an item's price
const priceInput = document.getElementById("itemprice");
// find the button used to add a new item
const addButton = document.getElementById("addButton");
// find the list element where shopping items will be displayed
const shoppingListElement = document.getElementById("shoppinglist");
// find the button that marks every item as purchased
const markPurchasedButton = document.getElementById("markPurchased");
// find the button that removes all items from the list
const clearButton = document.getElementById("clearlist");
// find the page element that displays the current total cost
const totalCostElement = document.getElementById("totalcost");



// rebuild the visible shopping list using the current array of items
function displayItems() {
    // remove existing rows so the list can be drawn again from current data
    shoppingListElement.innerHTML = "";

    // create and display one list row for each item in the array
    shoppinglist.forEach((item, index) => {
        // make a new list row for this shopping item
        const listItem = document.createElement("li");

        // apply the purchased style when this item has been bought
        if (item.purchased) {
            // the CSS can use this class to visually distinguish purchased items
            listItem.classList.add("purchased");
        }

        // create a span to show the item's name and price
        const itemDetails = document.createElement("span");
        // set the text safely and format the price to two decimal places
        itemDetails.textContent =
            `${item.name} - KSh ${item.price.toFixed(2)}`;

        // create a button that toggles this item's purchased status
        const purchaseButton = document.createElement("button");
        // show "Undo" for purchased items, otherwise offer to mark it purchased
        purchaseButton.textContent = item.purchased
            ? "Undo"
            : "Mark Purchased";

        // respond when the user clicks this item's purchase button
        purchaseButton.addEventListener("click", function () {
            // flip the current purchased value between true and false
            item.purchased = !item.purchased;
            // save the updated status so it persists across reloads
            saveItems();
            // redraw the list to show the updated button and purchased style
            displayItems();
        });

        // add the item's name and price to its row
        listItem.appendChild(itemDetails);
        // add the purchase toggle button to its row
        listItem.appendChild(purchaseButton);
        // add the finished row to the visible shopping list
        shoppingListElement.appendChild(listItem);
    });

    // refresh the displayed total after drawing the item rows
    updateTotalCost();
}

// calculate and display the total cost of items that have not been purchased
function updateTotalCost() {
    // keep only items still to buy, then add together their prices
    const total = shoppinglist
        .filter(item => !item.purchased)
        .reduce((sum, item) => sum + item.price, 0);

    // show the total in Kenyan shillings with two decimal places
    totalCostElement.textContent =
        `Total cost: KSh ${total.toFixed(2)}`;
}

// add a new item when the user clicks the Add button
addButton.addEventListener("click", function () {
    // trim whitespace from the name so a blank-spaces-only name is rejected
    const itemname = nameInput.value.trim();
    // convert the entered price from text to a number
    const price = Number(priceInput.value);

    // check that the name is present and the price is valid and greater than zero
    if (
        itemname === "" ||
        priceInput.value.trim() === "" ||
        !Number.isFinite(price) ||
        price <= 0
    ) {
        // tell the user how to correct invalid or missing form values
        alert("Please enter an item name and a valid price.");
        // stop here instead of adding an invalid item
        return;
    }

    // add a new, not-yet-purchased item to the in-memory shopping list
    shoppinglist.push({
        // store the trimmed item name
        name: itemname,
        // store the numeric price
        price: price,
        // new items begin in the not-purchased state
        purchased: false
    });

    // persist the updated list
    saveItems();
    // redraw the rows and total to include the new item
    displayItems();

    // clear the name input ready for the next item
    nameInput.value = "";
    // clear the price input ready for the next item
    priceInput.value = "";
});

// mark every item as purchased when the corresponding button is clicked
markPurchasedButton.addEventListener("click", function () {
    // set each item's purchased status to true
    shoppinglist.forEach(item => {
        item.purchased = true;
    });

    // save all the status changes
    saveItems();
    // redraw the list and update the total
    displayItems();
});

// remove every item when the Clear List button is clicked
clearButton.addEventListener("click", function () {
    // empty the existing array while keeping its reference unchanged
    shoppinglist.length = 0;

    // save the now-empty list to replace any previously stored items
    saveItems();
    // redraw the empty list and reset the displayed total
    displayItems();
});

// show saved items and calculate the total as soon as the script runs
displayItems();
