create database if not exists appcbtubd character set utf8;
use appcbtubd;
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
    estacaoId int not null,
    constraint fk_Alerta_Estacao
    foreign key (estacaoId)
		references Estacao(id)
);

create table if not exists Equipamento(
	  id int auto_increment primary key,
    nome varchar(255) not null,
    tipo varchar(255) not null,
    num_falha int,
    estado int not null,
    estacaoId int not null,
    constraint fk_Equipamento_Estacao
    foreign key (estacaoId)
		references Estacao(id)
);

create table if not exists Telefone(
	id int auto_increment primary key,
    numero int(10) not null,
    estacaoId int not null,
    constraint fk_Telefone_Estacao
    foreign key (estacaoId)
		references Estacao(id)
);

create table if not exists Horario(
	id int auto_increment primary key,
    trem_painel int not null,
    descricao varchar(255) not null,
    ar_con boolean not null,
    tempo time not null,
    trem_tipo int not null,
    estacaoId int not null,
    constraint fk_Horario_Estacao
    foreign key (estacaoId)
		references Estacao(id)
);

create table if not exists Coordenada(
	id int auto_increment primary key,
    latitude varchar(20) not null,
    longitude varchar(20) not null
);

create table if not exists Horario_Coordenada(
	id int auto_increment primary key,
    horarioId int not null,
    constraint fk_tabela_Horario
    foreign key (horarioId)
		references Horario(id),
	coordenadaId int not null,
    constraint fk_tabela_Coordenada
    foreign key (coordenadaId)
		references Coordenada(id)
);

create table if not exists Area(
	id int auto_increment primary key,
    nome varchar(255) not null 
);

create table if not exists Contato(
	id int auto_increment primary key,
    tipo varchar(255) not null,
    valor varchar(255) not null,
    areaId int not null,
    constraint fk_Contato_Area
    foreign key (areaId)
		references Area(id)
);

create table if not exists Funcionario(
	id int auto_increment primary key,
    nome varchar(255) not null,
    email varchar(255) not null,
    senha varchar(255) not null,
    administrador boolean not null,
    areaId int not null,
    constraint fk_Funcionario_Area
    foreign key (areaId)
		references Area(id)
);
