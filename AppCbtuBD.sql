create database if not exists AppCbtuBD character set utf8;
use AppCbtuBD;
set time_zone = '-03:00';
create table if not exists Estacao(
	id int auto_increment primary key,
    nome varchar(255) not null,
    sigla varchar(3) not null unique,
    codigo varchar(20) not null,
    endereco varchar(255) not null,
    latitude varchar(20) not null,
    longitude varchar(20) not null
);

create table if not exists Alerta(
	id int auto_increment primary key,
    descricao varchar(255) not null,
    prioridade varchar(10) not null,
    data_inicio timestamp not null,
    data_fim timestamp not null,
    ativo varchar(10) not null,
    estacaoId int,
    constraint fk_Alerta_Estacao
    foreign key (estacaoId)
		references Estacao(id)
);

create table if not exists Equipamento(
	id int auto_increment primary key,
    nome varchar(255) not null,
    tipo varchar(255) not null,
    num_falha int not null,
    ativo varchar(10) not null,
    estacaoId int,
    constraint fk_Equipamento_Estacao
    foreign key (estacaoId)
		references Estacao(id)
);

create table if not exists Telefone(
	id int auto_increment primary key,
    numero int(10) not null,
    estacaoId int,
    constraint fk_Telefone_Estacao
    foreign key (estacaoId)
		references Estacao(id)
);

create table if not exists Area(
	id int auto_increment primary key,
    nome varchar(255) not null 
);

create table if not exists Contato(
	id int auto_increment primary key,
    tipo varchar(255) not null,
    valor varchar(255) not null,
    areaId int,
    constraint fk_Contato_Area
    foreign key (areaId)
		references Area(id)
);
