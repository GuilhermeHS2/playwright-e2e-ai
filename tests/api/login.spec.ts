import { test, expect } from '../../fixtures/api';
import { loginSchema, messageSchema } from '../../fixtures/schemas';

test.describe('POST /login', () => {
  test('returns a bearer token for valid credentials', { tag: '@smoke' }, async ({ api, data }) => {
    const user = await data.user();

    const res = await api.login(user.email, user.password);

    expect(res.status()).toBe(200);
    loginSchema.parse(await res.json());
  });

  test('rejects a wrong password with 401', { tag: '@regression' }, async ({ api, data }) => {
    const user = await data.user();

    const res = await api.login(user.email, 'wrong-password');

    expect(res.status()).toBe(401);
    expect(messageSchema.parse(await res.json()).message).toBe('Email e/ou senha inválidos');
  });

  test('validates the request body with 400', { tag: '@regression' }, async ({ request }) => {
    const res = await request.post('/login', { data: { email: 'not-an-email' } });

    expect(res.status()).toBe(400);
    expect(await res.json()).toEqual({
      email: 'email deve ser um email válido',
      password: 'password é obrigatório',
    });
  });
});
