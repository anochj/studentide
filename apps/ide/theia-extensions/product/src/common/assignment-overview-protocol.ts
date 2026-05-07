/********************************************************************************
 * Copyright (C) 2026 StudentIDE authors and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

export const AssignmentOverviewConfigServicePath = '/services/studentide/assignment-overview-config';
export const AssignmentOverviewConfigService = Symbol('AssignmentOverviewConfigService');

export interface AssignmentOverviewConfig {
    readonly projectOverview: string;
    readonly dueAt: string;
}

export interface AssignmentOverviewConfigService {
    getConfig(): Promise<AssignmentOverviewConfig>;
}
