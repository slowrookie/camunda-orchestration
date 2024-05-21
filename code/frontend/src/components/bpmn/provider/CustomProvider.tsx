// @ts-ignore
import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
// @ts-ignore
import {getBusinessObject} from 'bpmn-js/lib/util/ModelUtil';
// @ts-ignore
import {useService} from 'bpmn-js-properties-panel';

const Assignee = (props: any) => {
  const { element } = props;

  const commandStack = useService("commandStack");
  const translate = useService('translate');
  const debounce = useService("debounceInput");
  const businessObject = getBusinessObject(element);

  const getValue = () => {
    return getBusinessObject(element).get('camunda:assignee');
  };

  const setValue = (value: any) => {
    commandStack.execute("element.updateModdleProperties", {
      element,
      moddleElement: businessObject,
      properties: {
        "camunda:assignee": value
      }
    });
  };

  const getOptions = () => ([
    { value: 'latest', label: translate('latest') },
    { value: 'deployment', label: translate('deployment') },
    { value: 'version', label: translate('version') }
  ]);

  return SelectEntry({
    element,
    id: 'assignee',
    label: translate('Assignee'),
    getValue,
    setValue,
    debounce,
    getOptions
  });
}

class CustomPropertiesProvider {
  constructor(propertiesPanel: any, translate: any) {
    propertiesPanel.registerProvider(500, this);
  }

  getGroups = (element: any) => {
    return function (groups: []) {
      if (element.type === 'bpmn:UserTask') {
        // CamundaPlatform__UserAssignment
        groups.forEach((group: any) => {
          if (group.id === 'CamundaPlatform__UserAssignment') {
             const entries = group.entries.map((entry: any) => {
              if (entry.id == 'assignee') {
                entry = {
                  id: 'assignee',
                  element,
                  isEdited: isSelectEntryEdited,
                  component: Assignee,
                };
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

// function CustomPropertiesProvider(propertiesPanel: any, translate: any) {
//   console.log(propertiesPanel, translate);
//   propertiesPanel.
//   return;
// }

export default {
  __init__: ['customPropertiesProvider'],
  customPropertiesProvider: ['type', CustomPropertiesProvider]
}