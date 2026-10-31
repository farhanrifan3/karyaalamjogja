"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { loginAction, type LoginState } from "@/app/admin/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="admin-btn admin-btn--solid admin-btn--wide"
      disabled={pending}
    >
      {pending ? "Memeriksa..." : "Masuk"}
    </button>
  );
}

export function LoginForm({ showDefaultHint }: { showDefaultHint: boolean }) {
  const [state, formAction] = useActionState<LoginState, FormData>(
    loginAction,
    {},
  );

  return (
    <form action={formAction} className="admin-login__form">
      <div className="admin-field">
        <label htmlFor="password">Kata sandi</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          aria-invalid={Boolean(state.error)}
          aria-describedby={state.error ? "password-error" : undefined}
        />
        {state.error ? (
          <p className="admin-field__error" id="password-error" role="alert">
            {state.error}
          </p>
        ) : null}
      </div>

      <SubmitButton />

      {showDefaultHint ? (
        <p className="admin-login__hint">
          Kata sandi awal: <code>karyaalam</code>. Ganti lewat variabel
          lingkungan <code>ADMIN_PASSWORD</code> sebelum dipakai di server.
        </p>
      ) : null}
    </form>
  );
}
