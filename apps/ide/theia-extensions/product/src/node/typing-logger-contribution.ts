/********************************************************************************
 * Copyright (C) 2026 StudentIDE authors and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { BackendApplicationContribution } from '@theia/core/lib/node';
import { injectable } from '@theia/core/shared/inversify';
import { TypingLoggerPayload, TypingLoggerService } from '../common/typing-logger-protocol';

@injectable()
export class TypingLoggerContribution implements BackendApplicationContribution, TypingLoggerService {

    initialize(): void {
        console.log('[typing-logger] Backend typing logger initialized.');
    }

    // TODO: Add this ot a buffer, and have the buffer flush every X seconds or when it reaches a certain size
    // TODO: Connect to the API
    logTypingEvent(payload: TypingLoggerPayload): void {
        if (!payload.documentUri.startsWith("file://")) return;
        
        console.log(JSON.stringify({
            event: 'studentide.typing',
            ...payload
        }, undefined, 2));
    }
}
