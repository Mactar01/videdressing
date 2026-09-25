<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ReportPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create a report.
     */
    public function create(User $user): bool
    {
        // Any authenticated user can create a report
        return true;
    }
}
