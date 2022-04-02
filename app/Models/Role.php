<?php

namespace App\Models;

use App\Traits\Uuid;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    use Uuid;

    protected $keyType = 'string';
    public $incrementing = false;
}
