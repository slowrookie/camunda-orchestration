import { MessageBar, MessageBarBody, MessageBarTitle, makeStyles, tokens } from "@fluentui/react-components";
import { Editor, Monaco } from "@monaco-editor/react";
import { Form } from "@rjsf/fluentui-rc";
import { RJSFSchema, UiSchema } from "@rjsf/utils";
import validator from '@rjsf/validator-ajv8';
import { useEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const useStyles = makeStyles({
  root: {
    padding: 0,
    margin: 0,
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  editor: {
    width: '50%',
  },
  form: {
    width: '50%',
    padding: tokens.spacingHorizontalS,
  }
});

export type FormDesignerSchema = {
  Schema: RJSFSchema;
  UISchema: UiSchema;
}

const _defaultSchema: FormDesignerSchema = {
  Schema: {},
  UISchema: {
      "ui:submitButtonOptions": {
          submitText: "提交"
      }
  }
}

export const FormDesigner = () => {
  const styles = useStyles();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const editorRef = useRef<any>();
  const [schema, setSchema] = useState<FormDesignerSchema>({ ..._defaultSchema });
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (editorRef.current) {
      setTimeout(() => {
        const editor = editorRef.current;
        const action = editor.getAction('editor.action.formatDocument');
        action.run();
      }, 1000);
    }
  }, [editorLoaded]);

  const handleEditorMount = (editor: any, _: Monaco) => {
    editorRef.current = editor;
    editor.getModel().setValue(JSON.stringify(schema));
    setEditorLoaded(true);
  }

  const handleEditorChange = (value: string | undefined) => {
    if (!value) {
      return;
    }
    try {
      const newSchema = JSON.parse(value);
      setSchema(newSchema);
      setError(undefined);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  }

  const errorMessageBar = () => {
    return (
      <MessageBar key={error} intent="error">
        <MessageBarBody>
          <MessageBarTitle>JSON格式错误</MessageBarTitle>
          {error}
        </MessageBarBody>
      </MessageBar>
    )
  }

  return (<>
    <div className={styles.root}>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={30} minSize={30} maxSize={50}>
          <Editor
            className={styles.editor}
            height="100%"
            defaultLanguage="json"
            // defaultValue={JSON.stringify(schema)}
            onMount={handleEditorMount}
            onChange={handleEditorChange}
            options={{
              minimap: {
                enabled: false,
              },
              scrollbar: {
                verticalScrollbarSize: 5,
                horizontalScrollbarSize: 5,
              }
            }}
          />
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={70} minSize={50} maxSize={70}>
          {error && errorMessageBar()}
          <Form
            className={styles.form}
            schema={schema.Schema}
            validator={validator}
            uiSchema={schema.UISchema}
            />
        </Panel>
      </PanelGroup>
    </div>
  </>)
}