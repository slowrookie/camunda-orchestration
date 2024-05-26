import { UserTaskAssignmentEntry } from './user-task-assignement.entry';
import { UserTaskCandidateGroupsEntry } from './user-task-candidate-groups.entry';
import { UserTaskCandidateUserEntry } from './user-task-candidate-users.entry';

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
              console.log(entry);
              
              if (entry.id == 'assignee') {
                entry = UserTaskAssignmentEntry({ element, id: entry.id});
              } else if (entry.id == 'candidateUsers') {
                entry = UserTaskCandidateUserEntry({ element, id: entry.id });
              } else if (entry.id == 'candidateGroups') {
                entry = UserTaskCandidateGroupsEntry({ element, id: entry.id });
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