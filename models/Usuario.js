import { Schema, model, models } from 'mongoose'

const usuarioSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	nomeAvatar: {
		type: String,
		required: true,
		unique: true
	},
	senha: {
		type: String,
		required: true
	}
})

const Usuario = models.Usuario || model('Usuario', usuarioSchema)

export default Usuario