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
    dataInicio datetime not null,
    dataFim datetime not null,
    ativo boolean not null,
    estacaoId int not null,
    constraint fk_Alerta_Estacao
    foreign key (estacaoId)
		references Estacao(id)
);

create table if not exists Equipamento(
	id int auto_increment primary key,
    nome varchar(255) not null,
    tipo varchar(255) not null,
    estado int not null,
    estacaoId int not null,
    constraint fk_Equipamento_Estacao
    foreign key (estacaoId)
		references Estacao(id)
);

create table if not exists Falha(
	id int auto_increment primary key,
    numFalha int not null,
    dataCriacao datetime not null,
    equipamentoId int not null,
    constraint fk_Falha_Equipamento
    foreign key (equipamentoId)
		references Equipamento(id)
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
    tremPainel int not null,
    descricao varchar(255) not null,
    arCon boolean not null,
    tempo time not null,
    tremTipo int not null,
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
	id int primary key,
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

create table if not exists Erros(
  id int auto_increment primary key,
  stack text not null,
  dataDoErro timestamp not null
);

insert into Area(id, nome)
values
(0, 'STU/GAB'),
(1, 'GOMAK'),
(2, 'GOJUR'),
(3, 'GOLIC'),
(4, 'COSEP'),
(5, 'GOSEG'),
(07, 'GIAFI'),
(08, 'GIPLA'),
(09, 'GIOBR'),
(10, 'GIMAN'),
(11, 'GIOPE'),
(12, 'GOMAT'),
(13, 'GOREH'),
(14, 'GOFIN'),
(15, 'GOPAT'),
(16, 'GOCOP'),
(17, 'GOMAR'),
(18, 'GOSIP'),
(20, 'GOEST'),
(21, 'GOMOV'),
(22, 'COGES'),
(23, 'COARM'),
(24, 'COARH'),
(25, 'CODES'),
(26, 'COSET'),
(27, 'COSER'),
(28, 'COARC'),
(29, 'COTES'),
(30, 'COTOS'),
(31, 'COEXP'),
(32, 'COINF'),
(33, 'COPLO'),
(34, 'COASU'),
(35, 'COIMP'),
(36, 'COPRO'),
(37, 'CEGBH'),
(38, 'COPEM'),
(41, 'COFEM'),
(42, 'COOEL'),
(43, 'COMEP'),
(44, 'COMAN'),
(45, 'CORET'),
(46, 'COELO'),
(47, 'COVIP'),
(48, 'COELI'),
(49, 'COPPO'),
(52, 'COSOP');

insert into Estacao (nome, sigla, codigo, endereco, latitude, longitude)
values
(
	'Estação São Gabriel',
	'usg',
    'asdf32',
	'rua das flores',
	'41.5656',
	'85.9696'
),
(
	'Estação Minas Shopping',
    'ums',
    'asdf32',
    'rua dos cravos',
    '39.4141',
    '86.3478'
);