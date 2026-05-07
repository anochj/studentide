/********************************************************************************
 * Copyright (C) 2026 StudentIDE authors and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { AbstractViewContribution, FrontendApplication, FrontendApplicationContribution } from '@theia/core/lib/browser';
import { inject, injectable } from '@theia/core/shared/inversify';
import { AssignmentOverviewConfigService } from '../common/assignment-overview-protocol';
import { ASSIGNMENT_OVERVIEW_LABEL, ASSIGNMENT_OVERVIEW_WIDGET_ID, AssignmentOverviewWidget } from './overview-widget';

@injectable()
export class AssignmentOverviewContribution extends AbstractViewContribution<AssignmentOverviewWidget> implements FrontendApplicationContribution {

    @inject(AssignmentOverviewConfigService)
    protected readonly configService: AssignmentOverviewConfigService;

    constructor() {
        super({
            widgetId: ASSIGNMENT_OVERVIEW_WIDGET_ID,
            widgetName: ASSIGNMENT_OVERVIEW_LABEL,
            defaultWidgetOptions: {
                area: 'right',
                rank: 900
            }
        });
    }

    async initializeLayout(_app: FrontendApplication): Promise<void> {
        const config = await this.configService.getConfig();
        if (config.projectOverview.trim().length > 0) {
            await this.openView({ activate: false });
        }
    }
}
