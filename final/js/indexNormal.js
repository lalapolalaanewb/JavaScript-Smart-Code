// 4. Delete Existing Item
let deleteExistingItem = (event) => {
    let itemTypeID

    // get Item ID using event target
    itemTypeID = event.target.parentNode.parentNode.id

    // if item ID valid
    if(itemTypeID) {
        // split by item type & item ID
        let splitID = itemTypeID.split('-')

        // assign item type
        let itemType = splitID[0]

        // assign item ID - and make sure it's in integer value
        let itemID = +splitID[1]

        // 1. delete item in storage
        // - get all IDs according to item type
        let ids = data.allItems[itemType].map(item => item.id)
        // - check if itemID is present or not (if not it will return '-1', if 'have' it will return the value associates with itemID passed into the 'indexOf')
        let itemIndex = ids.indexOf(itemID)
        // - delete item if itemID !== -1 or SAME
        if(itemIndex !== -1) {
            // using splice(x, y) : x = starting at item what you want to delete, y = how many item want to delete
            data.allItems[itemType].splice(itemIndex, 1)
        }

        // 2. remove deleted Item from UI
        let element2Delete = document.getElementById(itemTypeID)
        element2Delete.parentNode.removeChild(element2Delete)

        // 3. update budget
        updateBudget()

        // 4. update expenses percentage
        updateExpensesPercentages()
    }
}

// 3.1 Function to handle adding new items
let addNewItems = () => {
    // 1. get user inputs
    let input = getValuesUserInputted(); // console.log(input)

    // 2. validate user inputs
    if(input.itemDesc !== '' && !isNaN(input.itemValue) && input.itemValue > 0) {
        // 2.1 add new item to storage
        let newItem = (() => {
            let id, newItem

            // 1. create id for new added item
            if(data.allItems[input.itemType].length > 0) {
                id = data.allItems[input.itemType][data.allItems[input.itemType].length - 1].id + 1
            } else {
                id = 0
            }

            // 2. create new item according to 'item type' (income or expenses)

            if(input.itemType === 'income') {
                // create new item of Income
                newItem = new Income(id, input.itemDesc, input.itemValue)
            } else {
                // create new item of Expenses
                newItem = new Expenses(id, input.itemDesc, input.itemValue)
            } // console.log(newItem)

            // 3. insert and store new item data into storage
            data.allItems[input.itemType].push(newItem)

            // 4. return new item data
            return newItem
        })(); 
        console.log(data.allItems.income)

        // 2.2 update & display new added items in UI
        let addItem2UI = (() => {
            let htmlTemplate, contentList

            // update and create HTML Template according to Item Type
            if(input.itemType === 'income') {
                // specify the DOM for income list
                contentList = allDOMStrings().incomeList

                htmlTemplate = `
                <div class="income_list-detail" id="income-${newItem.id}">
                    <!-- income desc -->
                    <div class="detail-income_desc">${newItem.description}</div>
                    <!-- income value -->
                    <div class="detail-income_value">${numberFormat(newItem.value, input.itemType)}</div>
                    <!-- income delete -->
                    <div class="detail-income_delete"><p></p></div>
                </div>
                `
            } else {
                // specify the DOM for income list
                contentList = allDOMStrings().expensesList

                htmlTemplate = `
                <div class="expenses_list-detail" id="expenses-${newItem.id}">
                    <!-- expenses desc -->
                    <div class="detail-expenses_desc">${newItem.description}</div>
                    <!-- expenses value -->
                    <div class="detail-expenses_value">${numberFormat(newItem.value, input.itemType)}</div>
                    <!-- expenses percentage -->
                    <div class="detail-expenses_percentage">0%</div>
                    <!-- expenses delete -->
                    <div class="detail-expenses_delete"><p></p></div>
                </div>
                `
            }

            // append HTML Template to UI
            document.querySelector(contentList).insertAdjacentHTML('beforeend', htmlTemplate)
        })();

        // 2.3 clear & refocus to desc input placeholder
        let clearAndRefocustoDescInput = (() => {
            // clear all input fields
            document.querySelector(allDOMStrings().contentItemDesc).value = ''
            document.querySelector(allDOMStrings().contentItemValue).value = ''

            // refocus to desc input placeholder
            document.querySelector(allDOMStrings().contentItemDesc).focus()
        })();

        // 2.4 update budget (calculate & display)
        updateBudget()

        // 2.5 update expenses percentage (calculate & display)
        updateExpensesPercentages()
    }
}

