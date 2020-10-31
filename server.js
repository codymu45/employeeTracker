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
    function (err, results) {
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
  connection.query(
    `SELECT * FROM roles`,
    function (err, results) {
    if(err) throw err;
    var roles = [];
    results.forEach(job => {
      roles.push(job.title);
    });
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
      name: 'newEmployeesRole',
      message: 'What is this employees role?',
      choices: roles
    }
  ])
  .then(answer => {
    //add employee to employee table
    //set employees role id
    const {first_name} = answer;
    const {last_name} = answer;
    const {newEmployeesRole} = answer;
    var role_id = -1;
    results.forEach(role => {
      if(role.title == newEmployeesRole){
        role_id = role.id;
      }
    });
      connection.query(
        `insert into employees (first_name, last_name, role_id)
        values ("${first_name}", "${last_name}", ${role_id});`,
        function (err, results) {
        if(err) throw err;
        selectFunction();
      });
  });
  });

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
  connection.query(
    `SELECT * FROM departments`,
    function (err, results) {
    if(err) throw err;
    var departments = [];
    results.forEach(dept => {
      departments.push(dept.name);
    });
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
        choices: departments
      },
      {
        type: 'input',
        name: 'newRolesSalary',
        message: 'What is the salary of this role? $'
      }
    ])
    .then(answer => {
      const {newRole} = answer;
      const {newRolesDepartment} = answer;
      const {newRolesSalary} = answer;
      var dept_id = -1;
      results.forEach(dept => {
        if(dept.name == newRolesDepartment){
          dept_id = dept.id;
        }
      });
      connection.query(
        `insert into roles (title, salary, department_id)
        values ("${newRole}", ${newRolesSalary}, ${dept_id});`,
        function (err, results) {
        if(err) throw err;
        selectFunction();
      });
      
    });
  });
}

//=============================================================
//=============================================================

function viewAllDepartments(){
  connection.query(
    `SELECT departments.name FROM departments`,
    function (err, results) {
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
    const {newDepartment} = answer;
    connection.query(
      `insert into departments (name)
      values ("${newDepartment}");`,
      function (err, results) {
      if(err) throw err;
      selectFunction();
    });
  });
}

//=============================================================
//=============================================================

function updateEmployeeRoles(){
  console.log('updating Employee Roles!');
  //logic here
  connection.query(
    `SELECT * FROM roles`,
    function (err, results) {
    if(err) throw err;
    var roles = [];
    results.forEach(job => {
      roles.push(job.title);
    });

    connection.query(
      `SELECT * FROM employees`,
      function (error, data) {
      if(error) throw error;
      var employees = [];
      data.forEach(person => {
        employees.push(person.first_name + ' ' + person.last_name);
      });
      inquirer.prompt([
        {
          type: 'list',
          name: 'selectedEmployee',
          message: 'Which employee would you like to update?',
          choices: employees
        },
        {
          type: 'list',
          name: 'chosenField',
          message: 'Select a new role for this employee',
          choices: roles
        }
      ])
      .then(answer => {
        const {selectedEmployee} = answer;
        const {chosenField} = answer;
        var role_id = -1;
        results.forEach(role => {
          if(role.title == chosenField){
            role_id = role.id;
          }
        });
        var emp_id = -1;
        data.forEach(emp => {
          if((emp.first_name + ' ' + emp.last_name) == selectedEmployee){
            emp_id = emp.id;
          }
        });
        connection.query(
          `UPDATE employees 
          SET role_id = ${role_id}
          WHERE id = ${emp_id};`,
          function (er, response) {
          if(er) throw er;
          selectFunction();
        });
        });
    });
  });
}

//=============================================================
//=============================================================



//start program
selectFunction();