// Get elements from the HTML

const itemInput = document.getElementById("itemInput");
const priceInput = document.getElementById("priceInput");
const addButton = document.getElementById("addButton");
const shoppingList = document.getElementById("shoppingList");
const totalPrice = document.getElementById("totalPrice");
const clearButton = document.getElementById("clearButton");
const emptyMessage = document.getElementById("emptyMessage");


// Store the total price

let total = 0;


// Add Item Function

function addItem() {

    // Get the values entered by the user

    const itemName = itemInput.value.trim();
    const itemPrice = Number(priceInput.value);


    // Check if item name is empty

    if (itemName === "") {

        alert("Please enter an item name.");

        return;
    }


    // Check if price is valid

    if (itemPrice <= 0 || isNaN(itemPrice)) {

        alert("Please enter a valid price.");

        return;
    }


    // Create a new list item

    const listItem = document.createElement("li");

    listItem.className = "shopping-item";


    // Create item name

    const nameSpan = document.createElement("span");

    nameSpan.className = "item-name";

    nameSpan.textContent = itemName;


    // Create price

    const priceSpan = document.createElement("span");

    priceSpan.className = "item-price";

    priceSpan.textContent = `₦${itemPrice.toFixed(2)}`;


    // Create delete button

    const deleteButton = document.createElement("button");

    deleteButton.className = "delete-btn";

    deleteButton.textContent = "Delete";


    // Delete item when button is clicked

    deleteButton.addEventListener("click", function () {

        listItem.remove();

        total = total - itemPrice;

        updateTotal();

        checkEmptyList();

    });


    // Add everything to the list item

    listItem.appendChild(nameSpan);

    listItem.appendChild(priceSpan);

    listItem.appendChild(deleteButton);


    // Add item to shopping list

    shoppingList.appendChild(listItem);


    // Add price to total

    total = total + itemPrice;


    // Update total

    updateTotal();


    // Clear input fields

    itemInput.value = "";

    priceInput.value = "";


    // Put cursor back in item input

    itemInput.focus();


    // Hide empty message

    checkEmptyList();
}


// Update Total Function

function updateTotal() {

    totalPrice.textContent = `₦${total.toFixed(2)}`;
}


// Check whether list is empty

function checkEmptyList() {

    if (shoppingList.children.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";
    }
}


// Add button event

addButton.addEventListener("click", addItem);


// Clear All button

clearButton.addEventListener("click", function () {

    shoppingList.innerHTML = "";

    total = 0;

    updateTotal();

    checkEmptyList();

});