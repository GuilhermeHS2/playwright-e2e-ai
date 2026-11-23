import { test, expect, newProduct } from '../../fixtures/api';
import { createdSchema, messageSchema, productSchema } from '../../fixtures/schemas';

test.describe('/produtos', () => {
  test('an admin creates a product', { tag: '@smoke' }, async ({ api, data, adminToken }) => {
    const product = newProduct();

    const res = await api.createProduct(product, adminToken);

    expect(res.status()).toBe(201);
    const { _id } = createdSchema.parse(await res.json());
    data.trackProduct(_id);
    const read = await api.getProduct(_id);
    expect(productSchema.parse(await read.json())).toEqual({ ...product, _id });
  });

  test('refuses to create a product without a token', { tag: '@regression' }, async ({ api }) => {
    const res = await api.createProduct(newProduct());

    expect(res.status()).toBe(401);
    expect(messageSchema.parse(await res.json()).message).toContain('Token de acesso ausente');
  });

  test('refuses to create a product with a non-admin token', { tag: '@regression' }, async ({ api, userToken }) => {
    const res = await api.createProduct(newProduct(), userToken);

    expect(res.status()).toBe(403);
    expect(messageSchema.parse(await res.json()).message).toBe('Rota exclusiva para administradores');
  });
});
