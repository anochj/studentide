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
import { getBrandingVariant } from './studentide-config';

export interface ExternalBrowserLinkProps {
    text: string;
    url: string;
    windowService: WindowService;
}

export function renderProductName(): React.ReactNode {
    const variant = getBrandingVariant();
    const suffix = variant !== 'stable' ? ` ${variant.charAt(0).toUpperCase() + variant.slice(1)}` : '';
    return <h1>Student<span className="gs-blue-header">IDE</span>{suffix}</h1>;
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
            What is this?
        </h3>
        <div>
            StudentIDE is a modern and open IDE for the browser. StudentIDE is based on the <BrowserLink text="Theia platform"
                url="https://studentide.org" windowService={windowService} ></BrowserLink>.
        </div>
        <div>
            StudentIDE runs as a browser application and can be hosted locally or in a container.
        </div>
    </div>;
}

export function renderExtendingCustomizing(windowService: WindowService): React.ReactNode {
    return <div className='gs-section'>
        <h3 className='gs-section-header'>
            Extending/Customizing StudentIDE
        </h3>
        <div >
            You can extend StudentIDE at runtime by installing VS Code extensions, e.g. from the <BrowserLink text="OpenVSX registry" url="https://open-vsx.org/"
                windowService={windowService} ></BrowserLink>, an open marketplace for VS Code extensions. Just open the extension view or browse <BrowserLink
                    text="OpenVSX online" url="https://open-vsx.org/" windowService={windowService} ></BrowserLink>.
        </div>
        <div>
            Furthermore, StudentIDE is based on the flexible Theia platform. Therefore, StudentIDE can serve as a <span className='gs-text-bold'>template</span> for building
            custom tools and IDEs. Browse <BrowserLink text="the documentation" url="https://studentide.org/docs/composing_applications/"
                windowService={windowService} ></BrowserLink> to help you customize and build your own StudentIDE-based product.
        </div>
    </div>;
}

export function renderSupport(windowService: WindowService): React.ReactNode {
    return <div className='gs-section'>
        <h3 className='gs-section-header'>
            Professional Support
        </h3>
        <div>
            Professional support, implementation services, consulting and training for building tools like StudentIDE and for building other tools based on Theia is
            available by selected companies as listed on the <BrowserLink text=" Theia support page" url="https://studentide.org/support/"
                windowService={windowService} ></BrowserLink>.
        </div>
    </div>;
}

export function renderTickets(windowService: WindowService): React.ReactNode {
    return <div className='gs-section'>
        <h3 className='gs-section-header'>
            Reporting feature requests and bugs
        </h3>
        <div >
            The features in StudentIDE are based on Theia and the included
            extensions/plugins. For bugs in Theia please consider opening an issue in
            the <BrowserLink text="Theia project on Github" url="https://github.com/eclipse-theia/theia/issues/new/choose"
                windowService={windowService} ></BrowserLink>.
        </div>
        <div>
            StudentIDE only packages existing functionality into a browser product
            for the product. If you believe there is a mistake in packaging, something needs to be added to the
            packaging or the browser app does not work properly,
            please <BrowserLink text="open an issue on Github" url="https://github.com/eclipse-theia/studentide/issues/new/choose"
                windowService={windowService} ></BrowserLink> to let us know.
        </div>
    </div>;
}

export function renderSourceCode(windowService: WindowService): React.ReactNode {
    return <div className='gs-section'>
        <h3 className='gs-section-header'>
            Source Code
        </h3>
        <div >
            The source code of StudentIDE is available
            on <BrowserLink text="Github" url="https://github.com/eclipse-theia/studentide"
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
            Please see the <BrowserLink text="documentation" url="https://studentide.org/docs/user_getting_started/"
                windowService={windowService} ></BrowserLink> on how to use StudentIDE.
        </div>
    </div>;
}

export function renderCollaboration(windowService: WindowService): React.ReactNode {
    return <div className='gs-section'>
        <h3 className='gs-section-header'>
            Collaboration
        </h3>
        <div >
            The IDE features a built-in collaboration feature.
            You can share your workspace with others and work together in real-time by clicking on the <i>Collaborate</i> item in the status bar.
            The collaboration feature is powered by
            the <BrowserLink text="Open Collaboration Tools" url="https://www.open-collab.tools/" windowService={windowService} /> project
            and uses their public server infrastructure.
        </div>
    </div>;
}
