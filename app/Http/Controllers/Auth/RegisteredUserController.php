<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Enums\TipoDocumento;
use Illuminate\Validation\Rule;


class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],

            'tipo_documento' => ['required', Rule::in(TipoDocumento::options())],
            'numero_documento' => ['required', 'string', 'max:50', 'unique:users,numero_documento'],
            'fecha_nacimiento' => ['nullable', 'date'],
        ]);

        $user = User::create([
            'role' => 'paciente',
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),

            'tipo_documento' => $request->tipo_documento,
            'numero_documento' => $request->numero_documento,
            'fecha_nacimiento' => $request->fecha_nacimiento,
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Redirección según role
        if ($user->role === 'admin') {
            return redirect()->intended(route('login'));
        }

        return redirect()->intended('/');
    }
}
