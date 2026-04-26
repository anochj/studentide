/********************************************************************************
 * Copyright (C) 2026 StudentIDE authors and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { FrontendApplicationContribution, WebSocketConnectionProvider } from '@theia/core/lib/browser';
import { MonacoWorkspace } from '@theia/monaco/lib/browser/monaco-workspace';
import { inject, injectable } from '@theia/core/shared/inversify';
import { TypingLoggerService, TypingLoggerServicePath } from '../common/typing-logger-protocol';

@injectable()
export class TypingLoggerFrontendContribution implements FrontendApplicationContribution {

    @inject(MonacoWorkspace)
    protected readonly workspace: MonacoWorkspace;

    @inject(WebSocketConnectionProvider)
    protected readonly connectionProvider: WebSocketConnectionProvider;

    initialize(): void {
        const logger = this.connectionProvider.createProxy<TypingLoggerService>(TypingLoggerServicePath);
        this.workspace.onDidChangeTextDocument(event => {
            logger.logTypingEvent({
                documentUri: event.model.uri,
                timestamp: new Date().toISOString(),
                contentChanges: event.contentChanges.map(change => ({
                    range: change.range,
                    rangeOffset: change.rangeOffset,
                    rangeLength: change.rangeLength,
                    text: change.text
                }))
            });
        });
    }
}
