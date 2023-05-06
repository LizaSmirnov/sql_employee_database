const { prompt } = require("inquirer");
const inquirer = require("inquirer");
const mysql = require('mysql2');
require("console.table");

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '4444',
        database: 'employees_db'
    },
    console.log(`connected to the employee_db database.`)
);

db.connect((err) => {
    if (err) throw err;
    console.log('connected as id ' + db.threadId);
    init();
});

function init() {
    prompt([
        {
            type: "list",
            message: "Please choose what you would like to do",
            name: "firstPrompt",
            choices: [
                'View all departments',
                'View all roles',
                'View all employees', 
                'Add a department', 
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Nothing'
            ]
        }
    ]).then(ans => {
        switch (ans.firstPrompt) {
            case 'View all departments':
                viewDept();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmp();
                break;
            case 'Add a department':
                addDept();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmp();
                break;
            case 'Update an employee role':
                updateRole();
                break;
            case 'Nothing':
                console.log('Okay then.');
                process.exit();
        }
    }).catch(err => console.error(err));
}

const viewDept = () => {
    db.query(`SELECT * FROM departments`, (err, results) => {
        if (err) {
            console.error(err)
        } else {
            console.table(results);
            init();
}
    })
}

const viewRoles = () => {
    db.query(`SELECT * FROM roles`, (err, results) =>{
        err ? console.error(err) : console.table(results);
        init();
    })
}

const viewEmp = () => {
    db.query(`SELECT * FROM employees`, (err, results) =>{
        err ? console.error(err) : console.table(results);
        init();
    })
}
//--------------------------------------------------------------//
//Addition prompts
const addDept = () => {
    inquirer
    .prompt([
        {
            type:"input",
            message:"Please choose a new department name you would like to add",
            name:"addDept"
        }
    ]).then(ans => {
        db.query(`INSERT INTO departments(department_name) VALUES(?)`, [ans.addDept], (err,results) =>{
            if(err){
                console.error(err)
            } else {
                db.query('SELECT * FROM departments', (err, results) => {
                    err ? console.error(err) : console.table(results);
                    init();
                })
            }
        })
    })
};

const addRole = async () => {
    const deptChoices = async () => {
    const rows = await db.promise().query( `SELECT * FROM departments`);
    
    let deptNames = rows[0].map(obj => obj.name);
    return deptNames;
    };

    const choices = await deptChoices();
    inquirer
    .prompt([
        {
            type:"input",
            message:"Please choose a new role name you would like to add",
            name:"addRoleTitle"
        },
        {
            type:"input",
            message:"Please choose a salary for this role",
            name:"addRoleSalary"
        },
        {
            type:"list",
            message:"Please choose which department this new role is in",
            name:"addDept",
            choices: deptChoices() //we get from using our promise up above
        }
    ]).then(ans => {
        db.promise().query(`SELECT id FROM departments WHERE department_name = ?`, ans.addDept).then(answer =>{
            let mapId = answer[0].map(obj => obj.id);
            return mapId[0]
        })
        .then((mapId) =>{
            db.promise().query(`INSERT INTO roles(title, salary, department_id) VALUES(?,?,?)`, [ans.addRoleTitle, ans.addRoleSalary, mapId]);
            init();
        })
    })
};


// const addEmp = () => {
//         const roleChoices = () => db.promise().query( `SELECT * FROM roles`).then((rows) =>{
//         let roleNames = rows[0].map(obj => obj.name);
//         return roleNames;
//     })
    
//     inquirer
//     .prompt[(
//         {
//             type:"input",
//             message:"What is the employee's first name?",
//             name:"addFirst"
//         },
//         {
//             type:"input",
//             message:"What is employee's last name?",
//             name:"addLast"
//         },
//         {
//         type:"list",
//         message:"Please assign a role",
//         name:"addRole",
//         choices: roleChoices() // from the promise up above
//         }
//     )].then(ans => {
//         db.promise().query(`SELECT id FROM roles WHERE title = ?`, ans.addRole).then(answer => {
//         let roleId = answer[0].id;
//         db.query(`INSERT INTO employees(first_name, last_name, role_id) VALUES(?,?,?)`, [ans.addFirst, ans.addLast, roleId], (err,results) => {
//             if (err){
//                 console.error(err)
//             } else {
//                 db.query(`SELECT * FROM employees`, (err, results) => {
//                     err ? console.error(err) : console.table(results);
//                     init();
//                 })
//             }
//         })
//     })
// })
// }

    const updateEmployee = () => {
    const employeeChoices = () => db.promise().query( `SELECT * FROM employees`).then((rows) =>{
        let empNames = rows[0].map(obj => obj.name) 
    })

    const roleChoices = () => db.promise().query( `SELECT * FROM roles`).then((rows) =>{
            let roleNames = rows[0].map(obj => obj.name)
    })


    inquirer
    .prompt[(
        {
            type:"list",
            message:"Which employee would you like to update?",
            name:"addEmp",
            choices: employeeChoices //promise above
        }, 
        {
            type:"list",
            message:"Which role are you assigning them?",
            name:"addRole",
            choices: roleChoices //promise above
        }
    )].then(ans =>{
        
    })

}




// //Default response for any other request (NOT FOUND)
// app.use((req, res)=>{
// res.status(404).end();
// });

// app.listen( PORT, () => {
//     console.log(`Server is running on port ${PORT}`)
// });