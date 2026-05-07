/********************************************************************************
 * Copyright (C) 2020 StudentIDE authors and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { WindowService } from '@theia/core/lib/browser/window/window-service';
import * as React from 'react';

export interface ExternalBrowserLinkProps {
    text: string;
    url: string;
    windowService: WindowService;
}

export function renderProductName(): React.ReactNode {
    return <h1 className='studentide-wordmark'>Student<span className='studentide-wordmark-accent'>IDE</span></h1>;
}

export function renderProductLogo(): React.ReactNode {
    return <div className='studentide-wordmark'>Student<span className='studentide-wordmark-accent'>IDE</span></div>;
}

function BrowserLink(props: ExternalBrowserLinkProps): JSX.Element {
    return <a
        role={'button'}
        tabIndex={0}
        href={props.url}
        target='_blank'
    >
        {props.text}
    </a>;
}

export function renderWhatIs(windowService: WindowService): React.ReactNode {
    return <div className='gs-section'>
        <h3 className='gs-section-header'>
            Project workspace
        </h3>
        <div>
            StudentIDE opens a prepared browser workspace for each coding project, so students start with the right files,
            tools, and instructions in place.
        </div>
        <div>
            Instructors define the project once, then launch, manage, and review student sessions with consistent context.
        </div>
    </div>;
}

export function renderExtendingCustomizing(windowService: WindowService): React.ReactNode {
    return <div className='gs-section'>
        <h3 className='gs-section-header'>
            Extension support
        </h3>
        <div >
            Add language tools and editor capabilities by installing VS Code-compatible extensions from the <BrowserLink text="OpenVSX registry" url="https://open-vsx.org/"
                windowService={windowService} ></BrowserLink>, an open marketplace for VS Code extensions. Just open the extension view or browse <BrowserLink
                    text="OpenVSX online" url="https://open-vsx.org/" windowService={windowService} ></BrowserLink>.
        </div>
        <div>
            Keep extensions focused on the project runtime so the workspace stays predictable for students and reviewable for instructors.
        </div>
    </div>;
}

export function renderSupport(windowService: WindowService): React.ReactNode {
    return <div className='gs-section'>
        <h3 className='gs-section-header'>
            Classroom support
        </h3>
        <div>
            Use project instructions, submission notes, and instructor feedback to keep each workspace tied to the assignment outcome.
        </div>
    </div>;
}

export function renderTickets(windowService: WindowService): React.ReactNode {
    return <div className='gs-section'>
        <h3 className='gs-section-header'>
            Reporting issues
        </h3>
        <div >
            If a workspace does not launch, save, or submit correctly, capture the project name, browser, and recent action before reporting it.
        </div>
        <div>
            Please <BrowserLink text="open an issue" url="https://studentide.com/support"
                windowService={windowService} ></BrowserLink> with enough detail to reproduce the problem.
        </div>
    </div>;
}

export function renderSourceCode(windowService: WindowService): React.ReactNode {
    return <div className='gs-section'>
        <h3 className='gs-section-header'>
            Source code
        </h3>
        <div >
            StudentIDE is organized around project definitions, prepared IDE sessions, and structured submissions.
            Browse the project source on <BrowserLink text="GitHub" url="https://studentide.com"
                windowService={windowService} ></BrowserLink>.
        </div>
    </div>;
}

export function renderDocumentation(windowService: WindowService): React.ReactNode {
    return <div className='gs-section'>
        <h3 className='gs-section-header'>
            Documentation
        </h3>
        <div >
            Read the <BrowserLink text="documentation" url="https://studentide.com/docs"
                windowService={windowService} ></BrowserLink> on how to launch a workspace, install extensions, and submit project work.
        </div>
    </div>;
}

export function renderCollaboration(windowService: WindowService): React.ReactNode {
    return <div className='gs-section'>
        <h3 className='gs-section-header'>
            Collaboration
        </h3>
        <div >
            Share a workspace when the project calls for live help or paired work. Confirm course policy before inviting collaborators.
        </div>
    </div>;
}
