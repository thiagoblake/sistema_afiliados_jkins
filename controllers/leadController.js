require('dotenv').config();
const request = require('request');
const db = require('../config/db'); // Certifique-se de que o caminho está correto para o arquivo de configuração do banco de dados

// Função para buscar o colaborador por CNPJ/CPF no ERP
function buscarColaboradorPorCpfCnpj(cnpjCpf) {
    const token = process.env.ERP_TOKEN;
    const baseUrl = process.env.ERP_BASE_URL;

    const options = {
        method: 'GET',
        url: `${baseUrl}/cliente`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + Buffer.from(token).toString('base64'),
            ixcsoft: 'listar'
        },
        body: {
            qtype: 'cliente.cnpj_cpf',
            query: cnpjCpf,
            oper: '='
        },
        json: true
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                console.error('Erro ao buscar colaborador:', error.message);
                return reject(error);
            }

            //console.log('Resposta da API do ERP:', body);
            if (body && body.registros && body.registros.length > 0) {
                const colaborador = body.registros[0];
                resolve(colaborador.id); // Retorna o ID do colaborador encontrado
            } else {
                reject(new Error('Colaborador não encontrado.'));
            }
        });
    });
}

// Função para cadastrar o lead no ERP
function cadastrarLeadNoERP(dadosLead, indicadoPor) {
    const token = process.env.ERP_TOKEN;
    const baseUrl = process.env.ERP_BASE_URL;

    // Gera a data e hora atuais no formato "YYYY-MM-DD HH:MM:SS"
    const dataAtual = new Date();
    const dataCadastro = dataAtual.toISOString().slice(0, 19).replace('T', ' ');

    const options = {
        method: 'POST',
        url: `${baseUrl}/contato`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + Buffer.from(token).toString('base64')
        },
        body: {
            nome: dadosLead.nome,
            email: dadosLead.email,
            telefone_celular: dadosLead.telefone,
            endereco: dadosLead.rua,
            numero: dadosLead.numero,
            bairro: dadosLead.bairro,
            cidade: dadosLead.cidade,
            indicado_por: indicadoPor,
            lead: 'S',
            ativo: 'S',
            data_cadastro: dataCadastro // Adiciona a data e hora atuais
        },
        json: true
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                console.error('Erro ao cadastrar lead:', error.message);
                return reject(error);
            }

            console.log('Resposta do ERP ao cadastrar lead:', body);
            if (response.statusCode === 200) {
                resolve(body);
            } else {
                reject(new Error('Falha ao cadastrar lead.'));
            }
        });
    });
}

// Controlador para lidar com a submissão do formulário
exports.registrarLead = async (req, res) => {
    const { nome, email, telefone, rua, numero, bairro, cidade, ref } = req.body;
  
    try {
      // Buscar o CNPJ/CPF do colaborador no banco de dados
      const [colaborador] = await db.promise().query('SELECT cnpj_cpf FROM users WHERE affiliate_code = ?', [ref]);
  
      //console.log('Resultado da consulta ao banco de dados:', colaborador);
  
      if (!colaborador || colaborador.length === 0) {
        return res.status(404).json({ message: 'Colaborador não encontrado.' });
      }
  
      const cnpjCpf = colaborador[0].cnpj_cpf;
      //console.log('CNPJ/CPF do colaborador encontrado:', cnpjCpf);
  
      // Buscar o ID do colaborador no ERP
      const indicadoPor = await buscarColaboradorPorCpfCnpj(cnpjCpf);
      console.log('ID do colaborador encontrado:', indicadoPor); // Verifica se o ID foi recuperado corretamente
  
      // Cadastrar o lead no ERP, passando o ID do colaborador indicado
      const resultado = await cadastrarLeadNoERP({ nome, email, telefone, rua, numero, bairro, cidade }, indicadoPor);
  
      res.status(200).json({ message: 'Lead cadastrado com sucesso.', data: resultado });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao cadastrar o lead.', error: error.message });
    }
  };
