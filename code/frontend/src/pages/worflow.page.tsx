import { makeStyles } from '@fluentui/react-components';
import { BpmnDesigner } from '../components/bpmn/bpmn-designer.component';

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

  return (
    <div className={styles.root}>
      <BpmnDesigner url={diagramUrl} />
    </div>
  )
}