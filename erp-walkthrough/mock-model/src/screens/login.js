import { esc, toast, notDefined } from '../ui.js';
import { announce } from '../spec.js';

const json = async (name) => (await fetch(new URL(`../../data/${name}.json`, import.meta.url))).json();

export async function showLogin(root, onLogin) {
  const { users } = await json('users');
  root.innerHTML = `
    <div class="login">
      <form class="card login-card" id="login-form">
        <div class="brand"><span class="logo">T</span> Tera EV</div>
        <h1>Sign in</h1>
        <label class="field"><span>User ID</span><input name="userId" autocomplete="username" autofocus></label>
        <label class="field" id="role-field" hidden><span>Role</span><select name="role"></select></label>
        <label class="field"><span>Password</span><input name="password" type="password" autocomplete="current-password"></label>
        <label class="check"><input type="checkbox" name="remember" data-action="remember-me"> Remember me</label>
        <button class="btn btn-primary" data-action="sign-in">Sign in</button>
        <button type="button" class="link" data-action="forgot-password">Forgot password?</button>
        <p class="muted small">Sample logins: ${users.map((u) => esc(u.id)).join(', ')}. Any password works.</p>
      </form>
    </div>`;

  const form = root.querySelector('#login-form');
  const roleField = root.querySelector('#role-field');
  const roleSelect = form.elements.role;
  const find = () => users.find((u) => u.id.toLowerCase() === form.elements.userId.value.trim().toLowerCase());

  form.elements.userId.oninput = () => {
    const u = find();
    roleField.hidden = !(u && u.roles.length > 1);
    roleSelect.innerHTML = u ? u.roles.map((r, i) => `<option value="${i}">${esc(r.label)}</option>`).join('') : '';
  };
  root.querySelector('[data-action="forgot-password"]').onclick = () => announce('D02');
  form.onsubmit = (e) => {
    e.preventDefault();
    const user = find();
    if (!user) return notDefined(`User "${form.elements.userId.value}" is not defined. Sample logins: ${users.map((u) => u.id).join(', ')}.`);
    onLogin(user, user.roles[Number(roleSelect.value) || 0]);
  };
}
