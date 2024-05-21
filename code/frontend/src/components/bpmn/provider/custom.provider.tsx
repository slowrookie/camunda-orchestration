import { UserAssignmentEntry } from './user-assignement.entry';

class CustomPropertiesProvider {
  constructor(propertiesPanel: any, translate: any) {
    propertiesPanel.registerProvider(500, this);
  }

  getGroups = (element: any) => {
    return function (groups: []) {
      if (element.type === 'bpmn:UserTask') {
        groups.forEach((group: any) => {
          // CamundaPlatform__UserAssignment
          if (group.id === 'CamundaPlatform__UserAssignment') {
             const entries = group.entries.map((entry: any) => {
              if (entry.id == 'assignee') {
                entry = UserAssignmentEntry({ element });
              }
              return entry;
            });
            group.entries = entries;
          }
        });
      }
      return groups;
    }
  }

  getProperties = (element: any) => {
    console.log(element);
    return [];
  }
}

export default {
  __init__: ['customPropertiesProvider'],
  customPropertiesProvider: ['type', CustomPropertiesProvider]
}