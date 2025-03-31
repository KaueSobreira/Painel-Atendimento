create database painel;
use painel;
Create table users(
	id int auto_increment primary key,
    nome varchar(20) not null,
    email varchar(50) not null,
    senha varchar(255) not null
);
create table permisson(
	id int auto_increment primary key,
    nome varchar(15),
    id_users int,
    foreign key (id_users) references users(id)
);

insert into users (nome, email, senha) values ("DEV", "dev@hotmail.com", 123);
insert into permisson (nome, id_users) values ("MASTER", 1);