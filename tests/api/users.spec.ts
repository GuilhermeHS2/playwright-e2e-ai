import { test, expect, newUser } from '../../fixtures/api';
import { createdSchema, messageSchema, userSchema } from '../../fixtures/schemas';

test.describe('/usuarios', () => {
  test('creates, reads, updates and deletes a user', { tag: '@smoke' }, async ({ api, data }) => {
    const user = newUser();

    const created = await api.createUser(user);
    expect(created.status()).toBe(201);
    const { _id } = createdSchema.parse(await created.json());
    data.trackUser(_id);

    const read = await api.getUser(_id);
    expect(read.status()).toBe(200);
    expect(userSchema.parse(await read.json())).toEqual({ ...user, _id });

    const renamed = { ...user, nome: `${user.nome} renamed` };
    const updated = await api.updateUser(_id, renamed);
    expect(updated.status()).toBe(200);
    expect(messageSchema.parse(await updated.json()).message).toBe('Registro alterado com sucesso');
    expect(await (await api.getUser(_id)).json()).toMatchObject({ nome: renamed.nome });

    const deleted = await api.deleteUser(_id);
    expect(deleted.status()).toBe(200);
    expect(messageSchema.parse(await deleted.json()).message).toBe('Registro excluído com sucesso');
    expect((await api.getUser(_id)).status()).toBe(400);
  });

  test('rejects a duplicate email with 400', { tag: '@regression' }, async ({ api, data }) => {
    const existing = await data.user();

    const res = await api.createUser({ ...newUser(), email: existing.email });

    expect(res.status()).toBe(400);
    expect(messageSchema.parse(await res.json()).message).toBe('Este email já está sendo usado');
  });
});
