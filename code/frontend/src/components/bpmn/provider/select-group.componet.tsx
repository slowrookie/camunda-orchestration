import { Avatar, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Field, Tag, TagPicker, TagPickerControl, TagPickerGroup, TagPickerList, TagPickerOnOptionSelectData, TagPickerOption, makeStyles } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { Subject } from "rxjs";
import { Group, getGroups } from "../../../services/auth.service";


// event type enum
declare type SelectGroupDiglogEventType = 'None' | 'open' | 'close' | 'set_value' | 'get_value';

export type SelectGroupDiglogEvent = {
  type: SelectGroupDiglogEventType;
  key: string;
  multiple?: boolean;
  selectedGroups?: Group[];
  selectedValues?: string[];
}

export const SelectGroupDiglogSubject = new Subject<SelectGroupDiglogEvent>();

const useStyles = makeStyles({
  body: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  }
});

export const SelectGroupDiglog = () => {
  const styles = useStyles();

  const [groups, setGroups] = useState<Group[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SelectGroupDiglogEvent>({type: 'None', key: ""});

  useEffect(() => {
    const sub = SelectGroupDiglogSubject.subscribe((event: SelectGroupDiglogEvent) => {
      console.log(event);
      
      if (event.type === 'open') {
        setIsOpen(true);
        getGroups({ number: 0, size: 100 }).then((data) => {
          setGroups(data.content);
          if (event.selectedValues) {
            setSelectedOptions(event.selectedValues);
            setSelectedGroups(data.content.filter((u) => event.selectedValues && event.selectedValues.includes(u.id)));
          }
        });
        setSelectedEvent(event);
      } else if (event.type === 'close') {
        setIsOpen(false);
        setSelectedOptions([]);
        setSelectedGroups([]);
      }
    });

    return () => {
      sub && sub.unsubscribe();
    }
  }, [])

  const handleOptionSelect = (_: any, data: TagPickerOnOptionSelectData) => {
    let selects = selectedEvent?.multiple ? data.selectedOptions : [data.value];
    setSelectedOptions(selects);
    setSelectedGroups(groups.filter((u) => selects.includes(u.id)));
  }

  return (
    <Dialog modalType="non-modal" open={isOpen} onOpenChange={() => { SelectGroupDiglogSubject.next({ type: 'close', key: selectedEvent.key }) }}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>选择组</DialogTitle>
          <DialogContent className={styles.body}>
            <Field>
              <TagPicker
                onOptionSelect={handleOptionSelect}
                selectedOptions={selectedOptions}
              >
                <TagPickerControl>
                  <TagPickerGroup>
                    {selectedGroups.map((u) => (
                      <Tag key={u.id} shape="circular"
                        value={u.id}
                        media={<Avatar shape="square" aria-hidden name={u.name} color="colorful" />}
                      >
                        {u.name}
                      </Tag>
                    ))}
                  </TagPickerGroup>
                </TagPickerControl>
                <TagPickerList>
                  {groups.map((group) => (
                    <TagPickerOption
                      key={group.id}
                      value={group.id || ''}
                      media={<Avatar shape="square" aria-hidden name={group.name} color="colorful" />}
                    >
                      {group.name}
                    </TagPickerOption>
                  ))}
                </TagPickerList>
              </TagPicker>
            </Field>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="primary" 
                onClick={() => { SelectGroupDiglogSubject.next({key: selectedEvent.key, type: 'set_value', selectedGroups: selectedGroups }) }}>确认</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}