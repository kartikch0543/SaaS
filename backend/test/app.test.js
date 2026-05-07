import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();

test("health endpoint returns service metadata", async () => {
  const response = await request(app).get("/health");
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.ok, true);
});

test("blog listing returns seeded posts", async () => {
  const response = await request(app).get("/api/blogs");
  assert.equal(response.statusCode, 200);
  assert.ok(response.body.items.length >= 3);
});

