import { Button, makeStyles } from '@fluentui/react-components';
import { BpmnDesigner, IBpmnDesigerRef } from '../components/bpmn/bpmn-designer.component';
import { useRef } from 'react';

var diagramUrl = 'https://cdn.statically.io/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';

const useStyles = makeStyles({
  root: {
    padding: 0,
    margin: 0,
    height: '100%',
  }
});

export const WorkflowPage = () => {
  const styles = useStyles();
  const designerRef = useRef<IBpmnDesigerRef>(null);

  return (
    <div className={styles.root}>
      <Button onClick={() => {
        designerRef.current?.saveXML().then((result: any) => {
          console.log(result);
        });
        designerRef.current?.saveSVG().then((result: any) => {
          console.log(result);
        });
      }} >XML</Button>
      <BpmnDesigner url={diagramUrl} ref={designerRef} />
    </div>
  )
}