<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{RoleController, UserController};
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // User & Role - Permission
    Route::resource('role', RoleController::class, ['except' => ['show']]);
    Route::resource('user', UserController::class, ['except' => ['show']]);
    Route::get('user/datatables', [UserController::class, 'datatables'])->name('user.datatables');
});

// Set Super Admin
Route::get('set-super-admin', [UserController::class, 'setSuperAdmin']);

require __DIR__.'/auth.php';
