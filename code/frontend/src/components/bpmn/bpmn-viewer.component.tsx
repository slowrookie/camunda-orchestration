import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { ImportXMLResult, SaveSVGResult, SaveXMLOptions, SaveXMLResult } from 'bpmn-js/lib/BaseViewer';
import BpmnModeler from 'camunda-bpmn-js/lib/camunda-platform/Modeler';
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { translateModule } from '../../i18n/bpmn/translate.provider';
// @ts-ignore
import axios from "axios";

export type IBpmnViewerProps = {
  className?: string;
  url?: string;
  diagramXml?: string;
}

export interface IBpmnViewerRef {
  importXML: (xml: string) => Promise<ImportXMLResult>;
  saveSVG: () => Promise<SaveSVGResult>;
  saveXML: (options?: SaveXMLOptions) => Promise<SaveXMLResult>;
}

const useStyles = makeStyles({
  root: {
    padding: 0,
    margin: 0,
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  modelerPanel: {
    flex: 1,
  },
});

export const BpmnViewer = forwardRef<IBpmnViewerRef, IBpmnViewerProps>((props, ref) => {
  const styles = useStyles();
  const containerRef = useRef<any>(null);
  const propertiesPanelRef = useRef<any>(null);
  const bpmnModeler = useRef<BpmnModeler>();

  useEffect(() => {
    if (!containerRef || !containerRef.current) {
      return;
    }

    if (bpmnModeler.current) {
      bpmnModeler.current.destroy();
    }

    bpmnModeler.current = new BpmnModeler({
      container: containerRef.current,
      propertiesPanel: {
        parent: propertiesPanelRef.current
      },
      additionalModules: [
        translateModule,
      ],
      keyboard: {
        bindTo: window
      }
    });

    // load
    if (props.url) {
      axios.create().get(props.url).then((res) => {
        bpmnModeler.current && bpmnModeler.current.importXML(res.data);
      });
    } else if (props.diagramXml) {
      bpmnModeler.current.importXML(props.diagramXml);
    }

    return () => {
      bpmnModeler.current && bpmnModeler.current.destroy();
    }
  }, [props]);

  // 暴露组件函数
  useImperativeHandle(ref, () => ({
    importXML: async (xml: string): Promise<ImportXMLResult> => {
      console.log(xml);

      if (!bpmnModeler.current) {
        return { warnings: [] };
      }
      
      return bpmnModeler.current.importXML(xml);
    },
    saveSVG: async (): Promise<SaveSVGResult> => {
      if (!bpmnModeler.current) {
        return { svg: '' };
      }
      return bpmnModeler.current.saveSVG();
    },
    saveXML: async (options?: SaveXMLOptions): Promise<SaveXMLResult> => {
      if (!bpmnModeler.current) {
        return { xml: '' };
      }
      return bpmnModeler.current.saveXML({ ...options, format: true });
    },
    
  }), [bpmnModeler.current]);

  return (
    <div className={mergeClasses(styles.root, props.className)}>
      <div ref={containerRef} className={styles.modelerPanel}></div>
    </div>
  )
});