// rotas_usuarios.js
import express from 'express';
import { pegar_usuario, listar_usuarios, deletar_usuario, trocar_img } from '../controlador/controlador_usuarios.js';

const rotas_users = express.Router();

// Rota para pegar um usuário pelo ID
rotas_users.get('/:id', pegar_usuario);

// Rota para listar todos os usuários
rotas_users.get('/', listar_usuarios);

// Rota para deletar um usuário pelo ID
rotas_users.delete('/:id', deletar_usuario);

// Rota para trocar a imagem do perfil
rotas_users.post('/trocar-img/:id', trocar_img);

export { rotas_users };
