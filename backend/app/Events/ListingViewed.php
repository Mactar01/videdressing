<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Jobs\IncrementListingViews;

class ListingViewed implements ShouldQueue
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var int
     */
    public $listingId;

    /**
     * Create a new event instance.
     *
     * @param int $listingId
     * @return void
     */
    public function __construct(int $listingId)
    {
        $this->listingId = $listingId;
        
        // Dispatch job asynchronously
        IncrementListingViews::dispatch($listingId);
    }
}
