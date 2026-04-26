/********************************************************************************
 * Copyright (C) 2026 StudentIDE authors and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { ApplicationShell, FrontendApplicationContribution } from '@theia/core/lib/browser';
import { inject, injectable } from '@theia/core/shared/inversify';

@injectable()
export class StudentIDERightPanelContribution implements FrontendApplicationContribution {

    protected readonly hiddenRightPanelWidgets = [
        'chat-view-widget',
        'outline-view',
        'memory-layout-widget'
    ];

    @inject(ApplicationShell)
    protected readonly shell: ApplicationShell;

    async onDidInitializeLayout(): Promise<void> {
        await Promise.all(this.hiddenRightPanelWidgets.map(id => this.shell.closeWidget(id)));
        await this.shell.collapsePanel('right');
    }
}
