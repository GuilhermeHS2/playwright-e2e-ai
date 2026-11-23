import { z } from 'zod';

const id = z.string().regex(/^[A-Za-z0-9]{16}$/);

export const messageSchema = z.object({ message: z.string() });
export const createdSchema = z.object({ message: z.literal('Cadastro realizado com sucesso'), _id: id });
export const loginSchema = z.object({
  message: z.literal('Login realizado com sucesso'),
  authorization: z.string().regex(/^Bearer \S+$/),
});

export const userSchema = z.strictObject({
  nome: z.string(),
  email: z.email(),
  password: z.string(),
  administrador: z.enum(['true', 'false']),
  _id: id,
});

export const productSchema = z.strictObject({
  nome: z.string(),
  preco: z.number().int().positive(),
  descricao: z.string(),
  quantidade: z.number().int().nonnegative(),
  _id: id,
});

export const cartSchema = z.strictObject({
  produtos: z.array(z.strictObject({ idProduto: id, quantidade: z.number().int().positive(), precoUnitario: z.number() })),
  precoTotal: z.number(),
  quantidadeTotal: z.number().int(),
  idUsuario: id,
  _id: id,
});
