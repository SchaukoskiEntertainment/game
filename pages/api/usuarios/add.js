import { connectMongo } from "../../../utils/connectMongo"
import Usuario from "../../../models/Usuario"

export default async function addUsuario(req, res) {
  const { email, nomeAvatar, senha} = req.body

  if (!email) {
    throw new Error("Email não encontrado!")
  } else if (!nomeAvatar) {
    throw new Error("Nome do avatar não encontrado!")
  } else if (!senha) {
    throw new Error("Senha não encontrada!")
  }

  await connectMongo()

  const usuario = await Usuario.create(req.body)

  res.status(201).json({message: "Cadastro efetuado com sucesso!"})
  //await connectMongo()
/*
  const usuario = await Usuario.create(req.body)

  res.json({usuario})*/

  //res.send({ test: "test"})

}