// Node component exports
export { BaseNode } from './base-node';
export { TextNode } from './text-node';
export { LinkNode } from './link-node';
export { PersonNode } from './person-node';
export { TaskNode } from './task-node';
export { YouTubeNode } from './youtube-node';
export { FileNode } from './file-node';
export { GroupNode } from './group-node';

// Node types registry for React Flow
import { TextNode } from './text-node';
import { LinkNode } from './link-node';
import { PersonNode } from './person-node';
import { TaskNode } from './task-node';
import { YouTubeNode } from './youtube-node';
import { FileNode } from './file-node';
import { GroupNode } from './group-node';

export const nodeTypes = {
    text: TextNode,
    link: LinkNode,
    person: PersonNode,
    task: TaskNode,
    youtube: YouTubeNode,
    file: FileNode,
    group: GroupNode,
};
