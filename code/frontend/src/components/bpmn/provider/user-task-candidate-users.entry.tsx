// @ts-ignore
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
// @ts-ignore
import { useEffect, useState } from '@bpmn-io/properties-panel/preact/hooks';
// @ts-ignore
import { useService } from 'bpmn-js-properties-panel';
// @ts-ignore
import { getUsersByIds } from '../../../services/auth.service';
import { SelectUserDiglogEvent, SelectUserDiglogSubject } from './select-user.componet';

export const UserTaskCandidateUser = (props: any) => {
  const { element, id } = props;

  const commandStack = useService("commandStack");
  const translate = useService('translate');
  const businessObject = getBusinessObject(element);
  const [ localValue, setLocalValue ] = useState<string>();

  const getValue = () => {
    return getBusinessObject(element).get('camunda:candidateUsers');
  }

  const setValue = (value: any) => {
    commandStack.execute("element.updateModdleProperties", {
      element,
      moddleElement: businessObject,
      properties: {
        "camunda:candidateUsers": value
      }
    });
  };

  useEffect(() => {
    const sub = SelectUserDiglogSubject.subscribe((event: SelectUserDiglogEvent) => {
      if (event.type === 'set_value') {
        setLocalValue(event.setSelectedUsers?.map((u) => u.username).join(',') || '');
        setValue(event.setSelectedUsers?.map((u) => u.id).join(','));
      }
    });
    
    // get_value
    const value = getValue();
    if (value) {
      const ids = value.split(',');
      getUsersByIds(ids).then((users) => {
        setLocalValue(users.map((u) => u.username).join(','));
      });
    }

    return () => {
      sub && sub.unsubscribe();
    }
  }, []);

  const handleChoseUsers = () => {
    const value = getValue();
    SelectUserDiglogSubject.next({type: 'open', selectedValues: value ? value.split(',') : []});
  }

  return (
    <div className="bio-properties-panel-entry">
      <div className="bio-properties-panel-select">
        <label htmlFor={prefixId(id)} className="bio-properties-panel-label">
          {translate('Candidate Users')}
        </label>
        <div className="bio-properties-panel-input" style={{display: 'flex', flexDirection: 'row', padding: 0}}>
          <input
            style={{flex: 1}}
            id={prefixId(id)}
            key={element}
            type="text"
            name={id}
            spellCheck="false"
            autoComplete="off"
            disabled={true}
            // onInput={handleInput}
            // aria-label={localValue || '<empty>'}
            // onFocus={onFocus}
            // onBlur={onBlur}
            value={localValue}
            />
            <button onClick={handleChoseUsers} style={{border: 0}}>选择</button>
        </div>
      </div>
    </div>
  )
}

function prefixId(id: any) {
  return `bio-properties-panel-${id}`;
}

export const UserTaskCandidateUserEntry = (props: any) => {
  const { element } = props;
  return {
    ...props,
    element,
    isEdited: true,
    component: UserTaskCandidateUser,
  }
}