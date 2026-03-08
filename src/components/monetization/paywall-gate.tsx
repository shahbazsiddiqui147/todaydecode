"use client";

import React from 'react';

interface PaywallGateProps {
    children: React.ReactNode;
    isPremium?: boolean;
}

/**
 * Institutional Paywall Deactivated
 * This component now provides universal access to all research content
 * regardless of the 'isPremium' flag or user authentication status.
 */
export function PaywallGate({ children }: PaywallGateProps) {
    return <>{children}</>;
}
