// @ts-ignore
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
// @ts-ignore
import { useEffect, useState } from '@bpmn-io/properties-panel/preact/hooks';
// @ts-ignore
import { useService } from 'bpmn-js-properties-panel';
// @ts-ignore
import { getGroupsByIds } from '../../../services/auth.service';
import { SelectGroupDiglogEvent, SelectGroupDiglogSubject } from './select-group.componet';

const UserTaskCandidateGroups = (props: any) => {
  const key = 'candidateGroups';
  const { element, id } = props;

  const commandStack = useService("commandStack");
  const translate = useService('translate');
  const businessObject = getBusinessObject(element);
  const [ localValue, setLocalValue ] = useState<string>();

  const getValue = () => {
    return getBusinessObject(element).get('camunda:candidateGroups');
  }

  const setValue = (value: any) => {
    commandStack.execute("element.updateModdleProperties", {
      element,
      moddleElement: businessObject,
      properties: {
        "camunda:candidateGroups": value
      }
    });
  };

  useEffect(() => {
    const sub = SelectGroupDiglogSubject.subscribe((event: SelectGroupDiglogEvent) => {
      if (key != event.key) {
        return;
      }
      if (event.type === 'set_value') {
        setLocalValue(event.selectedGroups?.map((u) => u.name).join(',') || '');
        setValue(event.selectedGroups?.map((u) => u.id).join(','));
      }
    });
    
    // get_value
    const value = getValue();
    if (value) {
      const ids = value.split(',');
      getGroupsByIds(ids).then((groups) => {
        setLocalValue(groups.map((u) => u.name).join(','));
      });
    }

    return () => {
      sub && sub.unsubscribe();
    }
  }, []);

  const handleChoseGroups = () => {
    const value = getValue();
    SelectGroupDiglogSubject.next({type: 'open', key, multiple: true, selectedValues: value ? value.split(',') : []});
  }

  return (
    <div className="bio-properties-panel-entry">
      <div className="bio-properties-panel-select">
        <label htmlFor={prefixId(id)} className="bio-properties-panel-label">
          {translate('Candidate Groups')}
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
            <button onClick={handleChoseGroups} style={{border: 0}}>选择</button>
        </div>
      </div>
    </div>
  )
}

function prefixId(id: any) {
  return `bio-properties-panel-${id}`;
}

export const UserTaskCandidateGroupsEntry = (props: any) => {
  const { element } = props;
  return {
    ...props,
    element,
    isEdited: true,
    component: UserTaskCandidateGroups,
  }
}