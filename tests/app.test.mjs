import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("authentication state selects the login or home screen", async () => {
  const page = await readFile("src/app/page.tsx", "utf8");

  assert.match(page, /!ctx\.isLoggedIn && <Login/);
  assert.match(page, /ctx\.isLoggedIn && <Home/);
  assert.match(page, /<MainHeader/);
});

test("the authentication provider exposes login and logout handlers", async () => {
  const context = await readFile("src/app/store/auth-context.tsx", "utf8");

  assert.match(context, /onLogin/);
  assert.match(context, /onLogout/);
  assert.match(context, /setIsLoggedIn/);
});
