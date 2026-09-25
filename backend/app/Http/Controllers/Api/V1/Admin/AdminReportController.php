<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminReportController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $reports = Report::with(['reporter:id,name'])->latest()->paginate(20);
        return $this->success($reports);
    }

    public function show(Report $report): JsonResponse
    {
        return $this->success($report->load('reporter'));
    }

    public function resolve(Request $request, Report $report): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'in:reviewed,dismissed,actioned'],
        ]);
        $report->update([
            'status' => $request->status,
            'resolved_by' => $request->user()->id,
            'resolved_at' => now(),
        ]);
        return $this->success($report, 'Report resolved');
    }
}
