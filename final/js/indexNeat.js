// A. Model Controller - dealing with Data
let modelController = (() => {
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

    // calculate Totals
    let calculateTotals = (itemType) => {
        let sum = 0

        data.allItems[itemType].forEach(current => sum = sum + +current.value)

        // update & insert new total value into total.income
        data.totals[itemType] = sum
    }

    // - calculate every expenses percentage
    let calcExpensesPercentages = (percentage, value, totalIncomes) => {
        if(totalIncomes > 0) { // if 'has' incomes, then calculate
            percentage = Math.round((value / totalIncomes) * 100)
        } else { // if 'don't have' income yet, then just set to '-1'
            percentage = -1
        }

        return percentage
    }

    return {
        // delete item in storage
        deleteItemInStorage: (itemType, itemID) => {
            // - get all IDs according to item type
            let ids = data.allItems[itemType].map(item => item.id)
            // - check if itemID is present or not (if not it will return '-1', if 'have' it will return the value associates with itemID passed into the 'indexOf')
            let itemIndex = ids.indexOf(itemID)
            // - delete item if itemID !== -1 or SAME
            if(itemIndex !== -1) {
                // using splice(x, y) : x = starting at item what you want to delete, y = how many item want to delete
                data.allItems[itemType].splice(itemIndex, 1)
            }
        },

        // get all single expenses percentage
        getAllSingleExpensesPercentage: () => {
            return data.allItems.expenses.map(expense => expense.percentage)
        },

        // calculate all single expenses percentage
        calculateAllSingleExpensesPercentage: () => {
            // update through all single expenses percentage
            data.allItems.expenses.forEach(expense => {
                // calculate every expenses percentage
                let percentage = calcExpensesPercentages(expense.percentage, expense.value, data.totals.income)
                
                // update current percentage
                expense.percentage = percentage
            })
        },

        // get budget data
        getBudget: () => {
            return {
                totalIncome: data.totals.income,
                totalExpenses: data.totals.expenses,
                overallBudget: data.overallBudget,
                overallPercentage: data.overallPercentage
            }
        },

        // calculate total income & expenses
        calculateAll: () => {
            // 1. calculate Totals
            // - calculate & get Total Income
            calculateTotals('income')
            // - calculate & get Total Expenses
            calculateTotals('expenses')

            // 2. calculate Overall Budget
            data.overallBudget = +data.totals.income - +data.totals.expenses

            // 3. calculate percentage of 'spent' income
            if(data.totals.income > 0) { // if 'has' income, then calculate & update overall percentage
                data.overallPercentage = Math.round((data.totals.expenses / data.totals.income) * 100)
            } else { // if 'don't have', then just give value of -1
                data.overallPercentage = -1
            }
        },

        // add new item to storage
        addItem2Storage: (input) => {
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
        }
    }
})();