// update expenses percentage (calculate & display)
let updateExpensesPercentages = () => {
    // - calculate every expenses percentage
    let calcExpensesPercentages = (percentage, value, totalIncomes) => {
        if(totalIncomes > 0) { // if 'has' incomes, then calculate
            percentage = Math.round((value / totalIncomes) * 100)
        } else { // if 'don't have' income yet, then just set to '-1'
            percentage = -1
        }

        return percentage
    }

    // update through all single expenses percentage
    data.allItems.expenses.forEach(expense => {
        // calculate every expenses percentage
        let percentage = calcExpensesPercentages(expense.percentage, expense.value, data.totals.income)
        
        // update current percentage
        expense.percentage = percentage
    })
    // console.log(data.allItems.expenses)

    // - get all HTML element class that gonna contain the percentage of each expenses - 'detail-expenses_percentage'
    let allExpensesPercentageHTMLElement = document.querySelectorAll(allDOMStrings().expensePercentage)

    // - loop through all list of Expenses HTML Element Available and display each expenses percentage
    for(let i = 0; i < data.allItems.expenses.length; i++) {
        if(data.allItems.expenses[i].percentage > 0) {
            allExpensesPercentageHTMLElement[i].textContent = data.allItems.expenses[i].percentage + '%'
        } else {
            allExpensesPercentageHTMLElement.textContent = '---'
        }
    }
}

// update budget (calculate & display)
let updateBudget = () => {
    // calculate total income
    let totalIncome = (() => {
        let sum = 0

        data.allItems.income.forEach(current => sum = sum + +current.value)

        // update & insert new total value into total.income
        data.totals.income = sum 
    })();

    // calculate total income
    let totalExpenses = (() => {
        let sum = 0

        data.allItems.expenses.forEach(current => sum = sum + +current.value)

        // update & insert new total value into total.income
        data.totals.expenses = sum 
    })();
    
    // calculate & update overall budget
    data.overallBudget = +data.totals.income - +data.totals.expenses
    
    // calculate percentage of 'spent' income
    if(data.totals.income > 0) { // if 'has' income, then calculate & update overall percentage
        data.overallPercentage = Math.round((data.totals.expenses / data.totals.income) * 100)
    } else { // if 'don't have', then just give value of -1
        data.overallPercentage = -1
    }

    // display budget
    let displayBudget = (() => {
        // added for format number of ovearll budget
        let typeOfItem

        if(data.overallBudget > 0) {
            typeOfItem = 'income'
            
            // change color of text overall budget to blue
            document.querySelector(allDOMStrings().overallBudget).classList.remove('color_exp')
            document.querySelector(allDOMStrings().overallBudget).classList.add('color_inc')  
        } else {
            typeOfItem = 'expenses'

            // change color of text overall budget to pink
            document.querySelector(allDOMStrings().overallBudget).classList.remove('color_inc')
            document.querySelector(allDOMStrings().overallBudget).classList.add('color_exp')
        }

        // update and diplay overall budget on UI
        document.querySelector(allDOMStrings().overallBudget).textContent = numberFormat(data.overallBudget, typeOfItem)

        // update and display total income value in UI
        document.querySelector(allDOMStrings().totalIncomeValue).textContent = numberFormat(data.totals.income, 'income')

        // update and display total expenses value in UI
        document.querySelector(allDOMStrings().totalExpensesValue).textContent = numberFormat(data.totals.expenses, 'expenses')

        // display overall percentage
        if(data.overallPercentage > 0) { // if overall percentage !== '-1', then display
            document.querySelector(allDOMStrings().overallPercentage).textContent = `${data.overallPercentage}%`
        } else { // if overall percentage === '-1', then display something else
            document.querySelector(allDOMStrings().overallPercentage).textContent = `---`
        }
    })();
}

