// controlador_usuarios.js
import { User } from '../db.js'; // Certifique-se de que o modelo User está correto

// Função para listar todos os usuários
const listar_usuarios = async (req, res) => {
    try {
        const users = await User.findAll(); // Ajuste para o seu ORM (Ex: Sequelize)
        const parsed_users = users.map(item => ({
            id: item.id,
            nome: item.nome,
            email: item.email,
            status: item.status
        }));
        res.status(200).json(parsed_users);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ message: 'Erro ao listar usuários' });
    }
};

// Função para pegar um usuário pelo ID
const pegar_usuario = async (req, res) => {
    const user_id = req.params.id;

    try {
        const user = await User.findOne({ where: { id: user_id } }); // Ajuste para seu ORM
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json(user); // Retorna os dados do usuário
    } catch (error) {
        console.error('Erro ao pegar o usuário:', error);
        res.status(500).json({ message: 'Erro ao pegar os dados do usuário' });
    }
};

// Função para deletar um usuário
const deletar_usuario = async (req, res) => {
    const user_id = req.params.id;

    try {
        const user = await User.findOne({ where: { id: user_id } });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        await user.destroy(); // Deleta o usuário
        res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar o usuário:', error);
        res.status(500).json({ message: 'Erro ao deletar o usuário' });
    }
};

// Função para trocar a imagem do perfil
const trocar_img = async (req, res) => {
    const user_id = req.params.id;
    const nova_img_url = req.body.url;

    if (!nova_img_url) {
        return res.status(400).json({ message: 'Imagem não encontrada' });
    }

    try {
        const user = await User.findOne({ where: { id: user_id } });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        user.profile_image = nova_img_url; // Atualiza a URL da imagem
        await user.save(); // Salva no banco
        res.status(200).json(user); // Retorna o usuário atualizado
    } catch (error) {
        console.error('Erro ao trocar a imagem:', error);
        res.status(500).json({ message: 'Erro ao trocar a imagem do perfil' });
    }
};

export { pegar_usuario, listar_usuarios, deletar_usuario, trocar_img };
