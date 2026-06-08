<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Order;
use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function initiate(Order $order, Request $request, PaymentService $paymentService)
    {
        $payment = $paymentService->initiatePayment($order, $request);

        return $this->created(new PaymentResource($payment), 'Payment initiated');
    }

    public function confirm(Payment $payment, Request $request, PaymentService $paymentService)
    {
        $this->authorize('confirm', Payment::class);

        $transactionId = $request->input('transaction_id', uniqid('txn_'));
        $payment = $paymentService->confirmPayment($payment, $transactionId);

        return $this->success(new PaymentResource($payment), 'Payment confirmed');
    }

    public function refund(Payment $payment, Request $request, PaymentService $paymentService)
    {
        $this->authorize('refund', Payment::class);

        $payment = $paymentService->refundPayment($payment);

        return $this->success(new PaymentResource($payment), 'Payment refunded');
    }

    public function myPayments(Request $request, PaymentService $paymentService)
    {
        $payments = $paymentService->listCustomerPayments($request);

        return $this->success($payments);
    }
}
