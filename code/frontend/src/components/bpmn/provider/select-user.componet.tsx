import { Avatar, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Field, Tag, TagPicker, TagPickerControl, TagPickerGroup, TagPickerList, TagPickerOnOptionSelectData, TagPickerOption, makeStyles } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { Subject } from "rxjs";
import { User, getUsers } from "../../../services/auth.service";


// event type enum
declare type SelectUserDiglogEventType = 'None' | 'open' | 'close' | 'set_value' | 'get_value';

export type SelectUserDiglogEvent = {
  type: SelectUserDiglogEventType;
  key: string;
  multiple?: boolean;
  selectedUsers?: User[];
  selectedValues?: string[];
}

export const SelectUserDiglogSubject = new Subject<SelectUserDiglogEvent>();

const useStyles = makeStyles({
  body: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  }
});

export const SelectUserDiglog = () => {
  const styles = useStyles();

  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SelectUserDiglogEvent>({type: 'None', key: ""});

  useEffect(() => {
    const sub = SelectUserDiglogSubject.subscribe((event: SelectUserDiglogEvent) => {
      if (event.type === 'open') {
        setIsOpen(true);
        getUsers({ number: 0, size: 100 }).then((data) => {
          setUsers(data.content);
          if (event.selectedValues) {
            setSelectedOptions(event.selectedValues);
            setSelectedUsers(data.content.filter((u) => event.selectedValues && event.selectedValues.includes(u.id)));
          }
        });
        setSelectedEvent(event);
      } else if (event.type === 'close') {
        setIsOpen(false);
        setSelectedOptions([]);
        setSelectedUsers([]);
      }
    });

    return () => {
      sub && sub.unsubscribe();
    }
  }, [])

  const handleOptionSelect = (_: any, data: TagPickerOnOptionSelectData) => {
    let selects = selectedEvent?.multiple ? data.selectedOptions : [data.value];
    setSelectedOptions(selects);
    setSelectedUsers(users.filter((u) => selects.includes(u.id)));
  }

  return (
    <Dialog modalType="non-modal" open={isOpen} onOpenChange={() => { SelectUserDiglogSubject.next({ type: 'close', key: selectedEvent.key }) }}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>选择用户</DialogTitle>
          <DialogContent className={styles.body}>
            <Field>
              <TagPicker
                onOptionSelect={handleOptionSelect}
                selectedOptions={selectedOptions}
              >
                <TagPickerControl>
                  <TagPickerGroup>
                    {selectedUsers.map((u) => (
                      <Tag key={u.id} shape="circular"
                        value={u.id}
                        media={<Avatar shape="square" aria-hidden name={u.username} color="colorful" />}
                      >
                        {u.username}
                      </Tag>
                    ))}
                  </TagPickerGroup>
                </TagPickerControl>
                <TagPickerList>
                  {users.map((user) => (
                    <TagPickerOption
                      key={user.id}
                      value={user.id || ''}
                      media={<Avatar shape="square" aria-hidden name={user.username} color="colorful" />}
                    >
                      {user.username}
                    </TagPickerOption>
                  ))}
                </TagPickerList>
              </TagPicker>
            </Field>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="primary" 
                onClick={() => { SelectUserDiglogSubject.next({key: selectedEvent.key, type: 'set_value', selectedUsers: selectedUsers }) }}>确认</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}