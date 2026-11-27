<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Local Admin frontend; production access requires backend authentication.
if (app()->environment('local')) {
    Route::redirect('/admin', '/admin/dashboard');
    Route::view('/admin/dashboard', 'admin.index')->name('admin.dashboard');
    Route::redirect('/admin-preview', '/admin/dashboard');
}
