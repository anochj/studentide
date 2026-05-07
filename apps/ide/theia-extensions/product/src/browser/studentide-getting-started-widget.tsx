/********************************************************************************
 * Copyright (C) 2020 StudentIDE authors and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import * as React from 'react';

import { Message } from '@theia/core/lib/browser';
import { PreferenceService } from '@theia/core/lib/common';
import { inject, injectable } from '@theia/core/shared/inversify';

import { GettingStartedWidget } from '@theia/getting-started/lib/browser/getting-started-widget';

@injectable()
export class StudentIDEGettingStartedWidget extends GettingStartedWidget {

    @inject(PreferenceService)
    protected readonly preferenceService: PreferenceService;

    protected async doInit(): Promise<void> {
        super.doInit();
        await this.preferenceService.ready;
        this.update();
    }

    protected onActivateRequest(msg: Message): void {
        super.onActivateRequest(msg);
        const htmlElement = document.getElementById('alwaysShowWelcomePage');
        if (htmlElement) {
            htmlElement.focus();
        }
    }

    protected render(): React.ReactNode {
        return <div className='gs-container studentide-startup'>
            <div className='gs-content-container studentide-startup-content'>
                {this.renderHeader()}
                {this.renderQuickStart()}
            </div>
        </div>;
    }

    protected renderHeader(): React.ReactNode {
        return <div className='studentide-startup-header'>
            <h1>StudentIDE</h1>
            <p>Start a workspace for a coding project.</p>
        </div>;
    }

    protected renderQuickStart(): React.ReactNode {
        return <section className='studentide-quick-start'>
            <h2>Quick Start</h2>
            <ul>
                <li>
                    <a role='button' tabIndex={0} onClick={this.doCreateFile} onKeyDown={this.doCreateFileEnter}>
                        New File
                    </a>
                </li>
                <li>
                    <a role='button' tabIndex={0} onClick={this.doOpen} onKeyDown={this.doOpenEnter}>
                        Open
                    </a>
                </li>
                <li>
                    <a role='button' tabIndex={0} onClick={this.doOpenFile} onKeyDown={this.doOpenFileEnter}>
                        Open File
                    </a>
                </li>
                <li>
                    <a role='button' tabIndex={0} onClick={this.doOpenFolder} onKeyDown={this.doOpenFolderEnter}>
                        Open Folder
                    </a>
                </li>
                <li>
                    <a role='button' tabIndex={0} onClick={this.doOpenWorkspace} onKeyDown={this.doOpenWorkspaceEnter}>
                        Open Workspace
                    </a>
                </li>
                <li>
                    <a role='button' tabIndex={0} onClick={this.doOpenRecentWorkspace} onKeyDown={this.doOpenRecentWorkspaceEnter}>
                        Open Recent
                    </a>
                </li>
            </ul>
        </section>;
    }

}
