<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminReportController extends BaseApiController
{
    /**
     * List all reports.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $reports = Report::with('reporter')->orderBy('created_at', 'desc')->paginate(20);
        return $this->sendResponse($reports, 'Reports retrieved successfully');
    }

    /**
     * Show report details.
     *
     * @param Report $report
     * @return JsonResponse
     */
    public function show(Report $report): JsonResponse
    {
        return $this->sendResponse($report, 'Report details retrieved');
    }

    /**
     * Resolve a report and optionally ban the entity.
     *
     * @param Request $request
     * @param Report $report
     * @return JsonResponse
     */
    public function resolve(Request $request, Report $report): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:resolved,dismissed',
            'ban_entity' => 'nullable|boolean'
        ]);

        $report->update(['status' => $validated['status']]);

        if (!empty($validated['ban_entity'])) {
            // Logic to ban the entity based on reportable_type
            $entity = $report->reportable;
            if ($entity) {
                if ($report->reportable_type === 'user' || $report->reportable_type === 'App\Models\User') {
                    $entity->update(['banned_at' => now()]);
                } elseif ($report->reportable_type === 'listing' || $report->reportable_type === 'App\Models\Listing') {
                    $entity->update(['status' => 'suspended']);
                }
            }
        }

        return $this->sendResponse($report, 'Report resolved successfully');
    }
}
