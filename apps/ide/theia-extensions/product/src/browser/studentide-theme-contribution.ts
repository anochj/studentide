/********************************************************************************
 * Copyright (C) 2026 StudentIDE authors and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { inject, injectable } from '@theia/core/shared/inversify';
import { MonacoThemingService } from '@theia/monaco/lib/browser/monaco-theming-service';
import studentIdeDarkTheme from './themes/studentide-dark.json';

@injectable()
export class StudentIDEThemeContribution implements FrontendApplicationContribution {

    @inject(MonacoThemingService)
    protected readonly themingService: MonacoThemingService;

    onStart(): void {
        this.themingService.registerParsedTheme({
            id: 'studentide-dark',
            label: 'StudentIDE Dark',
            uiTheme: 'vs-dark',
            json: studentIdeDarkTheme
        });
    }
}
