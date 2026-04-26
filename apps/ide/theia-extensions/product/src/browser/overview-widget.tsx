/********************************************************************************
 * Copyright (C) 2026 StudentIDE authors and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

// TODO: Add a countdown timer for when the assignment is due
// TODO: Add Markdown rendering for the instructions, and load the instructions from the API
// TODO: Add a submit buttons that opens a page to submit the assignment

import * as React from 'react';

import { ReactWidget, codicon } from '@theia/core/lib/browser';
import { injectable, postConstruct } from '@theia/core/shared/inversify';

export const ASSIGNMENT_OVERVIEW_WIDGET_ID = 'studentide.assignment-overview';
export const ASSIGNMENT_OVERVIEW_LABEL = 'Assignment Overview';

@injectable()
export class AssignmentOverviewWidget extends ReactWidget {

    @postConstruct()
    protected init(): void {
        this.id = ASSIGNMENT_OVERVIEW_WIDGET_ID;
        this.title.label = ASSIGNMENT_OVERVIEW_LABEL;
        this.title.caption = ASSIGNMENT_OVERVIEW_LABEL;
        this.title.iconClass = codicon('book');
        this.title.closable = true;
        this.node.tabIndex = 0;
        this.addClass('studentide-assignment-overview');
        this.update();
    }

    protected render(): React.ReactNode {
        return <div className='studentide-assignment-overview-content'>
            <h2>Assignment Overview</h2>
            <p>Loading instructions...</p>
        </div>;
    }
}
