/********************************************************************************
 * Copyright (C) 2026 StudentIDE authors and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

// TODO: Add a submit buttons that opens a page to submit the assignment

import * as React from 'react';

import { ReactWidget, codicon } from '@theia/core/lib/browser';
import { MarkdownRenderer, MarkdownRenderResult } from '@theia/core/lib/browser/markdown-rendering/markdown-renderer';
import { MarkdownStringImpl } from '@theia/core/lib/common/markdown-rendering/markdown-string';
import { Disposable } from '@theia/core/lib/common';
import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { AssignmentOverviewConfigService } from '../common/assignment-overview-protocol';

export const ASSIGNMENT_OVERVIEW_WIDGET_ID = 'studentide.assignment-overview';
export const ASSIGNMENT_OVERVIEW_LABEL = 'Assignment Overview';

@injectable()
export class AssignmentOverviewWidget extends ReactWidget {
    @inject(MarkdownRenderer)
    protected readonly markdownRenderer: MarkdownRenderer;

    @inject(AssignmentOverviewConfigService)
    protected readonly configService: AssignmentOverviewConfigService;

    protected markdownRenderResult: MarkdownRenderResult | undefined;
    protected projectOverview = '';
    protected dueAt = '';

    @postConstruct()
    protected init(): void {
        this.id = ASSIGNMENT_OVERVIEW_WIDGET_ID;
        this.title.label = ASSIGNMENT_OVERVIEW_LABEL;
        this.title.caption = ASSIGNMENT_OVERVIEW_LABEL;
        this.title.iconClass = codicon('book');
        this.title.closable = true;
        this.node.tabIndex = 0;
        this.addClass('studentide-assignment-overview');
        this.loadConfig();
    }

    protected async loadConfig(): Promise<void> {
        const config = await this.configService.getConfig();
        this.projectOverview = config.projectOverview;
        this.dueAt = config.dueAt;
        if (this.getDueAt()) {
            const countdownInterval = window.setInterval(() => this.update(), 1000);
            this.toDispose.push(Disposable.create(() => window.clearInterval(countdownInterval)));
        }
        this.update();
    }

    protected render(): React.ReactNode {
        if (!this.shouldShowAssignmentOverview()) {
            return undefined;
        }

        return <div className='studentide-assignment-overview-content'>
            {this.renderCountdown()}
            <h2>Assignment Overview</h2>
            <div className='studentide-assignment-overview-markdown' ref={this.renderMarkdown} />
        </div>;
    }

    protected renderCountdown(): React.ReactNode {
        const dueAt = this.getDueAt();
        if (!dueAt) {
            return undefined;
        }

        const remainingMilliseconds = dueAt.getTime() - Date.now();
        const isPastDue = remainingMilliseconds <= 0;
        const className = `studentide-assignment-countdown${isPastDue ? ' studentide-assignment-countdown-past' : ''}`;

        return <section className={className}>
            <span className='studentide-assignment-countdown-label'>Due</span>
            <strong>{isPastDue ? 'Past due' : this.formatRemainingTime(remainingMilliseconds)}</strong>
            <time dateTime={dueAt.toISOString()}>{this.formatDueAt(dueAt)}</time>
        </section>;
    }

    protected renderMarkdown = (container: HTMLDivElement | null): void => {
        this.markdownRenderResult?.dispose();
        this.markdownRenderResult = undefined;
        if (!container || !this.shouldShowAssignmentOverview()) {
            return;
        }

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        const markdown = new MarkdownStringImpl(this.projectOverview, { supportHtml: false });
        this.markdownRenderResult = this.markdownRenderer.render(markdown);
        container.appendChild(this.markdownRenderResult.element);
    };

    protected getDueAt(): Date | undefined {
        if (!this.dueAt) {
            return undefined;
        }
        const timestamp = Number(this.dueAt);
        if (!Number.isFinite(timestamp) || timestamp <= 0) {
            return undefined;
        }
        const milliseconds = timestamp > 9999999999 ? timestamp : timestamp * 1000;
        return new Date(milliseconds);
    }

    protected formatRemainingTime(milliseconds: number): string {
        const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`;
        }
        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        }
        return `${minutes}m ${seconds}s`;
    }

    protected formatDueAt(dueAt: Date): string {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(dueAt);
    }

    protected shouldShowAssignmentOverview(): boolean {
        return this.projectOverview.trim().length > 0;
    }

    dispose(): void {
        this.markdownRenderResult?.dispose();
        super.dispose();
    }
}
