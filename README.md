# API MetroBH

## Geral
Projeto desenvolvido com
* Javascript
* Typescript
* Jest

## Dependencias
### Node
Versão 16.14.2
[Instalador](https://nodejs.org/pt-br_BR/)

## Clonando o projeto
ssh: `git clone git@gitlab.com:coinfstubh/appcbtu_api.git`

https: `git clone https://gitlab.com/coinfstubh/appcbtu_api.git`

## Instalando dependências

Na pasta do projeto

`npm install`

Após executar o `npm install`, crie um arquivo '.env' na raiz do projeto com as seguintes variáveis de ambiente e insira o dados correspondentes ao banco de dados local:
### Configuração do Banco de dados
* ENDERECO_BANCODEDADOS = ''
* PORTA_BANCODEDADOS = ''
* NOME_BANCODEDADOS = 'appcbtubd'
* USUARIO_BANCODEDADOS = ''
* SENHA_BANCODEDADOS = ''

### Configuração da aplicação
* PORTA_APLICACAO = '5000'

### Configuração do CORS
* ORIGEM = '*'
* METODO = '*'
* CABECALHO = '*'

# Salt do Encriptador

SALT = '12'


No VScode é necessário a instalação das extenções "StandardJS", para melhor integração com a dependencia
"ts-standard", e "Jest Snippets".

## Rodando os testes

`npm start` - Inicia a aplicação

`npm run test` - Todos os testes serão executados, mesmo com testes falhando, e não serão exibidos os erros

`npm run test:verbose` - Todos os testes serão executados, mesmo com testes falhando, exibindo os erros

`npm run test:unit` - Todos os testes unitários recentemente alterados, do tipo .spec.ts, serão executados e não serão exibidos os erros

`npm run test:integration` - Todos os testes de integração recentemente alterados, do tipo .test.ts, serão executados e não serão exibidos os erros

## Endpoints e métodos HTTP suportados (servidor de testes)

Para utilizar os endpoints acesse o servidor de testes, vá para o diretório da API (cd appcbtu_api/) e execute o comando "npm start".
(Note que ao sair do servidor de testes a aplicação irá parar de executar)

* `http://10.10.20.202:5000/api/estacao` - Métodos: GET
* `http://10.10.20.202:5000/api/estacao/(sigla da estação)` - Métodos: GET
* `http://10.10.20.202:5000/api/equipamento` - Métodos: POST
