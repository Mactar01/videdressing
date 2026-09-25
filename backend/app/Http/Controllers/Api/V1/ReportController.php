<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Http\Requests\Report\StoreReportRequest;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReportController extends BaseApiController
{
    /**
     * Store a new report.
     *
     * @param StoreReportRequest $request
     * @return JsonResponse
     */
    public function store(StoreReportRequest $request): JsonResponse
    {
        $report = Report::create([
            'reporter_id' => $request->user()->id,
            'reportable_type' => $request->reportable_type,
            'reportable_id' => $request->reportable_id,
            'reason' => $request->reason,
            'comment' => $request->comment,
            'status' => 'pending',
        ]);

        return $this->sendResponse($report, 'Report submitted successfully', 201);
    }

    /**
     * List user's reports.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $reports = $request->user()->reports()->orderBy('created_at', 'desc')->paginate(15);
        
        return $this->sendResponse($reports, 'Reports retrieved successfully');
    }
}
