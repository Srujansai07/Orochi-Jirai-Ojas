// Jirai - Combined View Component
// Split view showing both canvas and timeline

'use client';

import { useUIStore } from '@/store';
import { Canvas } from '@/components/canvas';
import { Timeline } from '@/components/timeline';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';

export function CombinedView() {
    const { layoutDirection } = useUIStore();

    return (
        <ResizablePanelGroup
            direction={layoutDirection}
            className="h-full"
        >
            {/* Canvas Panel */}
            <ResizablePanel defaultSize={60} minSize={30}>
                <Canvas />
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-slate-800" />

            {/* Timeline Panel */}
            <ResizablePanel defaultSize={40} minSize={25}>
                <div className="h-full p-2 bg-slate-950">
                    <Timeline />
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}

export default CombinedView;
