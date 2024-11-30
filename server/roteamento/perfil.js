import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import { User } from '../db';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/uploadFotoPerfil', upload.single('foto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'Nenhuma imagem foi enviada' });
    }

    const result = await cloudinary.v2.uploader.upload_stream(
      { resource_type: 'image', public_id: `user_profiles/${Date.now()}` },
      async (error, result) => {
        if (error) {
          return res.status(500).send({ message: 'Erro no upload para o Cloudinary', error });
        }

        const userId = req.body.userId;
        
        await User.update(
          { fotoPerfil: result.secure_url },
          { where: { id: userId } }
        );

        return res.status(200).send({ message: 'Foto de perfil atualizada com sucesso', url: result.secure_url });
      }
    );

    req.file.stream.pipe(result);

  } catch (err) {
    res.status(500).send({ message: 'Erro ao processar a requisição', error: err });
  }
});

export default router;
