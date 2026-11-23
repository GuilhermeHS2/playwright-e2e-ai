import type { APIRequestContext } from '@playwright/test';

export type User = { nome: string; email: string; password: string; administrador: 'true' | 'false' };
export type Product = { nome: string; preco: number; descricao: string; quantidade: number };
export type CartItem = { idProduto: string; quantidade: number };

// Thin client over the ServeRest routes. Returns the raw response so tests assert status and body.
export class ServeRestClient {
  constructor(private readonly request: APIRequestContext) {}

  login(email: string, password: string) {
    return this.request.post('/login', { data: { email, password } });
  }

  createUser(user: User) {
    return this.request.post('/usuarios', { data: user });
  }
  getUser(id: string) {
    return this.request.get(`/usuarios/${id}`);
  }
  updateUser(id: string, user: User) {
    return this.request.put(`/usuarios/${id}`, { data: user });
  }
  deleteUser(id: string) {
    return this.request.delete(`/usuarios/${id}`);
  }

  createProduct(product: Product, token?: string) {
    return this.request.post('/produtos', { data: product, headers: auth(token) });
  }
  getProduct(id: string) {
    return this.request.get(`/produtos/${id}`);
  }
  deleteProduct(id: string, token: string) {
    return this.request.delete(`/produtos/${id}`, { headers: auth(token) });
  }

  createCart(produtos: CartItem[], token: string) {
    return this.request.post('/carrinhos', { data: { produtos }, headers: auth(token) });
  }
  getCart(id: string) {
    return this.request.get(`/carrinhos/${id}`);
  }
  concludePurchase(token: string) {
    return this.request.delete('/carrinhos/concluir-compra', { headers: auth(token) });
  }
  cancelPurchase(token: string) {
    return this.request.delete('/carrinhos/cancelar-compra', { headers: auth(token) });
  }
}

const auth = (token?: string) => (token ? { Authorization: token } : undefined);
