import { test, expect } from '../../fixtures/api';
import { cartSchema, createdSchema, messageSchema } from '../../fixtures/schemas';

test.describe('/carrinhos', () => {
  test('creating a cart reserves stock and totals the items', { tag: '@smoke' }, async ({ api, data, userToken }) => {
    const product = await data.product(10);

    const res = await api.createCart([{ idProduto: product._id, quantidade: 3 }], userToken);

    expect(res.status()).toBe(201);
    const { _id } = createdSchema.parse(await res.json());
    const cart = cartSchema.parse(await (await api.getCart(_id)).json());
    expect(cart.produtos).toEqual([{ idProduto: product._id, quantidade: 3, precoUnitario: product.preco }]);
    expect(cart).toMatchObject({ quantidadeTotal: 3, precoTotal: 3 * product.preco });
    expect(await (await api.getProduct(product._id)).json()).toMatchObject({ quantidade: 7 });
  });

  test('concluding a purchase removes the cart and keeps stock reduced', { tag: '@regression' }, async ({ api, data, userToken }) => {
    const product = await data.product(10);
    const { _id } = await (await api.createCart([{ idProduto: product._id, quantidade: 2 }], userToken)).json();

    const res = await api.concludePurchase(userToken);

    expect(res.status()).toBe(200);
    expect(messageSchema.parse(await res.json()).message).toBe('Registro excluído com sucesso');
    expect((await api.getCart(_id)).status()).toBe(400);
    expect(await (await api.getProduct(product._id)).json()).toMatchObject({ quantidade: 8 });
  });

  test('cancelling a purchase removes the cart and restores stock', { tag: '@regression' }, async ({ api, data, userToken }) => {
    const product = await data.product(10);
    const { _id } = await (await api.createCart([{ idProduto: product._id, quantidade: 2 }], userToken)).json();

    const res = await api.cancelPurchase(userToken);

    expect(res.status()).toBe(200);
    expect(messageSchema.parse(await res.json()).message).toBe(
      'Registro excluído com sucesso. Estoque dos produtos reabastecido',
    );
    expect((await api.getCart(_id)).status()).toBe(400);
    expect(await (await api.getProduct(product._id)).json()).toMatchObject({ quantidade: 10 });
  });

  test('refuses a cart with more items than in stock', { tag: '@regression' }, async ({ api, data, userToken }) => {
    const product = await data.product(2);

    const res = await api.createCart([{ idProduto: product._id, quantidade: 3 }], userToken);

    expect(res.status()).toBe(400);
    expect(await res.json()).toMatchObject({
      message: 'Produto não possui quantidade suficiente',
      item: { idProduto: product._id, quantidade: 3, quantidadeEstoque: 2 },
    });
  });
});
