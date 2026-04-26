/********************************************************************************
 * Copyright (C) 2026 StudentIDE authors and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { AbstractViewContribution, FrontendApplication, FrontendApplicationContribution } from '@theia/core/lib/browser';
import { injectable } from '@theia/core/shared/inversify';
import { ASSIGNMENT_OVERVIEW_LABEL, ASSIGNMENT_OVERVIEW_WIDGET_ID, AssignmentOverviewWidget } from './overview-widget';

@injectable()
export class AssignmentOverviewContribution extends AbstractViewContribution<AssignmentOverviewWidget> implements FrontendApplicationContribution {

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
        await this.openView({ activate: false });
    }
}
