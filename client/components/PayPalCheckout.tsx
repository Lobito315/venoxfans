'use client';

import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { getApiUrl } from '../app/utils/apiConfig';

interface PayPalCheckoutProps {
    amount: string | number;
    type: 'SUBSCRIPTION' | 'PURCHASE';
    targetId: string; // creatorId or postId
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

const PayPalCheckout: React.FC<PayPalCheckoutProps> = ({ amount, type, targetId, onSuccess, onError }) => {
    const [{ isPending }] = usePayPalScriptReducer();

    const createOrder = async () => {
        try {
            const response = await fetch(`${getApiUrl()}/api/payments/paypal/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type,
                    targetId,
                    amount,
                }),
            });

            const order = await response.json();
            return order.id;
        } catch (error) {
            console.error('Error creating PayPal order:', error);
            if (onError) onError(error);
            throw error;
        }
    };

    const onApprove = async (data: any) => {
        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;

            const response = await fetch(`${getApiUrl()}/api/payments/paypal/capture-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderID: data.orderID,
                    type,
                    subscriberId: user?.id,
                    creatorId: type === 'SUBSCRIPTION' ? targetId : undefined,
                    postId: type === 'PURCHASE' ? targetId : undefined,
                    amount,
                }),
            });

            const result = await response.json();
            if (result.success) {
                if (onSuccess) onSuccess(result);
            } else {
                throw new Error(result.error || 'Payment capture failed');
            }
        } catch (error) {
            console.error('Error capturing PayPal order:', error);
            if (onError) onError(error);
        }
    };

    if (isPending) {
        return <div className="animate-pulse bg-white/5 h-12 rounded-full w-full" />;
    }

    return (
        <div className="w-full">
            <PayPalButtons
                style={{
                    layout: 'horizontal',
                    color: 'silver',
                    shape: 'pill',
                    label: 'pay',
                    height: 48,
                }}
                createOrder={createOrder}
                onApprove={onApprove}
            />
        </div>
    );
};

export default PayPalCheckout;
