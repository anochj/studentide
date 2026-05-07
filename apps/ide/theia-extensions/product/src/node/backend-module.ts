/********************************************************************************
 * Copyright (C) 2026 StudentIDE authors and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { BackendApplicationContribution } from '@theia/core/lib/node';
import { ConnectionHandler, RpcConnectionHandler } from '@theia/core/lib/common';
import { ContainerModule } from '@theia/core/shared/inversify';
import { AssignmentOverviewConfigService, AssignmentOverviewConfigServicePath } from '../common/assignment-overview-protocol';
import { AssignmentOverviewConfigServiceImpl } from './assignment-overview-config-service';
import { TypingLoggerContribution } from './typing-logger-contribution';
import { TypingLoggerService, TypingLoggerServicePath } from '../common/typing-logger-protocol';

export default new ContainerModule(bind => {
    bind(AssignmentOverviewConfigServiceImpl).toSelf().inSingletonScope();
    bind(AssignmentOverviewConfigService).toService(AssignmentOverviewConfigServiceImpl);
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new RpcConnectionHandler(
            AssignmentOverviewConfigServicePath,
            () => ctx.container.get<AssignmentOverviewConfigService>(AssignmentOverviewConfigService)
        )
    ).inSingletonScope();

    bind(TypingLoggerContribution).toSelf().inSingletonScope();
    bind(TypingLoggerService).toService(TypingLoggerContribution);
    bind(BackendApplicationContribution).toService(TypingLoggerContribution);
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new RpcConnectionHandler<TypingLoggerService>(
            TypingLoggerServicePath,
            () => ctx.container.get<TypingLoggerService>(TypingLoggerService)
        )
    ).inSingletonScope();
});
