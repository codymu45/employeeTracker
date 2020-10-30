use employeeDB;

set foreign_key_checks = 0;
truncate employees;
truncate roles;
truncate departments;
set foreign_key_checks = 1;

insert into departments (id, name)
values 
(1, "Sales"),
(2, "Engineering"),
(3, "Finance"),
(4, "Legal");

insert into roles (id, title, salary, department_id)
values 
(1, "Sales Lead", 100000, 1),
(2, "Salesperson", 80000, 1),
(3, "Lead Engineer", 150000, 2),
(4, "Software Engineer", 120000, 2),
(5, "Accountant", 125000, 3),
(6, "Legal Team Lead", 250000, 4),
(7, "Lawyer", 190000, 4);

insert into employees (id, first_name, last_name, role_id, manager_id)
values 
(1, "Conner", "Mullen", 3, null),
(2, "Cody", "Mullen", 4, 1),
(3, "Joe", "Schmoe", 1, null),
(4, "Alex", "Doe", 2, 3),
(5, "John", "Stevens", 5, null);





