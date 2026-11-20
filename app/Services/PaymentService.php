<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PaymentService
{
    public function initiatePayment(Order $order, Request $request): Payment
    {
        if ($order->customer_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $existing = $order->payment;
        if ($existing && $existing->status === PaymentStatus::Paid) {
            throw ValidationException::withMessages([
                'order' => 'This order is already paid.',
            ]);
        }

        $payment = Payment::updateOrCreate(
            ['order_id' => $order->id],
            [
                'amount'   => $order->total_amount,
                'status'   => PaymentStatus::Pending,
                'provider' => $request->input('provider', 'manual'),
            ]
        );

        return $payment;
    }

    public function confirmPayment(Payment $payment, string $transactionId): Payment
    {
        $payment->update([
            'status'         => PaymentStatus::Paid,
            'transaction_id' => $transactionId,
        ]);

        $payment->order->update(['status' => OrderStatus::Confirmed]);

        return $payment->fresh('order');
    }

    public function failPayment(Payment $payment): Payment
    {
        $payment->update(['status' => PaymentStatus::Failed]);

        return $payment->fresh();
    }

    public function refundPayment(Payment $payment): Payment
    {
        if ($payment->status !== PaymentStatus::Paid) {
            throw ValidationException::withMessages([
                'payment' => 'Only paid payments can be refunded.',
            ]);
        }

        $payment->update(['status' => PaymentStatus::Refunded]);
        $payment->order->update(['status' => OrderStatus::Cancelled]);

        return $payment->fresh('order');
    }

    public function listCustomerPayments(Request $request)
    {
        return Payment::whereHas('order', fn($q) => $q->where('customer_id', $request->user()->id))
            ->with('order')
            ->latest()
            ->paginate(15);
    }
}
