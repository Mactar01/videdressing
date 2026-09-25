<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\Conversation;
use App\Models\Listing;
use App\Models\Message;
use App\Models\Order;
use App\Models\Report;
use App\Models\Review;
use App\Policies\ConversationPolicy;
use App\Policies\ListingPolicy;
use App\Policies\MessagePolicy;
use App\Policies\OrderPolicy;
use App\Policies\ReportPolicy;
use App\Policies\ReviewPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

/**
 * AppServiceProvider
 *
 * Fournisseur de services principal de l'application VideDressing.
 *
 * Sur Laravel 12, il n'existe plus d'AuthServiceProvider séparé :
 * l'enregistrement des policies Eloquent se fait directement ici via
 * {@see Gate::policy()}.
 *
 * Policies enregistrées :
 *  - {@see ListingPolicy}       → {@see Listing}
 *  - {@see ConversationPolicy}  → {@see Conversation}
 *  - {@see MessagePolicy}       → {@see Message}
 *  - {@see OrderPolicy}         → {@see Order}
 *  - {@see ReviewPolicy}        → {@see Review}
 *  - {@see ReportPolicy}        → {@see Report}
 */
class AppServiceProvider extends ServiceProvider
{
    /**
     * Enregistre les liaisons du conteneur IoC.
     *
     * Ici, on peut lier des interfaces à leurs implémentations concrètes.
     */
    public function register(): void
    {
        //
    }

    /**
     * Démarre les services de l'application.
     *
     * - Enregistre les policies Eloquent auprès de la Gate.
     */
    public function boot(): void
    {
        Gate::policy(Listing::class, ListingPolicy::class);
        Gate::policy(Conversation::class, ConversationPolicy::class);
        Gate::policy(Message::class, MessagePolicy::class);
        Gate::policy(Order::class, OrderPolicy::class);
        Gate::policy(Review::class, ReviewPolicy::class);
        Gate::policy(Report::class, ReportPolicy::class);
    }
}