// C. all Budget data
// object of data
let data = {
    // contain all items type
    allItems: {
        // income array
        income: [],
        // expenses array
        expenses: []
    },
    // totals of each item type
    totals: {
        // income total
        income: 0, // init 0
        // expenses total
        expenses: 0
    },
    // overall budget
    overallBudget: 0,
    // overall percentage
    overallPercentage: -1 // '-1' represent 'not in existance yet' 
}

// declaration of incomes data/attributes
let Income = function(id, description, value) {
    this.id = id
    this.description = description
    this.value = value
}

// declaration of incomes data/attributes
let Expenses = function(id, description, value) {
    this.id = id
    this.description = description
    this.value = value
    this.percentage = -1 // '-1' represent 'not in existance yet'
}

// number formatting
let numberFormat = (value, itemType) => {
    // turn to absolute number. Ignoring '+' or '-' sign
    value = Math.abs(value)

    // add 2 decimal points
    value = value.toFixed(2)

    let splitNo, frontNo, backNo

    // split the 'value' into 2 parts
    splitNo = value.split('.')

    // assign front part of no (situated before '.') to 'forntNo' var
    frontNo = splitNo[0]

    // - put ',' on thousand value
    if(frontNo.length > 3) {
        frontNo = frontNo.substr(0, frontNo.length - 3) + ',' + frontNo.substr(frontNo.length -3, 3)
    }

    // assign back part of no (situated after '.') to 'backNo' var
    backNo = splitNo[1]

    // return right combination of value according to item type
    return (itemType === 'income' ? sign = '+' : sign = '-') + ' ' + frontNo + '.' + backNo
}

// B. all DOM String
let allDOMStrings = () => {
    let DOMStrings = {
        dateNow: '.date_now',
        contentItemType: '.content-item_type',
        middlePartContent: '.middle_part-content',
        contentItemDesc: '.content-item_desc',
        contentItemValue: '.content-item_value',
        submitBtn: '.content-item_submit',
        incomeList:'.content-income_list',
        expensesList: '.content-expenses_list',
        overallBudget: '.content-total_budget',
        totalIncomeValue: '.income-total_value',
        totalExpensesValue: '.expenses-total_value',
        overallPercentage: '.expenses-total_percentage',
        expensePercentage: '.detail-expenses_percentage',
        allItemList: '.bottom_part-content'
    }

    return DOMStrings
}

// 3. Function to get/read values input by user
let getValuesUserInputted = () => {
    let itemType, itemDesc, itemValue

    // get selection input value
    itemType = document.querySelector(allDOMStrings().contentItemType).value

    // get description input value
    itemDesc = document.querySelector(allDOMStrings().contentItemDesc).value

    // get number/value input value
    itemValue = document.querySelector(allDOMStrings().contentItemValue).value

    return { itemType, itemDesc, itemValue }
}

// 2. Function to change inputs container background color according to selection made
let changeInputsContainerBG = () => {
    // add EventListener of 'change'
    document.querySelector(allDOMStrings().contentItemType).addEventListener('change', () => {
        // toggle adding/removing class
        document.querySelector(allDOMStrings().middlePartContent).classList.toggle('bg_color_change')
    })
}

// 1. Function to update Month and Year
let updateMonthAndYear = () => {
    let current, month, months, year

    // get current Date
    current = new Date()

    // create array of months
    months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    // get current month
    month = current.getMonth()
    // get current Year
    year = current.getFullYear()

    // display on UI
    document.querySelector(allDOMStrings().dateNow).textContent = `${months[month]} ${year}`
}

// A. excute all functions accordingly
let functionsExecution = (() => {
    // 1. Update Month & Year
    updateMonthAndYear()

    // 2. Change inputs container background color according to selection made
    changeInputsContainerBG()

    // 3. Add new item - Event Listener of 'click' on Submit Button
    document.querySelector(allDOMStrings().submitBtn).addEventListener('click', addNewItems)

    // 3.1 Add new when user hit key 'Enter'
    document.addEventListener('keydown', event => {
        // when user pressed 'enter' to insert new income or expenses
        if(event.keyCode === 13 || event.which === 13) {

            // call function to add item function
            addNewItems()
        } 
    })

    // 4. Delete item
    document.querySelector(allDOMStrings().allItemList).addEventListener('click', deleteExistingItem)
})();