// @ts-ignore
import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
// @ts-ignore
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
// @ts-ignore
import { useService } from 'bpmn-js-properties-panel';
import { User, getUsers } from '../../../services/auth.service';
import { useEffect, useState } from '@bpmn-io/properties-panel/preact/hooks';

export const UserTaskAssignment = (props: any) => {
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

  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    getUsers({ number: 0, size: 10 }).then((data) => {
      setUsers(data.content);
    });
  }, []);

  // const getOptions = () => ([
  //   { value: 'latest', label: translate('latest') },
  //   { value: 'deployment', label: translate('deployment') },
  //   { value: 'version', label: translate('version') }
  // ]);

  const getOptions = () => {
    return users.map((user) => {
      return {
        value: user.id,
        label: user.username
      }
    });
  };

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

export const UserTaskAssignmentEntry = (props: any) => {
  const { element } = props;
  return {
    id: 'assignee',
    element,
    isEdited: isSelectEntryEdited,
    component: UserTaskAssignment,
  }
}