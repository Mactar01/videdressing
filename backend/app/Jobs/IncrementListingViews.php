<?php

namespace App\Jobs;

use App\Models\Listing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class IncrementListingViews implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * @var int
     */
    protected $listingId;

    /**
     * Create a new job instance.
     *
     * @param int $listingId
     * @return void
     */
    public function __construct(int $listingId)
    {
        $this->listingId = $listingId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Listing::where('id', $this->listingId)->increment('views_count');
    }
}
