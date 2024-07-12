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
import { Form } from "@rjsf/fluentui-rc";
import validator from '@rjsf/validator-ajv8';
import { useCallback, useEffect, useState } from 'react';
import { useMe } from '../../context/MeContexnt';
import { FormDefDetail, getFormDataByBusinessId, getFormDefDetailLatest, getFormDefDetails } from '../../services/form.service';
import { WorkflowApproval, WorkflowApprovalProcess, processWorkflowApproval } from '../../services/workflow-approval.service';
import { processDefinitionStatisticsGrouped } from "../../services/workflow.service";

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
  const me = useMe();

  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [selectedWorkflowApproval, setSelectedWorkflowApproval] = useState<WorkflowApproval>({ id: '', title: '' });

  const [processDefinitions, setProcessDefinitions] = useState<any[]>([]);
  const [selectedProcessDefinition, setSelectedProcessDefinition] = useState<any>({ id: "", name: "" });
  const [inProcess, setInProcess] = useState(false);
  const [formErros, setFormErrors] = useState<any>({});
  const [isDataReady, setIsDataReady] = useState(false);

  const [formDefDetails, setFormDefDetails] = useState<FormDefDetail[]>([]);
  const [selectedFormDefDetail, setSelectedFormDefDetail] = useState<FormDefDetail>({ id: '', key: '', name: '', schemas: '', enable: true });
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    setIsOpen(props.isOpen);
    setIsDataReady(false);
    setSelectedWorkflowApproval(props.workflowApproval || { id: '', title: '' });
    setSelectedFormDefDetail({ id: '', key: '', name: '', schemas: '', enable: true });
    setSelectedProcessDefinition({ id: "", name: "" });
    if (!props.isOpen) return;
    getFormDefDetails()
      .then((data) => {
        setFormDefDetails(data);
        return processDefinitionStatisticsGrouped();
      })
      .then((rows) => {
        setProcessDefinitions(rows);
      })
      .finally(() => {
        setIsDataReady(true);
      })
  }, [props.isOpen]);

  useEffect(() => {
    if (isDataReady && props.workflowApproval) {
      let wa = props.workflowApproval;
      setSelectedWorkflowApproval(wa);

      let pd = processDefinitions.find((d) => d.id == wa.processDefinitionId);
      pd && setSelectedProcessDefinition(pd);

      getFormDataByBusinessId(wa.id).then((data) => {
        if (!data || !data.length) return;
        let form = data[0];
        let fd = formDefDetails.find((d) => d.id == form.def.id);
        fd && setSelectedFormDefDetail(fd);
        // form.data key-value array to formData
        let formData: any = {};
        form.data.forEach((d: any) => {
          formData[d.key] = d.value;
        });
        setFormData(formData);
      })
    }
  }, [isDataReady]);

  useEffect(() => {
    if (me && !props.readonly) {
      setFormData({ userId: me.id, username: me.username })
    }
  }, [me]);

  const createForm = useCallback(() => {
    if (!selectedFormDefDetail || !selectedFormDefDetail.schemas) return;
    const schema = JSON.parse(selectedFormDefDetail.schemas);
    return <Form
      // className={styles.form}
      schema={schema.Schema}
      validator={validator}
      uiSchema={schema.UISchema}
      formData={formData}
      onChange={(data) => {
        setFormData(data.formData)
      }}
      transformErrors={(errors) => {
        setFormErrors(errors);
        return errors.map((error) => {
          if (error.name === 'required') {
            if (error.property) {
              const schemaProperty = schema.Schema.properties[error.property];
              if (schemaProperty) {
                error.message = `${schemaProperty.title}是必填项`;
              }
            }
          }
          return error;
        });
      }}
      liveValidate
      showErrorList={false}
    />
  }, [selectedFormDefDetail, formData]);

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
          <Input id="title" readOnly={props.readonly} required value={selectedWorkflowApproval.title} onChange={(_, v) => {
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

        <Field label={"表单"} required validationMessage={selectedFormDefDetail.id ? undefined : '表单是必填项'}>
          <Dropdown placeholder="表单" disabled={props.readonly} value={selectedFormDefDetail.name} selectedOptions={[(selectedFormDefDetail.id)]} onOptionSelect={(_, v) => {
            if (v.optionValue) {
              const selected = formDefDetails.find((d) => d.id == v.optionValue);
              selected && setSelectedFormDefDetail(selected);
              setSelectedWorkflowApproval({ ...selectedWorkflowApproval, formDefDetailId: v.optionValue });
            }
          }}>
            {formDefDetails && formDefDetails.map((option: FormDefDetail) => (
              <Option key={option.id} value={option.id} text={option.name}>
                {option.name}
              </Option>
            ))}
          </Dropdown>
        </Field>

        {createForm()}


      </DrawerBody>
      <DrawerFooter className={styles.drawerFooter}>
        <ToolbarButton appearance='primary'
          icon={<>{inProcess ? <Spinner size='tiny' /> : <Play20Regular />}</>}
          disabled={inProcess}
          onClick={handleSubmit}
        >提交</ToolbarButton>
      </DrawerFooter>
    </OverlayDrawer>
  </>)
};