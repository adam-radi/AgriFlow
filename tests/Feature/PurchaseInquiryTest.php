<?php

namespace Tests\Feature;

use App\Enums\InquiryStatus;
use App\Models\Product;
use App\Models\PurchaseInquiry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PurchaseInquiryTest extends TestCase
{
    use RefreshDatabase;

    private User $farmer;
    private User $buyer;
    private User $otherBuyer;
    private Product $product;

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

        $this->otherBuyer = User::factory()->create([
            'role' => 'Client',
        ]);

        $this->product = Product::factory()->create([
            'user_id' => $this->farmer->id,
            'is_available' => true,
            'base_price' => 20.0,
        ]);
    }

    public function test_client_can_create_purchase_inquiry(): void
    {
        $response = $this->actingAs($this->buyer)->postJson('/api/purchase-inquiries', [
            'product_id'            => $this->product->id,
            'quantity'              => 500,
            'proposed_price'        => 16.5,
            'delivery_zone'         => 'Casablanca-Settat',
            'desired_delivery_date' => now()->addDays(5)->toDateString(),
            'message'               => 'Besoin de 500kg pour approvisionnement hebdomadaire.',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('purchase_inquiries', [
            'buyer_id'       => $this->buyer->id,
            'farmer_id'      => $this->farmer->id,
            'product_id'     => $this->product->id,
            'status'         => InquiryStatus::Pending,
            'initial_price'  => 16.5,
            'current_price'  => 16.5,
            'current_quantity' => 500,
        ]);

        $this->assertDatabaseHas('inquiry_negotiations', [
            'sender_id'      => $this->buyer->id,
            'sender_role'    => 'buyer',
            'proposed_price' => 16.5,
        ]);
    }

    public function test_farmer_cannot_inquire_on_their_own_product(): void
    {
        $response = $this->actingAs($this->farmer)->postJson('/api/purchase-inquiries', [
            'product_id'     => $this->product->id,
            'quantity'       => 100,
            'proposed_price' => 15.0,
        ]);

        $response->assertForbidden();
    }

    public function test_farmer_can_view_and_counter_offer(): void
    {
        $inquiry = PurchaseInquiry::create([
            'buyer_id'         => $this->buyer->id,
            'farmer_id'        => $this->farmer->id,
            'product_id'       => $this->product->id,
            'status'           => InquiryStatus::Pending,
            'initial_quantity' => 100,
            'initial_price'    => 14.0,
            'current_quantity' => 100,
            'current_price'    => 14.0,
        ]);

        // Farmer makes a counter offer: 18 DH
        $response = $this->actingAs($this->farmer)->postJson("/api/purchase-inquiries/{$inquiry->id}/counter-offer", [
            'proposed_price'    => 18.0,
            'proposed_quantity' => 100,
            'message'           => '14 DH est en dessous du coût de revient. Je vous propose 18 DH.',
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('purchase_inquiries', [
            'id'            => $inquiry->id,
            'status'        => InquiryStatus::Negotiating,
            'current_price' => 18.0,
        ]);

        $this->assertDatabaseHas('inquiry_negotiations', [
            'purchase_inquiry_id' => $inquiry->id,
            'sender_id'           => $this->farmer->id,
            'sender_role'         => 'farmer',
            'proposed_price'      => 18.0,
        ]);
    }

    public function test_buyer_and_farmer_can_accept_and_confirm_agreement(): void
    {
        $inquiry = PurchaseInquiry::create([
            'buyer_id'         => $this->buyer->id,
            'farmer_id'        => $this->farmer->id,
            'product_id'       => $this->product->id,
            'status'           => InquiryStatus::Negotiating,
            'initial_quantity' => 200,
            'initial_price'    => 15.0,
            'current_quantity' => 200,
            'current_price'    => 17.0,
        ]);

        // Buyer accepts the proposal
        $acceptResponse = $this->actingAs($this->buyer)->postJson("/api/purchase-inquiries/{$inquiry->id}/accept");
        $acceptResponse->assertOk();

        $this->assertEquals(InquiryStatus::Accepted, $inquiry->fresh()->status);

        // Farmer confirms the final transaction agreement
        $confirmResponse = $this->actingAs($this->farmer)->postJson("/api/purchase-inquiries/{$inquiry->id}/confirm");
        $confirmResponse->assertOk();

        $this->assertEquals(InquiryStatus::Confirmed, $inquiry->fresh()->status);
    }

    public function test_unauthorized_user_cannot_view_or_negotiate_inquiry(): void
    {
        $inquiry = PurchaseInquiry::create([
            'buyer_id'         => $this->buyer->id,
            'farmer_id'        => $this->farmer->id,
            'product_id'       => $this->product->id,
            'status'           => InquiryStatus::Pending,
            'initial_quantity' => 100,
            'initial_price'    => 15.0,
            'current_quantity' => 100,
            'current_price'    => 15.0,
        ]);

        $response = $this->actingAs($this->otherBuyer)->getJson("/api/purchase-inquiries/{$inquiry->id}");
        $response->assertForbidden();

        $counterResponse = $this->actingAs($this->otherBuyer)->postJson("/api/purchase-inquiries/{$inquiry->id}/counter-offer", [
            'proposed_price'    => 10.0,
            'proposed_quantity' => 50,
        ]);
        $counterResponse->assertForbidden();
    }

    public function test_farmer_can_update_delivery_tracking(): void
    {
        $inquiry = PurchaseInquiry::create([
            'buyer_id'         => $this->buyer->id,
            'farmer_id'        => $this->farmer->id,
            'product_id'       => $this->product->id,
            'status'           => InquiryStatus::Confirmed,
            'initial_quantity' => 100,
            'initial_price'    => 15.0,
            'current_quantity' => 100,
            'current_price'    => 15.0,
        ]);

        $inDelivery = $this->actingAs($this->farmer)->postJson("/api/purchase-inquiries/{$inquiry->id}/delivery-status/in_delivery");
        $inDelivery->assertOk();
        $this->assertEquals(InquiryStatus::InDelivery, $inquiry->fresh()->status);

        $delivered = $this->actingAs($this->farmer)->postJson("/api/purchase-inquiries/{$inquiry->id}/delivery-status/delivered");
        $delivered->assertOk();
        $this->assertEquals(InquiryStatus::Delivered, $inquiry->fresh()->status);
    }
}
