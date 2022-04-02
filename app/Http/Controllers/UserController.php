<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth', ['except'=>'setSuperAdmin']);
    }

    public function index(Request $request)
    {
        if(! auth()->user()->can('user-menu')) {
            abort(403);
        }

        $request->validate([
            'direction' => ['in:asc,desc'],
            'field' => ['in:name,email,created_at'],
        ]);

        // $query = User::query();
        $query = User::latest();

        if ($request->q) {
            $query->where('name', 'like', '%'. $request->q .'%')
                ->orWhere('email', 'like', '%'. $request->q .'%');
        }

        if ($request->has(['field', 'direction'])) {
            $query->orderBy($request->field, $request->direction);
        }

        $users = new UserCollection($query->paginate($request->load));
        return inertia('User/Index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        if(! auth()->user()->can('create-user')) {
            abort(403);
        }

        return inertia('User/Form', [
            'action' => route('user.store'),
            'method' => 'POST',
            'roles' => Role::get(),
        ]);
    }

    public function store(UserRequest $request)
    {
        DB::beginTransaction();
        try {
            if(! auth()->user()->can('create-user')) {
                throw new \Exception("Permission denied !");
            }

            $roles = json_decode(request('roles'));
            if(count($roles) < 1) {
                throw new \Exception("Roles is required !");
            }
            
            $valid = $request->validated();
            $valid['password'] = Hash::make($valid['password']);
            
            $user = User::create($valid);
            $user->assignRole($roles);

            DB::commit();
            return ['status' => true, 'message' => "User created"];
        } catch (\Throwable $th) {
            DB::rollBack();
            return ['status' => false, 'message' => $th->getMessage()];
        }
    }

    public function edit(User $user)
    {
        if(! auth()->user()->can('edit-user')) {
            abort(403);
        }

        return inertia('User/Form', [
            'user' => $user,
            'userRoles' => $user->getRoleNames()->toArray(),
            'action' => route('user.update', $user),
            'method' => 'PUT',
            'roles' => Role::get(),
        ]);
    }

    public function update(UserRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            if(! auth()->user()->can('edit-user')) {
                throw new \Exception("Permission denied !");
            }

            $roles = json_decode(request('roles'));
            if(count($roles) < 1) {
                throw new \Exception("Roles is required !");
            }

            $valid = $request->validated();
            if (request('password')) {
                $valid['password'] = Hash::make(request('password'));
            }

            $user = User::findOrFail($id);
            $user->update($valid);
            $user->syncRoles($roles);

            DB::commit();
            return ['status' => true, 'message' => "User updated"];
        } catch (\Throwable $th) {
            DB::rollBack();
            return ['status' => false, 'message' => $th->getMessage()];
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            if(! auth()->user()->can('delete-user')) {
                throw new \Exception("Permission denied !");
            }
            
            $user = User::findOrFail($id);
            $user->syncRoles([]);
            $user->delete();

            DB::commit();
            return ['status' => true, 'message' => "User deleted"];
        } catch (\Throwable $th) {
            DB::rollBack();
            return ['status' => false, 'message' => $th->getMessage()];
        }
    }

    public function setSuperAdmin()
    {
        DB::beginTransaction();
        try {
            $permissions = \App\Models\Permission::get();
            if(!$permissions->count()) {
                $data = [
                    ['name'=>'user-menu','guard_name'=>'web'],
                    ['name'=>'role-menu','guard_name'=>'web'],
                    ['name'=>'create-user','guard_name'=>'web'],
                    ['name'=>'edit-user','guard_name'=>'web'],
                    ['name'=>'delete-user','guard_name'=>'web'],
                    ['name'=>'create-role','guard_name'=>'web'],
                    ['name'=>'edit-role','guard_name'=>'web'],
                    ['name'=>'delete-role','guard_name'=>'web'],
                ];
                foreach($data as $key => $row) {
                    if($key > 1 && strpos($row['name'], 'user') !== false) {
                        $row['parent_id'] = \App\Models\Permission::whereName('user-menu')->first()->id;
                    }elseif($key > 1 && strpos($row['name'], 'role') !== false) {
                        $row['parent_id'] = \App\Models\Permission::whereName('role-menu')->first()->id;
                    }
                    \App\Models\Permission::create($row);
                }
                $permissions = \App\Models\Permission::get();
            }

            $role = Role::whereName('Super Admin')->first();
            if(!$role) {
                $role = Role::create(['name'=>'Super Admin','guard_name'=>'web']);
            }
            $role->givePermissionTo($permissions);

            $user = User::first();
            if(!$user) {
                $user = User::create(['name'=>'first','email'=>'first@mail.com','password'=>Hash::make('12345678')]);
            }
            if($user->roles->count() > 0) {
                $user->syncRoles($role);
            }else {
                $user->assignRole($role);
            }

            DB::commit();
            return ['status' => true, 'message' => "{$user->name} is Super Admin"];
        } catch (\Throwable $th) {
            DB::rollBack();
            return ['status' => false, 'message' => $th->getMessage()];
        }
    }
}
