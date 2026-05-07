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
            projectOverview: this.normalizeMarkdown(process.env.PROJECT_OVERVIEW),
            dueAt: process.env.DUE_AT || ''
        };
    }

    protected normalizeMarkdown(value: string | undefined): string {
        return (value || '').replace(/\\n/g, '\n');
    }
}
