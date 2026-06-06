<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function initiate(Order $order, Request $request, PaymentService $paymentService)
    {
        $payment = $paymentService->initiatePayment($order, $request);

        return response()->json([
            'message' => 'Payment initiated',
            'payment' => $payment,
        ], 201);
    }

    public function confirm(Payment $payment, Request $request, PaymentService $paymentService)
    {
        if (!$request->user()->isAdmin()) {
            abort(403, 'Unauthorized');
        }

        $transactionId = $request->input('transaction_id', uniqid('txn_'));
        $payment = $paymentService->confirmPayment($payment, $transactionId);

        return response()->json([
            'message' => 'Payment confirmed',
            'payment' => $payment,
        ]);
    }

    public function refund(Payment $payment, Request $request, PaymentService $paymentService)
    {
        if (!$request->user()->isAdmin()) {
            abort(403, 'Unauthorized');
        }

        $payment = $paymentService->refundPayment($payment);

        return response()->json([
            'message' => 'Payment refunded',
            'payment' => $payment,
        ]);
    }

    public function myPayments(Request $request, PaymentService $paymentService)
    {
        return response()->json($paymentService->listCustomerPayments($request));
    }
}
