/********************************************************************************
 * Copyright (C) 2026 StudentIDE authors and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { FrontendApplicationConfigProvider } from '@theia/core/lib/browser/frontend-application-config-provider';

export type BrandingVariant = 'stable';

export function getBrandingVariant(): BrandingVariant {
    try {
        const config = FrontendApplicationConfigProvider.get() as Record<string, unknown>;
        return (config['brandingVariant'] as BrandingVariant) ?? 'stable';
    } catch {
        return 'stable';
    }
}

export function applyBranding(): void {
    document.body.setAttribute('data-studentide-branding', getBrandingVariant());
}
