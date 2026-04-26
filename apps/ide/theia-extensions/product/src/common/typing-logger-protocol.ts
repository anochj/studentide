/********************************************************************************
 * Copyright (C) 2026 StudentIDE authors and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { Range } from '@theia/core/shared/vscode-languageserver-protocol';

export const TypingLoggerServicePath = '/services/studentide/typing-logger';
export const TypingLoggerService = Symbol('TypingLoggerService');

export interface TypingContentChange {
    readonly range: Range;
    readonly rangeOffset: number;
    readonly rangeLength: number;
    readonly text: string;
}

export interface TypingLoggerPayload {
    readonly documentUri: string;
    readonly timestamp: string;
    readonly contentChanges: readonly TypingContentChange[];
}

export interface TypingLoggerService {
    logTypingEvent(payload: TypingLoggerPayload): void;
}
