drop database if exists employeeDB;
create database employeeDB;
use employeeDB;

create table departments(
id int auto_increment,
name varchar(30),
primary key(id)
);

create table roles(
id int auto_increment,
title varchar(30) not null,
salary decimal,
department_id int,
primary key(id),
foreign key(department_id) references departments(id)
);

create table employees(
id int auto_increment,
first_name varchar(30) not null,
last_name varchar(30) not null,
role_id int,
manager_id int,
primary key(id),
foreign key(role_id) references roles(id),
foreign key(manager_id) references employees(id)
);



