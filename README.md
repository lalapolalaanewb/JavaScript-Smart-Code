# Budget Web App

Calculate budget and display your incomes and expenses in values and percentages.

## Getting Started

Below instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

- Once all needed software and installation done:-
 - import your 'Project Folder' into your Visual Studio Code Workspace
  - go to 'File' on the top-menu-bar left most-side
  - and click on 'Add Folder to Wordspace' option
 - manuever inside your starter/final folder
  - right click on the index.html file
  - choose and click on 'Open with Live Server' (your system is Live and ready to go)
- Refer to topic 'Step By Step Guides' to know what should you do first (can be seen below)

### Prerequisites

Software you need to install:-
- Visual Studio Code at [Visual Studio Code](https://code.visualstudio.com/)
 - or you can choose any Code Editor to your liking
- Download Extension (on Visual Studio Code only)
 - Live Server (you don't need to refresh your page over and over again after changes made)

```
// Visual Studio Code Installation
Go to Visual Studio Code link above and choose download according to your machine type (choose the **stable** version):-
- Window, go for Windows Installer
- MacOS, go for MacOS Installer
- Linux, go for Linux Installer
```

### Installing

Please follow the step below to get the system running

1. Download Extension (on Visual Studio Code only)
 - Live Server (you don't need to refresh your page over and over again after changes made)

```
// Extension Installation
Go to 'View' on top-bar-menu. And click on 'Extensions' on your Visual Code Studio:-
- in the placeholder (on the left-mesnu-sidebar), search for 'Live Server'
- choose and click on Live Server by Ritwick Dey 
- then click install

```

## Important Notes

1. This project contain 2 main folders:-
 - starter (contain starter codes and files needed)
 - final (contain a complete working web app - finished code)
2. This project aims to teach you how to code your JavaScript codes more neat and smart.
3. This project will not cover the part of designing and implementing or coding of the UI.

## Step By Step Guides

- [ ] Update Month and Year
- [ ] Change color of 'div class = middle_part-content' (the one contain all inputs) to:-
 - 'blue' if selected option is equal to '+' or 'inc'
 - 'pink' if selected option is equal to '-' or 'exp'
- [ ] Create an Object of Budget's data to store required data such as:-
 - array of all items (income & expenses). Where each array contain:-
  - id
  - description
  - value
  - percentage (for expenses only)
 - totals of incomes & expenses
 - overall budget
 - overall percentage
- Add New Item
 - [ ] get values from input fields
 - [ ] do validation (simple NULL validation)
 - [ ] add new item (income/expneses) to data storage (push)
 - [ ] display new item in UI (HTML template)
 - [ ] refocus and clear input fields
 - calculate budget
  - [ ] calculate totals income
  - [ ] calculate totals expenses
  - [ ] calculate overall budget
  - [ ] calculate overall expenses percentage
 - display new item (income/expenses)
  - [ ] display total/overall budget
   - [ ] change font color according to (+ => blue, - => pink)
  - [ ] display totals income
  - [ ] dispay totals expenses
  - [ ] display totals expenses percentage
 - [ ] calculate percentage of each expenses
 - [ ] display percentage of each expenses
- Delete Item
 - [ ] remove data from Budget's data storage (remove from array according to item type)
 - [ ] remove displaying the deleted data from the UI. [removeChild()](https://blog.garstasio.com/you-dont-need-jquery/dom-manipulation/#removing-elements)
 - calculate budget
  - [ ] calculate totals income
  - [ ] calculate totals expenses
  - [ ] calculate overall budget
  - [ ] calculate overall expenses percentage
 - display new item (income/expenses)
  - [ ] display total/overall budget
   - [ ] change font color according to (+ => blue, - => pink)
  - [ ] display totals income
  - [ ] dispay totals expenses
  - [ ] display totals expenses percentage
 - [ ] calculate percentage of each expenses
 - [ ] display percentage of each expenses

## Deployment

No additional support on how to deploy on live system for this project.

## Built With

* Vanilla JavaScript (*No Front-end Framework Use*) 

## Authors

* **Lalapolalaa Newb**

## Acknowledgments

These are some of the online sources which I learnt from. You may do so as well.

* [Academind](https://www.youtube.com/channel/UCSJbGtTlrDami-tDGPUV9-w)
* [Online Tutorials](https://www.youtube.com/channel/UCbwXnUipZsLfUckBPsC7Jog)
* [Traversy Media](https://www.youtube.com/channel/UC29ju8bIPH5as8OGnQzwJyA)
* [DevEd](https://www.youtube.com/channel/UClb90NQQcskPUGDIXsQEz5Q)
* [Web Dev Simplifies](https://www.youtube.com/channel/UCFbNIlppjAuEX4znoulh0Cw)
* [DesignCourse](https://www.youtube.com/channel/UCVyRiMvfUNMA1UPlDPzG5Ow)
* [Coding Addict](https://www.youtube.com/channel/UCMZFwxv5l-XtKi693qMJptA)
* [The Net Ninja](https://www.youtube.com/channel/UCW5YeuERMmlnqo4oq8vwUpg)

