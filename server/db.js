import Sequelize from 'sequelize';

const sequelize = new Sequelize(
    'spotfake',  // Nome do banco de dados
    'postgres',  // Usuário
    'postgres',  // Senha
    {
        host: 'localhost',  // Endereço do banco de dados
        port: 5432,         // Porta padrão do PostgreSQL
        dialect: 'postgres' // Tipo de banco de dados
    }
);

const User = sequelize.define('user', {
    nome: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    sobrenome: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    dataNasc: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.DataTypes.ENUM('ativo', 'inativo'),
        allowNull: false,
        defaultValue: 'inativo'
    },
    profile_image: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    }
});

const Artista = sequelize.define('artista', {
    nome: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    bio: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
    },
    imageUrl: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'artists',
});

const Album = sequelize.define('album', {
    title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    releaseYear: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    coverImageUrl: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'albums',
});

const Musica = sequelize.define('musica', {
    titulo: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    duracao: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    fileUrl: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'musicas',
});

// Relacionamentos entre as tabelas
Album.belongsTo(Artista, {
    foreignKey: 'artista_id',
    onDelete: 'CASCADE',
});
Album.hasMany(Musica, {
    foreignKey: 'album_id',
    as: 'Musicas',
});
Artista.hasMany(Album, {
    foreignKey: 'artista_id',
    as: 'Albums',
});
Musica.belongsTo(Album, {
    foreignKey: 'album_id',
    onDelete: 'CASCADE',
});
Musica.belongsTo(Artista, {
    foreignKey: 'artista_id',
    onDelete: 'CASCADE',
});

// Função para criar as tabelas
const criarTabelas = () => {
    sequelize.authenticate()
        .then(() => {
            console.log('Conectou ao banco de dados!');
            // Sincroniza os modelos com o banco de dados sem apagar os dados
            return sequelize.sync({ force: false, alter: true });  // ALTER: atualiza a estrutura sem apagar dados
        })
        .then(() => {
            console.log('Tabelas sincronizadas com sucesso!');
        })
        .catch((err) => {
            console.error('Erro ao conectar ou criar as tabelas:', err);
        });
};

// Chama a função para criar as tabelas ao rodar o código
criarTabelas();

export { User, sequelize, criarTabelas, Artista, Album, Musica };
