<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use App\Http\Controllers\Controller;
use App\Http\Requests\RoleRequest;
use App\Http\Resources\RoleCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        if(! auth()->user()->can('role-menu')) {
            abort(403);
        }

        $request->validate([
            'direction' => ['in:asc,desc'],
            'field' => ['in:name,email,created_at'],
        ]);

        // $query = Role::query();
        $query = Role::latest();

        if ($request->q) {
            $query->where('name', 'like', '%'. $request->q .'%');
        }

        if ($request->has(['field', 'direction'])) {
            $query->orderBy($request->field, $request->direction);
        }

        $roles = new RoleCollection($query->paginate($request->load));
        return inertia('Role/Index', [
            'roles' => $roles,
        ]);
    }

    public function create()
    {
        if(! auth()->user()->can('create-role')) {
            abort(403);
        }

        return inertia('Role/Form', [
            'action' => route('role.store'),
            'method' => 'POST',
            'permissions' => Permission::has('children')->with('children')->get(),
        ]);
    }

    public function store(RoleRequest $request)
    {
        if(! auth()->user()->can('create-role')) {
            abort(403);
        }

        DB::beginTransaction();
        try {
            $valid = $request->validated();
            unset($valid['permissions']);
            $valid['guard_name'] = request('guard_name') ?? 'web';
            
            $role = Role::create($valid);
            $permissions = $this->setPermissions(request('permissions'));
            $role->givePermissionTo($permissions);

            DB::commit();
            return ['status' => true, 'message' => "Role & Permission created"];
        } catch (\Throwable $th) {
            DB::rollBack();
            return ['status' => false, 'message' => $th->getMessage()];
        }
    }

    public function edit(Role $role)
    {
        if(! auth()->user()->can('edit-role')) {
            abort(403);
        }

        return inertia('Role/Form', [
            'role' => $role,
            'rolePermissions' => $role->getPermissionNames()->toArray(),
            'action' => route('role.update', $role),
            'method' => 'PUT',
            'permissions' => Permission::has('children')->with('children')->get(),
        ]);
    }

    public function update(RoleRequest $request, Role $role)
    {
        if(! auth()->user()->can('edit-role')) {
            abort(403);
        }

        DB::beginTransaction();
        try {
            $valid = $request->validated();
            unset($valid['permissions']);
            $valid['guard_name'] = request('guard_name') ?? 'web';

            $role->update($valid);
            $permissions = $this->setPermissions(request('permissions'));
            $role->syncPermissions($permissions);

            DB::commit();
            return ['status' => true, 'message' => "Role & Permission updated"];
        } catch (\Throwable $th) {
            DB::rollBack();
            return ['status' => false, 'message' => $th->getMessage()];
        }
    }

    public function destroy(Role $role)
    {
        if(! auth()->user()->can('delete-role')) {
            abort(403);
        }

        DB::beginTransaction();
        try {
            $role->syncPermissions([]);
            $role->delete();

            DB::commit();
            return ['status' => true, 'message' => "Role & Permission deleted"];
        } catch (\Throwable $th) {
            DB::rollBack();
            return ['status' => false, 'message' => $th->getMessage()];
        }
    }

    private function setPermissions($permissions)
    {
        $permissions = json_decode($permissions);
        foreach($permissions as $row) {
            $data = Permission::whereName($row)->first();
            if($data->parent) {
                if(!in_array($data->parent->name, $permissions, true)){
                    array_push($permissions, $data->parent->name);
                }
            }
        }
        return $permissions;
    }
}
