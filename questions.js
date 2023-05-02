const db = require('./server.js')
const questions = [{
    type:"list",
    message: "Please choose what you would like to do",
    name:"firstPrompt",
    choices:['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
},
{ //ADD DEPARTMENT
    type:"input",
    message:"Please choose which department you would like to add",
    name:"addDepartment",
    when: (answers) => {
        if (answers.firstPrompt === 'View all departments'){
        
        }
    }

},
{ // ADD ROLE
    type:"input",
    message:"Please enter the name, salary, and department for the new role",
    name:"addRole",
    when: (answers) => {
        if (answers.firstPrompt === 'Add a role'){
            return true;
        }
    }
}, 
{ //ADD EMPLOYEE
    type:"input",
    message:"Please enter the employee’s first name, last name, role, and manager,",
    name:"addEmployee",
    when: (answers) => {
        if (answers.firstPrompt === 'Add an employee'){
            return true;
        }
    }
},
{ //UPDATE EMPLOYEE ROLE
    type:"choice",
    message:"Please choose which employee you want to update",
    name:"updateEmployee",
    when: (answers) => {
        if (answers.addPrompt === 'Add an employee'){
            return true;
        }
    }
}
]


module.exports = questions