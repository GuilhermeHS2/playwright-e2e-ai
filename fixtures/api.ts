import { randomUUID } from 'node:crypto';
import { test as base, expect } from '@playwright/test';
import { ServeRestClient, type Product, type User } from './serverest';

const uid = () => randomUUID().slice(0, 8);

export const newUser = (admin = false): User => {
  const id = uid();
  return { nome: `QA ${id}`, email: `qa.${id}@example.com`, password: `pw-${id}`, administrador: admin ? 'true' : 'false' };
};

export const newProduct = (quantidade = 10): Product => ({
  nome: `Product ${uid()}`,
  preco: 25,
  descricao: 'Created by the Playwright suite',
  quantidade,
});

// Creates unique users/products for one test and deletes them afterwards, so tests can run in parallel.
export class DataFactory {
  private readonly users: string[] = [];
  private readonly products: string[] = [];
  private readonly tokens: string[] = [];
  private admin?: Promise<string>;

  constructor(private readonly api: ServeRestClient) {}

  trackUser(id: string) {
    this.users.push(id);
  }
  trackProduct(id: string) {
    this.products.push(id);
  }

  async user(admin = false) {
    const user = newUser(admin);
    const res = await this.api.createUser(user);
    expect(res.status(), await res.text()).toBe(201);
    const { _id } = await res.json();
    this.trackUser(_id);
    return { ...user, _id: _id as string };
  }

  async login(user: User) {
    const res = await this.api.login(user.email, user.password);
    expect(res.status(), await res.text()).toBe(200);
    const { authorization } = await res.json();
    this.tokens.push(authorization);
    return authorization as string;
  }

  adminToken() {
    this.admin ??= this.user(true).then((u) => this.login(u));
    return this.admin;
  }

  async product(quantidade?: number) {
    const product = newProduct(quantidade);
    const res = await this.api.createProduct(product, await this.adminToken());
    expect(res.status(), await res.text()).toBe(201);
    const { _id } = await res.json();
    this.trackProduct(_id);
    return { ...product, _id: _id as string };
  }

  // Order matters: ServeRest refuses to delete products or users that are still in a cart.
  async cleanup() {
    for (const token of this.tokens) await this.api.cancelPurchase(token);
    if (this.products.length) {
      const token = await this.adminToken();
      for (const id of this.products) await this.api.deleteProduct(id, token);
    }
    for (const id of this.users) await this.api.deleteUser(id);
  }
}

type ApiFixtures = {
  api: ServeRestClient;
  data: DataFactory;
  adminToken: string;
  userToken: string;
};

export const test = base.extend<ApiFixtures>({
  api: async ({ request }, use) => use(new ServeRestClient(request)),
  data: async ({ api }, use) => {
    const data = new DataFactory(api);
    await use(data);
    await data.cleanup();
  },
  adminToken: async ({ data }, use) => use(await data.adminToken()),
  userToken: async ({ data }, use) => use(await data.login(await data.user())),
});

export { expect };
