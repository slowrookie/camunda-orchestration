import {
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Dropdown,
  Field,
  Input,
  Option,
  OverlayDrawer,
  Spinner,
  ToolbarButton,
  makeStyles,
  tokens
} from "@fluentui/react-components";
import { Dismiss20Regular, Play20Regular } from '@fluentui/react-icons';
import { useEffect, useState } from 'react';
import { getFormDataByBusinessId } from '../../services/form.service';
import { WorkflowApproval, WorkflowApprovalProcess, processWorkflowApproval } from '../../services/workflow-approval.service';
import { processDefinitionStatisticsGrouped } from "../../services/workflow.service";
import { FormPanel, IFormPanelProps } from "../form/form-panel.component";

const useStyles = makeStyles({
  drawer: {
    // transitionDuration: '0s',
  },
  drawerBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    boxSizing: 'border-box'
  },
  drawerFooter: {
    justifyContent: 'flex-end',
  },
});

export type IWorkflowApprovalFormProcessProps = {
  isOpen: boolean,
  readonly?: boolean,
  onSubmitted?: () => void,
  onOpenChange?: (isOpen: boolean) => void,
  workflowApproval?: WorkflowApproval
}

export const WorkflowApprovalFormProcess = (props: IWorkflowApprovalFormProcessProps) => {
  const styles = useStyles();

  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [selectedWorkflowApproval, setSelectedWorkflowApproval] = useState<WorkflowApproval>({ id: '', title: '' });

  const [processDefinitions, setProcessDefinitions] = useState<any[]>([]);
  const [selectedProcessDefinition, setSelectedProcessDefinition] = useState<any>({ id: "", name: "" });
  const [inProcess, setInProcess] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);

  const [formData, setFormData] = useState<any[]>([]);
  const [newFormData, setNewFormData] = useState<any[]>([]);
  const [formErrors, setFormErrors] = useState<any[]>([]);
  const [formPanelProps, setFormPanelProps] = useState<IFormPanelProps>({
    formData: [], 
    workflowApproval: props.workflowApproval,
    readonly: props.readonly,
    canAddNewForm: true,
    onChange: (formData, newFormData) => {
     setFormData(formData);
     setNewFormData(newFormData);
    },
    onErrors: (errors) => {
      setFormErrors(errors);
    }
  });

  useEffect(() => {
    setIsOpen(props.isOpen);
    setIsDataReady(false);
    setSelectedWorkflowApproval(props.workflowApproval || { id: '', title: '' });
    setSelectedProcessDefinition({ id: "", name: "" });
    if (!props.isOpen) return;
    processDefinitionStatisticsGrouped()
      .then((rows) => {
        setProcessDefinitions(rows);
      })
      .finally(() => {
        setIsDataReady(true);
      });
    setFormPanelProps({...formPanelProps, readonly: props.readonly, workflowApproval: props.workflowApproval});
  }, [props]);

  useEffect(() => {
    if (isDataReady && props.workflowApproval) {
      let wa = props.workflowApproval;
      setSelectedWorkflowApproval(wa);

      let pd = processDefinitions.find((d) => d.id == wa.processDefinitionId);
      pd && setSelectedProcessDefinition(pd);

      getFormDataByBusinessId(wa.id).then((data) => {
        if (!data || !data.length) return;
        setFormPanelProps({...formPanelProps, formData: data});
      })
    }
  }, [isDataReady]);

  const handleSubmit = () => {
    if (!selectedWorkflowApproval.processInstanceId 
        || !selectedWorkflowApproval.currentTask
        || !selectedWorkflowApproval.currentTask.id) {
      return;
    }
    setInProcess(true);
    let processData: WorkflowApprovalProcess = {
      id: selectedWorkflowApproval.id,
      processDefinitionId: selectedProcessDefinition.id,
      processInstanceId: selectedWorkflowApproval.processInstanceId,
      taskId: selectedWorkflowApproval.currentTask.id,
      formData: formData,
      newFormData: newFormData
    }

    processWorkflowApproval(processData)
      .then(() => {
        setIsOpen(false);
        props.onSubmitted && props.onSubmitted();
      })
      .finally(() => {
        setInProcess(false);
      });
  }

  const handleToggleChange = (open: boolean) => {
    setIsOpen(open);
    props.onOpenChange && props.onOpenChange(open);
  }

  return (<>
    <OverlayDrawer
      className={styles.drawer}
      modalType="non-modal"
      size='medium'
      open={isOpen}
      position='end'
      onOpenChange={(_, { open }) => {
        handleToggleChange(open)
      }}
    >
      <DrawerHeader>
        <DrawerHeaderTitle action={
          <Button appearance="subtle" aria-label="Close" size='small' icon={<Dismiss20Regular />} onClick={() => handleToggleChange(!isOpen)} />
        }>
          {props.readonly ? '流程信息' : '处理流程'}
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody className={styles.drawerBody}>
        <Field label="标题" required validationMessage={selectedWorkflowApproval.title.length > 1 ? undefined : '标题是必填项'}>
          <Input id="title" readOnly={props.readonly} disabled={props.readonly} required value={selectedWorkflowApproval.title} onChange={(_, v) => {
            setSelectedWorkflowApproval({ ...selectedWorkflowApproval, title: v.value });
          }} />
        </Field>

        <Field label={"流程"} required validationMessage={selectedProcessDefinition.id ? undefined : '流程是必填项'}>
          <Dropdown placeholder="流程" disabled={props.readonly} value={selectedProcessDefinition.name} selectedOptions={[(selectedProcessDefinition.id)]} onOptionSelect={(_, v) => {
            if (v.optionValue) {
              const selected = processDefinitions.find((d) => d.id == v.optionValue);
              selected && setSelectedProcessDefinition(selected);
              setSelectedWorkflowApproval({ ...selectedWorkflowApproval, processDefinitionId: v.optionValue });
            }
          }}>
            {processDefinitions && processDefinitions.map((option: any) => (
              <Option key={option.id} value={option.id} text={option.name}>
                {option.name} - {option.key}
              </Option>
            ))}
          </Dropdown>
        </Field>

        <FormPanel  {...formPanelProps} />


      </DrawerBody>
      <DrawerFooter className={styles.drawerFooter}>
        <ToolbarButton appearance='primary'
          icon={<>{inProcess ? <Spinner size='tiny' /> : <Play20Regular />}</>}
          disabled={inProcess || formErrors.length > 0}
          onClick={handleSubmit}
        >提交</ToolbarButton>
      </DrawerFooter>
    </OverlayDrawer>
  </>)
};