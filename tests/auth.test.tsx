import { useContext } from "react";
import { afterEach, beforeEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import AuthContext, { AuthContextProvider } from "../src/app/store/auth-context";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

function Harness() {
  const auth = useContext(AuthContext);
  return <>
    <p>{auth.isLoggedIn ? "Home screen" : "Login screen"}</p>
    <button onClick={() => auth.onLogin("demo@example.test", "local-demo")}>Login</button>
    <button onClick={auth.onLogout}>Logout</button>
  </>;
}

it("updates the UI and local persistence on login/logout", () => {
  render(<AuthContextProvider><Harness /></AuthContextProvider>);
  expect(screen.getByText("Login screen")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", {name: "Login"}));
  expect(screen.getByText("Home screen")).toBeTruthy();
  expect(localStorage.getItem("isLoggedIn")).toBe("1");
  fireEvent.click(screen.getByRole("button", {name: "Logout"}));
  expect(screen.getByText("Login screen")).toBeTruthy();
  expect(localStorage.getItem("isLoggedIn")).toBeNull();
});

it("restores the demo login state when remounted", () => {
  localStorage.setItem("isLoggedIn", "1");
  render(<AuthContextProvider><Harness /></AuthContextProvider>);
  expect(screen.getByText("Home screen")).toBeTruthy();
});
