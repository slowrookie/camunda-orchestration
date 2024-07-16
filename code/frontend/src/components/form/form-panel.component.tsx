import { useEffect, useState } from "react";
import { FormDefDetail, FormDefWithData, getFormDefDetailLatest, getFormDefDetails } from "../../services/form.service"
import { Form } from "@rjsf/fluentui-rc";
import validator from '@rjsf/validator-ajv8';
import { Dropdown, Field, Option } from "@fluentui/react-components";
import { useMe } from "../../context/MeContexnt";
import { WorkflowApproval } from "../../services/workflow-approval.service";

export type IFormPanelProps = {
  formData: FormDefWithData[],
  workflowApproval?: WorkflowApproval
  readonly?: boolean,
  canAddNewForm?: boolean,
  onChange?: (formData: FormDefWithData[], newFormData: FormDefWithData[]) => void,
  onErrors?: (errors: any[]) => void
}

export const FormPanel = (props: IFormPanelProps) => {
  const me = useMe();

  const [formData, setFormData] = useState<FormDefWithData[]>(props.formData);
  const [formDefDetails, setFormDefDetails] = useState<FormDefDetail[]>([]);
  const [latestFormDefDetails, setLatestFormDefDetails] = useState<FormDefDetail[]>([]);
  const [newFormData, setNewFormData] = useState<FormDefWithData[]>([]);

  useEffect(() => {
    setFormData(props.formData);
    props.onChange && props.onChange(props.formData, newFormData);
  }, [props]);

  useEffect(() => {
    getFormDefDetails().then((res) => {
      setFormDefDetails(res);
    })
    getFormDefDetailLatest().then((res) => {
      setLatestFormDefDetails(res);
    })
  }, [])

  return (
    <div>
      {formData.map((fdwd, index) => {
        if (!fdwd.def || !fdwd.def.schemas) {
          return <div></div>;
        };
        const schema = JSON.parse(fdwd.def.schemas);
        let fd: any = {};
        if (fdwd.data && fdwd.data.length > 0) {
          fdwd.data.forEach((d) => {
            fd[d.key] = d.value
          });
        }
        
        return (<>
          <Field label={"表单"} required validationMessage={fdwd.def.id ? undefined : '表单是必填项'}>
            <Dropdown placeholder="表单" disabled={props.readonly} value={fdwd.def.name} selectedOptions={[(fdwd.def.id)]}>
              {formDefDetails && formDefDetails.map((option: FormDefDetail) => (
                <Option key={option.id} value={option.id} text={option.name}>
                  {option.name}
                </Option>
              ))}
            </Dropdown>
          </Field>
          <Form
            key={`form-${index}`}
            // className={styles.form}
            schema={schema.Schema}
            validator={validator}
            uiSchema={schema.UISchema}
            // readonly={props.readonly}
            formData={fd}
            onChange={(data) => {
              // convert data object to array
              fdwd.data.forEach((d) => {
                Object.keys(data.formData).map((key) => {
                  if (d.key == key) {
                    d.value = data.formData[key];
                  }
                })
              });
              setFormData([...formData]);
              props.onChange && props.onChange(formData, newFormData);
            }}
            transformErrors={(errors) => {
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
        </>)
      })}
      {newFormData.map((fdwd, index) => {
        if (!fdwd.def || !fdwd.def.schemas) {
          return <div></div>;
        };
        const schema = JSON.parse(fdwd.def.schemas);
        let fd: any = {};
        if (fdwd.data && fdwd.data.length > 0) {
          fdwd.data.forEach((d) => {
            fd[d.key] = d.value
          });
        }
        return (<>
          <Field label={"选择表单"} required validationMessage={fdwd.def.id ? undefined : '表单是必填项'}>
            <Dropdown placeholder="表单" value={fdwd.def.name} selectedOptions={[(fdwd.def.id)]} onOptionSelect={(_, v) => {
              if (v.optionValue) {
                const selected = formDefDetails.find((d) => d.id == v.optionValue);
                if (selected) {
                  fdwd.def = selected;
                  fdwd.data = [];
                  setNewFormData([...newFormData]);
                }
              }
            }}>
              {formDefDetails && formDefDetails.map((option: FormDefDetail) => (
                <Option key={option.id} value={option.id} text={option.name}>
                  {option.name}
                </Option>
              ))}
            </Dropdown>
          </Field>
          <Form
            key={`form-${index}`}
            // className={styles.form}
            schema={schema.Schema}
            validator={validator}
            uiSchema={schema.UISchema}
            formData={fd}
            onChange={(data) => {
              // current user id
              if (me && 'currentUserId' in data.formData && !data.formData['currentUserId']) {
                data.formData['currentUserId'] = me.id;
              }

              // convert data object to array
              let fd = Object.keys(data.formData).map((key) => {
                return {
                  key: key,
                  value: data.formData[key],
                  businessId: props.workflowApproval ? props.workflowApproval.id : "",
                  formDefDetailId: fdwd.def.id,
                }
              });
              fdwd.data = fd;
              setNewFormData([...newFormData]);
              props.onChange && props.onChange(formData, newFormData);
            }}
            transformErrors={(errors) => {
              fdwd.erros = errors;
              props.onErrors && props.onErrors(errors);
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
        </>)
      })}
      {props.canAddNewForm && <Field>
        <Dropdown placeholder="新增表单" onOptionSelect={(_, v) => {
          if (v.optionValue) {
            const selected = formDefDetails.find((d) => d.id == v.optionValue);
            if (selected) {
              newFormData.push({ def: selected, data: [] });
              setNewFormData([...newFormData]);
            }
          }
        }}>
          {latestFormDefDetails && latestFormDefDetails.map((option: FormDefDetail) => (
            <Option key={option.id} value={option.id} text={option.name}>
              {option.name}
            </Option>
          ))}
        </Dropdown>
      </Field>}
    </div>
  )
}