/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { inject, injectable } from '@theia/core/shared/inversify';
import { CommonMenus } from '@theia/core/lib/browser/common-frontend-contribution';
import { Command, CommandContribution, CommandRegistry } from '@theia/core/lib/common/command';
import { MenuContribution, MenuModelRegistry, MenuPath } from '@theia/core/lib/common/menu';
import { WindowService } from '@theia/core/lib/browser/window/window-service';

export namespace StudentIDEMenus {
    export const STUDENT_IDE_HELP: MenuPath = [...CommonMenus.HELP, 'studentide'];
}
export namespace StudentIDECommands {
    export const CATEGORY = 'StudentIDE';
    export const REPORT_ISSUE: Command = {
        id: 'studentide:report-issue',
        category: CATEGORY,
        label: 'Report Issue'
    };
    export const DOCUMENTATION: Command = {
        id: 'studentide:documentation',
        category: CATEGORY,
        label: 'Documentation'
    };
}

@injectable()
export class StudentIDEContribution implements CommandContribution, MenuContribution {

    @inject(WindowService)
    protected readonly windowService: WindowService;

    static REPORT_ISSUE_URL = 'https://studentide.com/support';
    static DOCUMENTATION_URL = 'https://studentide.com/docs';

    registerCommands(commandRegistry: CommandRegistry): void {
        commandRegistry.registerCommand(StudentIDECommands.REPORT_ISSUE, {
            execute: () => this.windowService.openNewWindow(StudentIDEContribution.REPORT_ISSUE_URL, { external: true })
        });
        commandRegistry.registerCommand(StudentIDECommands.DOCUMENTATION, {
            execute: () => this.windowService.openNewWindow(StudentIDEContribution.DOCUMENTATION_URL, { external: true })
        });
    }

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(StudentIDEMenus.STUDENT_IDE_HELP, {
            commandId: StudentIDECommands.REPORT_ISSUE.id,
            label: StudentIDECommands.REPORT_ISSUE.label,
            order: '1'
        });
        menus.registerMenuAction(StudentIDEMenus.STUDENT_IDE_HELP, {
            commandId: StudentIDECommands.DOCUMENTATION.id,
            label: StudentIDECommands.DOCUMENTATION.label,
            order: '2'
        });
    }
}
