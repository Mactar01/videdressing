<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Listing;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_report_a_listing()
    {
        $user = User::factory()->create();
        $listing = Listing::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/reports', [
            'reportable_id' => $listing->id,
            'reportable_type' => 'App\Models\Listing',
            'reason' => 'inappropriate',
            'description' => 'Image inappropriée.'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('reports', [
            'reportable_id' => $listing->id,
            'reportable_type' => 'App\Models\Listing',
            'reason' => 'inappropriate',
        ]);
    }

    public function test_authenticated_user_can_report_a_user()
    {
        $reporter = User::factory()->create();
        $reportedUser = User::factory()->create();

        $response = $this->actingAs($reporter)->postJson('/api/v1/reports', [
            'reportable_id' => $reportedUser->id,
            'reportable_type' => 'App\Models\User',
            'reason' => 'scam',
            'description' => 'Comportement suspect.'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('reports', [
            'reportable_id' => $reportedUser->id,
            'reportable_type' => 'App\Models\User',
            'reason' => 'scam',
        ]);
    }

    public function test_cannot_report_with_invalid_reason()
    {
        $user = User::factory()->create();
        $listing = Listing::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/reports', [
            'reportable_id' => $listing->id,
            'reportable_type' => 'App\Models\Listing',
            'reason' => 'invalid_reason_type',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['reason']);
    }
}
