/********************************************************************************
 * Copyright (C) 2020 StudentIDE authors and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import '../../src/browser/style/index.css';

import { FrontendApplicationContribution, WidgetFactory, bindViewContribution } from '@theia/core/lib/browser';
import { AboutDialog } from '@theia/core/lib/browser/about-dialog';
import { applyBranding } from './studentide-config';
import { CommandContribution } from '@theia/core/lib/common/command';
import { ContainerModule } from '@theia/core/shared/inversify';
import { GettingStartedWidget } from '@theia/getting-started/lib/browser/getting-started-widget';
import { MenuContribution } from '@theia/core/lib/common/menu';
import { StudentIDEAboutDialog } from './studentide-about-dialog';
import { StudentIDEContribution } from './studentide-contribution';
import { StudentIDEGettingStartedWidget } from './studentide-getting-started-widget';
import { StudentIDERightPanelContribution } from './studentide-right-panel-contribution';
import { StudentIDEThemeContribution } from './studentide-theme-contribution';
import { TypingLoggerFrontendContribution } from './typing-logger-frontend-contribution';
import { ASSIGNMENT_OVERVIEW_WIDGET_ID, AssignmentOverviewWidget } from './overview-widget';
import { AssignmentOverviewContribution } from './overview-contribution';

export default new ContainerModule((bind, _unbind, isBound, rebind) => {
    applyBranding();

    bind(StudentIDEGettingStartedWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(context => ({
        id: GettingStartedWidget.ID,
        createWidget: () => context.container.get<StudentIDEGettingStartedWidget>(StudentIDEGettingStartedWidget),
    })).inSingletonScope();
    if (isBound(AboutDialog)) {
        rebind(AboutDialog).to(StudentIDEAboutDialog).inSingletonScope();
    } else {
        bind(AboutDialog).to(StudentIDEAboutDialog).inSingletonScope();
    }

    bind(StudentIDEContribution).toSelf().inSingletonScope();
    [CommandContribution, MenuContribution].forEach(serviceIdentifier =>
        bind(serviceIdentifier).toService(StudentIDEContribution)
    );

    bind(StudentIDERightPanelContribution).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toService(StudentIDERightPanelContribution);

    bind(StudentIDEThemeContribution).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toService(StudentIDEThemeContribution);

    bind(TypingLoggerFrontendContribution).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toService(TypingLoggerFrontendContribution);

    bind(AssignmentOverviewWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(context => ({
        id: ASSIGNMENT_OVERVIEW_WIDGET_ID,
        createWidget: () => context.container.get<AssignmentOverviewWidget>(AssignmentOverviewWidget)
    })).inSingletonScope();
    bindViewContribution(bind, AssignmentOverviewContribution);
    bind(FrontendApplicationContribution).toService(AssignmentOverviewContribution);
});
