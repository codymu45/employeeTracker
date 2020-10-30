var mysql = require('mysql');
var inquirer = require('inquirer');
var cTable = require('console.table');
const { type } = require('os');

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8083;

// Parse request body as JSON

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employeeDB"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  return;
  }

  console.log("connected as id " + connection.threadId);
});

//=============================================================
//=============================================================

const selectFunction = () => {
inquirer.prompt([
  {
    type: 'list',
    name: 'todo',
    message: 'What would you like to do?',
    choices: [
      'View All Employees',
      'Add Employee',
      'View All Roles',
      'Add Role',
      'View All Departments',
      'Add Department',
      'Update Employee Roles',
      'Quit'
      ]
  }
])
.then(answer => {
  const {todo} = answer;
  switch(todo) {
    case 'View All Employees':
      getEmployees();      
      break;
    case 'Add Employee':
      addEmployee();     
      break;
    case 'View All Roles':
      viewAllRoles();      
      break;
    case 'Add Role':
      addRole();      
      break;
    case 'View All Departments':
      viewAllDepartments();      
      break;
    case 'Add Department':
      addDepartment();      
      break;
    case 'Update Employee Roles':
      updateEmployeeRoles();
      break;
    case 'Quit':
      console.log('Quitting!');
      break;
  }
});
}

//=============================================================
//=============================================================

function getEmployees() {
  connection.query(
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager 
    FROM employees e 
    INNER JOIN roles r ON e.role_id = r.id 
    INNER JOIN departments d ON r.department_id = d.id 
    LEFT JOIN employees m ON e.manager_id = m.id;`,
    function (err, results, fields) {
    if(err) throw err;
    console.log(cTable.getTable(results));
    selectFunction();
  });
}

//=============================================================
//=============================================================

function addEmployee(){
  console.log('Adding Employee!');
  //logic here
  inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'What is the employees first name?'
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'What is the employees last name?'
    },
    {
      type: 'list',
      name: 'name',
      message: 'What is this employees role?',
      choices: [
       //show array of roles
      ]
    }
  ])
  .then(answer => {
    //add employee to employee table
    //set employees role id
  });

  selectFunction();
}

//=============================================================
//=============================================================

function viewAllRoles(){
  connection.query(
    `SELECT roles.title FROM roles`,
    function (err, results, fields) {
    if(err) throw err;
    console.log(cTable.getTable(results));
    selectFunction();
  });
}

//=============================================================
//=============================================================

function addRole(){
  console.log('Adding Role!');
  //logic here
  inquirer.prompt([
    {
      type: 'input',
      name: 'newRole',
      message: 'What role would you like to add?'
    },
    {
      type: 'list',
      name: 'newRolesDepartment',
      message: 'What department is this role in?',
      choices: [
        //show array of departments
      ]
    },
    {
      type: 'input',
      name: 'newRolesSalary',
      message: 'What is the salary of this role? $'
    }
  ])
  .then(answer => {
    //add role to roles table
    //add role to the department
    //add salary to role
  });

  selectFunction();
}

//=============================================================
//=============================================================

function viewAllDepartments(){
  connection.query(
    `SELECT departments.name FROM departments`,
    function (err, results, fields) {
    if(err) throw err;
    console.log(cTable.getTable(results));
    selectFunction();
  });
}

//=============================================================
//=============================================================

function addDepartment(){
  console.log('Adding Department!');
  //logic here
  inquirer.prompt([
    {
      type: 'input',
      name: 'newDepartment',
      message: 'What department would you like to add?'
    }
  ])
  .then(answer => {
    //add to departments
  });

  selectFunction();
}

//=============================================================
//=============================================================

function updateEmployeeRoles(){
  console.log('updating Employee Roles!');
  //logic here
  inquirer.prompt([
    {
      type: 'list',
      name: 'selectedEmployee',
      message: 'Which employee would you like to update?',
      choices: [
        //show array of employees
      ]
    },
    {
      type: 'list',
      name: 'chosenField',
      message: 'Select a new role for this employee',
      choices: [
        //show array of roles
      ]
    }
  ])
  .then(answer => {
    const {field} = answer;
    switch(field) {
      case 'First Name':
        //enter new first name      
        break;
      case 'Last Name':
        //enter new last name     
        break;
      case 'Role':
        //select new role     
        break;
      
    }
  });


  selectFunction();
}

//=============================================================
//=============================================================



//start program
selectFunction();