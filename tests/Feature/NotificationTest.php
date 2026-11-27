<?php

namespace Tests\Feature;

use App\Enums\InquiryStatus;
use App\Models\Product;
use App\Models\PurchaseInquiry;
use App\Models\Role;
use App\Models\User;
use App\Notifications\InquiryCreatedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    protected User $farmer;
    protected User $buyer;
    protected User $unauthorizedUser;
    protected Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        $this->farmer = User::factory()->create([
            'role' => 'Farmer',
            'farmer_status' => 'approved',
        ]);

        $this->buyer = User::factory()->create([
            'role' => 'Client',
        ]);

        $this->unauthorizedUser = User::factory()->create([
            'role' => 'Client',
        ]);

        $this->product = Product::factory()->create([
            'user_id'      => $this->farmer->id,
            'base_price'   => 20.0,
            'is_available' => true,
        ]);
    }

    public function test_inquiry_creation_notifies_farmer(): void
    {
        $response = $this->actingAs($this->buyer)->postJson('/api/purchase-inquiries', [
            'product_id'     => $this->product->id,
            'quantity'       => 150,
            'proposed_price' => 18.5,
            'delivery_zone'  => 'Rabat',
            'message'        => 'Test proposition',
        ]);

        $response->assertCreated();

        $this->assertEquals(1, $this->farmer->unreadNotifications()->count());
        $notification = $this->farmer->unreadNotifications()->first();
        $this->assertEquals('inquiry_created', $notification->data['type']);
        $this->assertStringContainsString('150', $notification->data['message']);
    }

    public function test_farmer_accepting_notifies_buyer(): void
    {
        $inquiry = PurchaseInquiry::create([
            'buyer_id'         => $this->buyer->id,
            'farmer_id'        => $this->farmer->id,
            'product_id'       => $this->product->id,
            'status'           => InquiryStatus::Pending,
            'initial_quantity' => 100,
            'initial_price'    => 18.0,
            'current_quantity' => 100,
            'current_price'    => 18.0,
        ]);

        $response = $this->actingAs($this->farmer)->postJson("/api/purchase-inquiries/{$inquiry->id}/accept");
        $response->assertOk();

        $this->assertEquals(1, $this->buyer->unreadNotifications()->count());
        $notification = $this->buyer->unreadNotifications()->first();
        $this->assertEquals('inquiry_accepted', $notification->data['type']);
    }

    public function test_farmer_rejecting_notifies_buyer_with_reason(): void
    {
        $inquiry = PurchaseInquiry::create([
            'buyer_id'         => $this->buyer->id,
            'farmer_id'        => $this->farmer->id,
            'product_id'       => $this->product->id,
            'status'           => InquiryStatus::Pending,
            'initial_quantity' => 100,
            'initial_price'    => 18.0,
            'current_quantity' => 100,
            'current_price'    => 18.0,
        ]);

        $response = $this->actingAs($this->farmer)->postJson("/api/purchase-inquiries/{$inquiry->id}/reject", [
            'message' => 'Stock épuisé pour cette période',
        ]);
        $response->assertOk();

        $this->assertEquals(1, $this->buyer->unreadNotifications()->count());
        $notification = $this->buyer->unreadNotifications()->first();
        $this->assertEquals('inquiry_rejected', $notification->data['type']);
        $this->assertStringContainsString('Stock épuisé', $notification->data['message']);
    }

    public function test_buyer_can_fetch_and_mark_notifications_as_read(): void
    {
        $inquiry = PurchaseInquiry::create([
            'buyer_id'         => $this->buyer->id,
            'farmer_id'        => $this->farmer->id,
            'product_id'       => $this->product->id,
            'status'           => InquiryStatus::Pending,
            'initial_quantity' => 100,
            'initial_price'    => 18.0,
            'current_quantity' => 100,
            'current_price'    => 18.0,
        ]);

        // Trigger notification
        $this->farmer->notify(new InquiryCreatedNotification($inquiry));
        $this->assertEquals(1, $this->farmer->unreadNotifications()->count());

        // Fetch notifications
        $response = $this->actingAs($this->farmer)->getJson('/api/notifications');
        $response->assertOk()
            ->assertJsonStructure([
                'unread_count',
                'data' => [
                    '*' => ['id', 'type', 'title', 'message', 'link', 'is_read', 'created_at']
                ]
            ]);
        $this->assertEquals(1, $response->json('unread_count'));

        $notificationId = $response->json('data.0.id');

        // Mark single as read
        $readResponse = $this->actingAs($this->farmer)->postJson("/api/notifications/{$notificationId}/read");
        $readResponse->assertOk()
            ->assertJson([
                'unread_count' => 0,
                'data' => [
                    'id'      => $notificationId,
                    'is_read' => true,
                ]
            ]);

        $this->assertEquals(0, $this->farmer->fresh()->unreadNotifications()->count());
    }

    public function test_mark_all_as_read(): void
    {
        $inquiry = PurchaseInquiry::create([
            'buyer_id'         => $this->buyer->id,
            'farmer_id'        => $this->farmer->id,
            'product_id'       => $this->product->id,
            'status'           => InquiryStatus::Pending,
            'initial_quantity' => 100,
            'initial_price'    => 18.0,
            'current_quantity' => 100,
            'current_price'    => 18.0,
        ]);

        $this->farmer->notify(new InquiryCreatedNotification($inquiry));
        $this->farmer->notify(new InquiryCreatedNotification($inquiry));
        $this->assertEquals(2, $this->farmer->unreadNotifications()->count());

        $response = $this->actingAs($this->farmer)->postJson('/api/notifications/read-all');
        $response->assertOk()->assertJson(['unread_count' => 0]);

        $this->assertEquals(0, $this->farmer->fresh()->unreadNotifications()->count());
    }

    public function test_user_cannot_mark_other_user_notification_as_read(): void
    {
        $inquiry = PurchaseInquiry::create([
            'buyer_id'         => $this->buyer->id,
            'farmer_id'        => $this->farmer->id,
            'product_id'       => $this->product->id,
            'status'           => InquiryStatus::Pending,
            'initial_quantity' => 100,
            'initial_price'    => 18.0,
            'current_quantity' => 100,
            'current_price'    => 18.0,
        ]);

        $this->farmer->notify(new InquiryCreatedNotification($inquiry));
        $notifId = $this->farmer->notifications()->first()->id;

        // unauthorized user tries to mark it as read
        $response = $this->actingAs($this->unauthorizedUser)->postJson("/api/notifications/{$notifId}/read");
        $response->assertNotFound();
    }
}
