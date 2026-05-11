/********************************************************************************
 * Copyright (C) 2026 StudentIDE authors and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { injectable } from '@theia/core/shared/inversify';
import { AssignmentOverviewConfig, AssignmentOverviewConfigService } from '../common/assignment-overview-protocol';

@injectable()
export class AssignmentOverviewConfigServiceImpl implements AssignmentOverviewConfigService {

    async getConfig(): Promise<AssignmentOverviewConfig> {
        return {
            projectOverview: this.getProjectOverview(),
            dueAt: process.env.DUE_AT || ''
        };
    }

    protected getProjectOverview(): string {
        const base64Overview = process.env.PROJECT_OVERVIEW_BASE64;
        if (base64Overview) {
            const decodedOverview = this.decodeBase64Markdown(base64Overview);
            if (decodedOverview !== undefined) {
                return this.normalizeMarkdown(decodedOverview);
            }
        }
        return this.normalizeMarkdown(process.env.PROJECT_OVERVIEW);
    }

    protected decodeBase64Markdown(value: string): string | undefined {
        const normalizedValue = value.replace(/\s/g, '');
        const decodedValue = Buffer.from(normalizedValue, 'base64').toString('utf8');
        const reencodedValue = Buffer.from(decodedValue, 'utf8').toString('base64');
        if (reencodedValue.replace(/=+$/, '') !== normalizedValue.replace(/=+$/, '')) {
            return undefined;
        }
        return decodedValue;
    }

    protected normalizeMarkdown(value: string | undefined): string {
        return (value || '').replace(/\\n/g, '\n');
    }
}
