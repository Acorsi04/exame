import express from "express";
import cookieParser from "cookie-parser";
import path from 'path';
import session from "express-session";

const app = express();
app.use(cookieParser());

function autenticar(req, res, next) {
    if (req.session.usuarioAutenticado) {
        next();
    } else {
        res.redirect("/login.html");
    }
}

app.use(session({
    secret: "M1nH4Ch4veSeCR3t4",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 15
    }
}));

const port = 3000;
const host = 'localhost';

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'paginas')));

app.get('/', autenticar, (req, res) => {

    const dataUltimoAcesso = req.cookies.DataUltimoAcesso;
    const data = new Date();
    res.cookie("DataUltimoAcesso", data.toLocaleString(), {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true
    });

    res.end(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
            <title>Menu</title>
            <style>

            </style>
        </head>
        <body>
            <div class="container d-flex flex-column min-vh-100 justify-content-center align-items-center">
                <div class="mb-3">
                    <h1><span style="color: green;">Seja bem vindo<span></h1>
                </div>
                <div class="mb-3">
                    <ul>
                        <li><a href="/batePapo" role="button">Bate-papo</a></li>
                        <li><a href="/cadastro.html" role="button">Cadastrar Usuário</a></li>
                        <li><a href="/login.html" role="button">Logout</a></li>
                    </ul>
                </div>
                <p>Seu ultimo acesso foi em ${dataUltimoAcesso}</p>
            </div>
        </body>
        </html>
    `);
});

const usuarios = [];
const mensagens = [];

function controller(req, res) {
    const dados = req.body;
    let conteudoResposta = '';

    if (!dados.usernameCadastro || !dados.emailCadastro || !dados.passwordCadastro) {
        conteudoResposta = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
            <title>Cadastro de Usuário</title>
        </head>
        <body>
            <div class="container d-flex min-vh-100 flex-column justify-content-center align-items-center">
                <header class="mb-3">
                    <h1>Cadastro</h1>
                </header>
                <form action="/cadastro" method="post">
                    <div class="mb-3">
                        <label for="usernameCadastro" class="form-label">Username:</label>
                        <input type="text" name="usernameCadastro" id="usernameCadastro" value="${dados.usernameCadastro}" class="form-control">
                        ${!dados.usernameCadastro ? '<p class="text-danger">Por favor, informe seu nome de usuário!</p>' : ''}
                    </div>
                    <div class="mb-3">
                        <label for="emailCadastro" class="form-label">E-email:</label>
                        <input type="email" name="emailCadastro" id="emailCadastro" value="${dados.emailCadastro}" class="form-control">
                        ${!dados.emailCadastro ? '<p class="text-danger">Por favor, informe seu email!</p>' : ''}
                    </div>
                    <div class="mb-3">
                        <label for="passwordCadastro" class="form-label">Password:</label>
                        <input type="password" name="passwordCadastro" id="passwordCadastro" value="${dados.passwordCadastro}" class="form-control">
                        ${!dados.passwordCadastro ? '<p class="text-danger">Por favor, informe sua senha!</p>' : ''}
                    </div>
                    <button type="submit" class="btn btn-success">Cadastrar</button>
                </form>
            </div>`;
        res.send(conteudoResposta);
    } else {
        const usuario = ({
            nome: dados.usernameCadastro,
            email: dados.emailCadastro,
        });

        usuarios.push(usuario);

        let conteudoResposta = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Meu do sistema</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
        </head>
        <body>
            <h1>Usuários cadastrado</h1>
            <table class="table table-striped">
                <thead class="thead-dark justify-content-center">
                    <tr>
                        <th scope="col">Usuário</th>
                        <th scope="col">E-email</th>
                    </tr>
                </thead>
                <tbody> `;

        for (const usuario of usuarios) {
            conteudoResposta += `
                    <tr>
                        <td>${usuario.nome}</td>
                        <td>${usuario.email}</td>
                    </tr>      
                `;
        }
        conteudoResposta += `
                </tbody>
            </table>
            <a class="btn btn-primary" href="/" role="button">Voltar ao menu</a>
            <a class="btn btn-primary" href="/cadastro.html" role="button">Continuar cadastrando</a>
        </body>
        </html>`;
        res.end(conteudoResposta);
    }
}

function buildScreenBatePapo() {
    let conteudoResposta = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
        <title>Bate Papo</title>
    </head>
    <body>
        <form action="/batePapo" method="post" novalidate>
            <div class="container d-flex min-vh-100 flex-column justify-content-center align-items-center">
                <div class="conteudo d-flex border p-3 w-50 justify-content-center">
                    <div class="ttile">Chat</div>
                </div>
                <div class="tela">
                    <table>`;
    for (const mensagem of mensagens) {
        conteudoResposta += `
                <tr>
                    <td class="border p-3">
                        <div>${mensagem.nome}</div>
                        <div>${mensagem.mensagem}<div>
                        <div> Postado em: ${mensagem.data.toLocaleDateString()} às ${mensagem.data.toLocaleTimeString()}</div>
                    </td>
                </tr>      
            `;
    }
    conteudoResposta += `
        </table>
        </div>
        <div class="d-flex align-items-center gap-3 border p-3">
        <div class="pad">
        <select class="form-select" id="username"  aria-label="Default select example" name="username">
    `;
    for (const usuario of usuarios) {
        conteudoResposta += `   
            <option selected value="${usuario.nome}">${usuario.nome}</option>
        `;
    }
    conteudoResposta += `
        </select>
            </div>
                <div class="input">
                    <input type="text" name="mensagem" class="form-control" id="mensagem" placeholder="Mensagem">
                </div>
                <div class="button">
                    <button type="submit" class="btn btn-success">Enviar</button>
                </div>
                </div>
            </div>
            <a class="btn btn-primary" href="/" role="button">Voltar ao menu</a>
        </form>
        </body>
        </html>
    `;
    return conteudoResposta;
}

app.get('/batePapo', autenticar, (req, res) => {
    res.end(buildScreenBatePapo());
});

app.post('/BatePapo', (req, res) => {
    const dados = req.body;
    if (!dados.mensagem) {
        res.end(buildScreenBatePapo());
    } else {
        const mensagem = ({
            nome: dados.username,
            mensagem: dados.mensagem,
            data: new Date(),
        });
        mensagens.push(mensagem);
        res.end(buildScreenBatePapo());
    }
});


app.post('/login', (req, res) => {
    const dados = req.body;

    if (dados.username && dados.password && (dados.username === 'Acorsi') && (dados.password === '123')) {
        req.session.usuarioAutenticado = true;
        res.redirect('/');
    } else {
        res.end(
            `<!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>Falha na autenticação</title>
                    </head>
                    <body>
                        <h3>Username ou senha inválidos!</h3>
                        <a href="/login.html">Voltar ao login</a>
                    </body>
                </html>         
            `);
    }

});

app.post('/cadastro', autenticar, controller);
app.listen(port, host, () => {
    console.log(`Url: http://${host}:${port}`);
})