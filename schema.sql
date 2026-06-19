CREATE DATABASE employee_management;
USE employee_management;

CREATE TABLE cadre (
    cadre_id INT AUTO_INCREMENT PRIMARY KEY,
    sname VARCHAR(50) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE designation (
    designation_id INT AUTO_INCREMENT PRIMARY KEY,

    cadre_id INT NOT NULL,

    sname VARCHAR(50) NOT NULL,
    full_name VARCHAR(100) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (cadre_id)
        REFERENCES cadre(cadre_id)
);
CREATE TABLE internal_designation (
    internal_designation_id INT AUTO_INCREMENT PRIMARY KEY,

    sname VARCHAR(50) NOT NULL,
    full_name VARCHAR(100) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE
);


CREATE TABLE employee_group (
    group_id INT AUTO_INCREMENT PRIMARY KEY,

    short_name VARCHAR(50) NOT NULL,
    full_name VARCHAR(100) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE
);


CREATE TABLE employee (
    emp_id INT AUTO_INCREMENT PRIMARY KEY,

    pis_number VARCHAR(50) UNIQUE,

    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,

    gender VARCHAR(20),
    dob DATE,

    mobile_no VARCHAR(15),
    telephone VARCHAR(20),

    email VARCHAR(100),

    cadre_id INT,
    designation_id INT,
    internal_designation_id INT,
    group_id INT,

    user_type VARCHAR(50),

    username VARCHAR(50),
    password VARCHAR(255),

    status BOOLEAN DEFAULT TRUE,
    is_gazetted BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (cadre_id)
        REFERENCES cadre(cadre_id),

    FOREIGN KEY (designation_id)
        REFERENCES designation(designation_id),

    FOREIGN KEY (internal_designation_id)
        REFERENCES internal_designation(internal_designation_id),

    FOREIGN KEY (group_id)
        REFERENCES employee_group(group_id)
);



CREATE TABLE adgh (
    adgh_id INT AUTO_INCREMENT PRIMARY KEY,

    emp_id INT,
    group_id INT,

    username VARCHAR(50),
    password VARCHAR(255),

    role VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (emp_id)
        REFERENCES employee(emp_id),

    FOREIGN KEY (group_id)
        REFERENCES employee_group(group_id)
);



CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,

    emp_id INT,
    group_id INT,

    username VARCHAR(50),
    password VARCHAR(255),

    user_type VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (emp_id)
        REFERENCES employee(emp_id),

    FOREIGN KEY (group_id)
        REFERENCES employee_group(group_id)
);



INSERT INTO cadre(sname, full_name)
VALUES
('TECH', 'Technical Cadre'),
('ADMIN', 'Administrative Cadre');

INSERT INTO designation(cadre_id, sname, full_name)
VALUES
(1, 'SE', 'Scientist E'),
(1, 'SD', 'Scientist D');

INSERT INTO internal_designation(sname, full_name)
VALUES
('GH', 'Group Head'),
('AD', 'Associate Director');

INSERT INTO employee_group(short_name, full_name)
VALUES
('AI', 'Artificial Intelligence Group'),
('NET', 'Network Security Group');

INSERT INTO employee(
    pis_number,
    first_name,
    last_name,
    gender,
    email,
    cadre_id,
    designation_id,
    internal_designation_id,
    group_id,
    username,
    password
)
VALUES
(
    'PIS001',
    'Aditya',
    'Tomar',
    'Male',
    'aditya@example.com',
    1,
    1,
    1,
    1,
    'aditya',
    'password123'
);