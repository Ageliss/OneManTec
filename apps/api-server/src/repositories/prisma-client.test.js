const test = require("node:test");
const assert = require("node:assert/strict");

const { createPrismaClient } = require("./prisma-client.js");

test("createPrismaClient instantiates the provided PrismaClient class", () => {
  class FakePrismaClient {
    constructor() {
      this.connected = false;
    }
  }

  const prisma = createPrismaClient({
    PrismaClient: FakePrismaClient,
  });

  assert.equal(prisma instanceof FakePrismaClient, true);
});

test("createPrismaClient throws a clear error when @prisma/client is unavailable", () => {
  assert.throws(
    () => createPrismaClient(),
    /Prisma repository mode requires @prisma\/client/,
  );
});
