import behaviorModule from './behaviors';
import commandModule from 'diagram-js/lib/command';

import ViewerCommands from './ViewerCommands';

export default {
  __depends__: [
    behaviorModule,
    commandModule
  ],
  __init__: [ 'viewerCommands' ],
  viewerCommands: [ 'type', ViewerCommands ]
};

export * from './behaviors';
export { ViewerCommands };