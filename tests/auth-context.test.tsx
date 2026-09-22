import { useContext } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import AuthContext, { AuthContextProvider } from "@/contexts/auth-context";

beforeEach(() => localStorage.clear());
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

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

it("keeps login and logout working when browser storage is blocked", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("Blocked"); });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Blocked"); });
  vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => { throw new Error("Blocked"); });
  render(<AuthContextProvider><Harness /></AuthContextProvider>);
  fireEvent.click(screen.getByRole("button", { name: "Login" }));
  expect(screen.getByText("Home screen")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Logout" }));
  expect(screen.getByText("Login screen")).toBeTruthy();
});

it("synchronizes session changes from another tab, including storage clear", () => {
  render(<AuthContextProvider><Harness /></AuthContextProvider>);
  act(() => {
    localStorage.setItem("isLoggedIn", "1");
    window.dispatchEvent(new StorageEvent("storage", { key: "isLoggedIn", storageArea: localStorage }));
  });
  expect(screen.getByText("Home screen")).toBeTruthy();
  act(() => {
    localStorage.clear();
    window.dispatchEvent(new StorageEvent("storage", { key: null, storageArea: localStorage }));
  });
  expect(screen.getByText("Login screen")).toBeTruthy();
});

it("does not persist credentials", () => {
  render(<AuthContextProvider><Harness /></AuthContextProvider>);
  fireEvent.click(screen.getByRole("button", { name: "Login" }));
  expect(localStorage.length).toBe(1);
  expect(localStorage.getItem("isLoggedIn")).toBe("1");
});