// B. View Controller - dealing with UI
let viewController = (() => {
    // get all related DOMstrings
    const DOMStrings = {
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

    return {
        // remove deleted Item from UI
        removeDeletedItemFromUI: (itemTypeID) => {
            let element2Delete = document.getElementById(itemTypeID)
            element2Delete.parentNode.removeChild(element2Delete)
        },

        // display all single expenses percentage to UI
        displayAllSingleExpensesPercentage: (allSingleExpensesPercentage) => {
            // - get all HTML element class that gonna contain the percentage of each expenses - 'detail-expenses_percentage'
            let allExpensesPercentageHTMLElement = document.querySelectorAll(DOMStrings.expensePercentage)

            // - loop through all list of Expenses HTML Element Available and display each expenses percentage
            for(let i = 0; i < allSingleExpensesPercentage.length; i++) {
                if(allSingleExpensesPercentage[i] > 0) {
                    allExpensesPercentageHTMLElement[i].textContent = allSingleExpensesPercentage[i] + '%'
                } else {
                    allExpensesPercentageHTMLElement.textContent = '---'
                }
            }
        },

        // display all to UI
        displayAll: (budgetData) => {
            // added for format number of ovearll budget
            let typeOfItem

            if(budgetData.overallBudget > 0) {
                typeOfItem = 'income'
                
                // change color of text overall budget to blue
                document.querySelector(DOMStrings.overallBudget).classList.remove('color_exp')
                document.querySelector(DOMStrings.overallBudget).classList.add('color_inc')  
            } else {
                typeOfItem = 'expenses'

                // change color of text overall budget to pink
                document.querySelector(DOMStrings.overallBudget).classList.remove('color_inc')
                document.querySelector(DOMStrings.overallBudget).classList.add('color_exp')
            }

            // update and diplay overall budget on UI
            document.querySelector(DOMStrings.overallBudget).textContent = numberFormat(budgetData.overallBudget, typeOfItem)

            // update and display total income value in UI
            document.querySelector(DOMStrings.totalIncomeValue).textContent = numberFormat(budgetData.totalIncome, 'income')

            // update and display total expenses value in UI
            document.querySelector(DOMStrings.totalExpensesValue).textContent = numberFormat(budgetData.totalExpenses, 'expenses')

            // display overall percentage
            if(budgetData.overallPercentage > 0) { // if overall percentage !== '-1', then display
                document.querySelector(DOMStrings.overallPercentage).textContent = `${budgetData.overallPercentage}%`
            } else { // if overall percentage === '-1', then display something else
                document.querySelector(DOMStrings.overallPercentage).textContent = `---`
            }
        },

        // clear & refocus to desc input placeholder
        clearAndRefocustoDescInput: () => {
            // clear all input fields
            document.querySelector(DOMStrings.contentItemDesc).value = ''
            document.querySelector(DOMStrings.contentItemValue).value = ''

            // refocus to desc input placeholder
            document.querySelector(DOMStrings.contentItemDesc).focus()
        },

        // update & display new added items in UI
        displayNewItem: (newItem, itemType) => {
            let htmlTemplate, contentList

            // update and create HTML Template according to Item Type
            if(itemType === 'income') {
                // specify the DOM for income list
                contentList = DOMStrings.incomeList

                htmlTemplate = `
                <div class="income_list-detail" id="income-${newItem.id}">
                    <!-- income desc -->
                    <div class="detail-income_desc">${newItem.description}</div>
                    <!-- income value -->
                    <div class="detail-income_value">${numberFormat(newItem.value, itemType)}</div>
                    <!-- income delete -->
                    <div class="detail-income_delete"><p></p></div>
                </div>
                `
            } else {
                // specify the DOM for income list
                contentList = DOMStrings.expensesList

                htmlTemplate = `
                <div class="expenses_list-detail" id="expenses-${newItem.id}">
                    <!-- expenses desc -->
                    <div class="detail-expenses_desc">${newItem.description}</div>
                    <!-- expenses value -->
                    <div class="detail-expenses_value">${numberFormat(newItem.value, itemType)}</div>
                    <!-- expenses percentage -->
                    <div class="detail-expenses_percentage">50%</div>
                    <!-- expenses delete -->
                    <div class="detail-expenses_delete"><p></p></div>
                </div>
                `
            }

            // append HTML Template to UI
            document.querySelector(contentList).insertAdjacentHTML('beforeend', htmlTemplate)
        },

        // get user inputs
        getValuesUserInputted: () => {
            let itemType, itemDesc, itemValue

            // get selection input value
            itemType = document.querySelector(DOMStrings.contentItemType).value

            // get description input value
            itemDesc = document.querySelector(DOMStrings.contentItemDesc).value

            // get number/value input value
            itemValue = document.querySelector(DOMStrings.contentItemValue).value

            return { itemType, itemDesc, itemValue }
        },

        // change inputs container background color according to selection made
        middlePartBGColorChange: () => {
            // toggle adding/removing class
            document.querySelector(DOMStrings.middlePartContent).classList.toggle('bg_color_change')
        },

        // display Current Date
        displayDate: () => {
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
            document.querySelector(DOMStrings.dateNow).textContent = `${months[month]} ${year}`
        },

        // share DOMStrings
        getDOMStrings: () => {
            return DOMStrings
        }
    }
})();

// C. Controller - dealing with code relation between both upper Controllers
let controller = ((modelCTRL, viewCTRL) => {
    let allEventListener = () => {
        // get all DOMStrings
        let DOM = viewCTRL.getDOMStrings()

        // 1. change inputs container background color according to selection made
        document.querySelector(DOM.contentItemType).addEventListener('change', viewCTRL.middlePartBGColorChange)

        // 2. Add new item - Event Listener of 'click' on Submit Button
        document.querySelector(DOM.submitBtn).addEventListener('click', addNewItems)

        // 2.1 Add new item when user hit key 'Enter'
        document.addEventListener('keydown', event => {
            // when user pressed 'enter' to insert new income or expenses
            if(event.keyCode === 13 || event.which === 13) {

                // call function to add item function
                addNewItems()
            } 
        })

        // 3. Delete item
        document.querySelector(DOM.allItemList).addEventListener('click', deleteExistingItem)
    }

    // update budget (calculate & display)
    let updateBudget = () => {
        // 1. calculate total income & expenses, overall budget and overall percentage
        modelCTRL.calculateAll()
        
        // 2. display total income & expenses, overall budget & overall percentage
        // - get budget data
        let budgetData = modelCTRL.getBudget()
        // - display all to UI
        viewCTRL.displayAll(budgetData)
    }

    // update expenses percentage (calculate & display)
    let updateExpensesPercentages = () => {
        // 1. calculate all single expenses percentage
        modelCTRL.calculateAllSingleExpensesPercentage()

        // 2. display all single expenses percentage
        // - get all single expenses percentage
        let allSingleExpensesPercentage = modelCTRL.getAllSingleExpensesPercentage()
        // - display all single expenses percentage to UI
        viewCTRL.displayAllSingleExpensesPercentage(allSingleExpensesPercentage)
    }

    // Add new item - Event Listener of 'click' on Submit Button
    let addNewItems = () => {
        // 1. get user inputs
        let input = viewCTRL.getValuesUserInputted()

        // 2. validate user inputs
        if(input.itemDesc !== '' && !isNaN(input.itemValue) && input.itemValue > 0) {
            // 2.1 add new item to storage
            let newItem = modelCTRL.addItem2Storage(input)

            // 2.2 update & display new added items in UI
            viewCTRL.displayNewItem(newItem, input.itemType)

            // 2.3 clear & refocus to desc input placeholder
            viewCTRL.clearAndRefocustoDescInput()

            // 2.4 update budget (calculate & display)
            updateBudget()

            // 2.5 update expenses percentage (calculate & display)
            updateExpensesPercentages()
        }
    }

    // Delete item
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
            modelCTRL.deleteItemInStorage(itemType, itemID)

            // 2. remove deleted Item from UI
            viewCTRL.removeDeletedItemFromUI(itemTypeID)

            // 3. update budget
            updateBudget()

            // 4. update expenses percentage
            updateExpensesPercentages()
        }
    }
    
    return {
        init: () => {
            // update & display Date
            viewCTRL.displayDate()

            // listen to all event happening
            allEventListener()
        }
    }
})(modelController, viewController);

controller.init()