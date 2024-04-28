import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();

app.use(cors());
app.use(express.json());


//CRIAR VEICULO

const listaVeiculos = [];
let identificador = 1;
const listaUsuarios = [];

app.post("/veiculos", (request, response) => {
    const modeloDoVeiculo = request.body.modeloDoVeiculo;
    const marcaDoVeiculo = request.body.marcaDoVeiculo;
    const anoDoVeiculo = Number(request.body.anoDoVeiculo);
    const corDoVeiculo = request.body.corDoVeiculo;
    const precoDoVeiculo = Number(request.body.precoDoVeiculo);

    
    if (!modeloDoVeiculo){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Insira um modelo para o veículo válido"}));
    }
    
    if (!marcaDoVeiculo){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Insira uma marca para o veículo válido"}));
    }

    if (!anoDoVeiculo){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Insira um ano para o veículo válido"}));
    }

    if (!corDoVeiculo){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Insira uma cor para o veículo válido"}));
    }

    if (!precoDoVeiculo){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Insira um preço para o veículo válido"}));
        }
        
        let veiculos = {
            modeloDoVeiculo: modeloDoVeiculo,
            marcaDoVeiculo: marcaDoVeiculo,
            anoDoVeiculo: anoDoVeiculo,
            corDoVeiculo: corDoVeiculo,
            precoDoVeiculo: precoDoVeiculo,
            idVeiculo: identificador
        }

    listaVeiculos.push(veiculos);
    identificador++;

    response
        .status(200)
        .send(JSON.stringify({Mensagem: `Veiculo ${modeloDoVeiculo} da marca ${marcaDoVeiculo} criado com sucesso.`}))
})

//LER VEICULOS

app.get("/veiculos", (request, response) =>{

    if (listaVeiculos.length === 0){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: `Não existe veículo cadastrado`}));
    }

    // let dados = "";
    // for (let i = 0; i < listaVeiculos.length; i++){
    //     dados = `ID: ${listaVeiculos[i].idVeiculo} | Modelo: ${listaVeiculos[i].modeloDoVeiculo} | Marca: ${listaVeiculos[i].marcaDoVeiculo} | Ano: ${listaVeiculos[i].anoDoVeiculo} | Cor: ${listaVeiculos[i].corDoVeiculo} | Preço: R$${listaVeiculos[i].precoDoVeiculo}`
    // }

    // response
    //     .status(200)
    //     .send(JSON.stringify({dados}));
    
    const dadosMapeados = listaVeiculos.map((veiculo) => `ID: ${veiculo.idVeiculo} | Modelo: ${veiculo.modeloDoVeiculo} | Marca: ${veiculo.marcaDoVeiculo} | Ano: ${veiculo.anoDoVeiculo} | Cor: ${veiculo.corDoVeiculo} | Preço: R$${veiculo.precoDoVeiculo}`);
    
    response
        .status(200)
        .send(JSON.stringify({dadosMapeados}));

        
})

//OBTER LISTA FILTRADA
app.get("/veiculos/:marcaBuscada", (request, response) => {
        
    if (listaVeiculos.length === 0){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: `Não existe veículo cadastrado`}));
    }

    const marcaBuscada = request.params.marcaBuscada;
    
    if(!marcaBuscada){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Marca inserida não existe"}));
    }

    const marcaVerificada = listaVeiculos.findIndex((veiculo) => veiculo.marcaDoVeiculo === marcaBuscada);

    if (marcaVerificada === -1){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Marca inserida não exista na lista"}));
    }

    const dadosFiltrados = listaVeiculos.filter((veiculo) => veiculo.marcaDoVeiculo === marcaBuscada).map((veiculo) => `ID: ${veiculo.idVeiculo} | Modelo: ${veiculo.modeloDoVeiculo} | Cor: ${veiculo.corDoVeiculo} | Preço: R$${veiculo.precoDoVeiculo}`);

    response
        .status(200)
        .send(JSON.stringify({dadosFiltrados}));
})   

//ATUALIZAR VEICULO

app.put("/veiculos/:idBuscado", (request, response) => {
    const corDoVeiculo = request.body.corDoVeiculo;
    const precoDoVeiculo = Number(request.body.precoDoVeiculo);
    const idBuscado = Number(request.params.idBuscado);

    if (!idBuscado){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Insira um ID"}));
    }

    const verificarId = listaVeiculos.findIndex((veiculo) => veiculo.idVeiculo === idBuscado);

    if (verificarId === -1){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "ID inserido não existe no banco de dados"}));
    }

    if (!corDoVeiculo){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Insira uma cor válida"}));
    }

    if (!precoDoVeiculo){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Insira um preço válido"}));
    }

    if (verificarId !== -1){
        const veiculo = listaVeiculos[verificarId];
        veiculo.corDoVeiculo = corDoVeiculo;
        veiculo.precoDoVeiculo = precoDoVeiculo;

        response
            .status(200)
            .send({Mensagem: `Veiculo ${veiculo.modeloDoVeiculo} atualizado com sucesso. Sua nova cor é ${veiculo.corDoVeiculo} e o preço é R$${veiculo.precoDoVeiculo}`})
    }
})

//DELETAR VEICULO

app.delete("/veiculos/:idBuscado", (request, response) => {
    const idBuscado = Number(request.params.idBuscado);

    if (!idBuscado){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Insira um ID"}));
            return
    } 
    
    const verificarId = listaVeiculos.findIndex((veiculo) => veiculo.idVeiculo === idBuscado);

    if (verificarId === -1){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Veículo não encontrado. O usuário deve voltar para o menu inicial"}))
    } 

    listaVeiculos.splice(verificarId, 1);

    response
        .status(200)
        .send(JSON.stringify({Mensagem: "Veículo deletado com sucesso"}))

})

//CRIAR USUÁRIO

app.post("/signup", async (request, response) => {
    const nome = request.body.nome;
    const email = request.body.email;
    const senhaDigitada = request.body.senhaDigitada;

    if (!nome){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Favor inserir um nome"}));
    }

    if (!email){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Favor inserir um email"}));
    }

    if (!senhaDigitada){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Favor inserir uma senha"}));    
    }

    const verificarEmail = listaUsuarios.find((usuario) => usuario.email === email);

    if (verificarEmail){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Email inserido já existe"}));
    }

    const senhaCriptografada = await bcrypt.hash(senhaDigitada, 10);

    let novoUsuario = {
        nome: nome,
        email: email,
        senhaDigitada: senhaCriptografada
    }

    listaUsuarios.push(novoUsuario);
    response
        .status(200)
        .send(JSON.stringify({Mensagem: "Usuário criado com sucesso"}));
})

//LOGIN

app.post("/login", async (request, response) => {
    const email = request.body.email;
    const senha = request.body.senha;

    if (!email){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Por favor insira um email"}))
    }

    if (!senha){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Por favor insira uma senha"}))
    }

    const usuario = listaUsuarios.find((usuario) => usuario.email === email);

    const senhaMatch = await bcrypt.compare(senha, usuario.senhaDigitada)

    if (!senhaMatch){
        response
            .status(400)
            .send(JSON.stringify({Mensagem: "Senha inserida não é válida"}))
    } else {
        response
            .status(200)
            .send(JSON.stringify({Mensagem: `Pessoa com o email ${email} logada com sucesso`}))
    }

})

app.listen(3333, () => console.log("Servidor iniciado na porta 3333")); 



 