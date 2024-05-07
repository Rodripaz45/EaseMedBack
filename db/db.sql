CREATE TABLE paciente (
    id INT PRIMARY KEY IDENTITY(1,1),
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    numero_celular VARCHAR(20) NOT NULL,
    documento_identidad VARCHAR(20) NOT NULL
);

CREATE TABLE administrativo (
    id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL
);

CREATE TABLE especialidad (
    id INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE doctor (
    id INT PRIMARY KEY IDENTITY(1,1),
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL
    id_administrativo INT NOT NULL,
    FOREIGN KEY (id_administrativo) REFERENCES administrativo(id)
);

CREATE TABLE DoctorEspecialidad (
    idDoctor INT,
    idEspecialidad INT,
    FOREIGN KEY (idDoctor) REFERENCES doctor(id),
    FOREIGN KEY (idEspecialidad) REFERENCES especialidad(id)
);

CREATE TABLE CitaMedica (
    id INT PRIMARY KEY IDENTITY(1,1),
    idPaciente INT,
    idMedico INT,
    horaReserva DATETIME NOT NULL,
    horaCita DATETIME NOT NULL,
    FOREIGN KEY (idPaciente) REFERENCES paciente(id),
    FOREIGN KEY (idMedico) REFERENCES doctor(id)
);
