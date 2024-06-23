import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { ImportXMLResult, SaveSVGResult, SaveXMLOptions, SaveXMLResult } from 'bpmn-js/lib/BaseViewer';
import BaseViewer from 'camunda-bpmn-js/lib/camunda-platform/Viewer';
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { translateModule } from '../../i18n/bpmn/translate.provider';
// @ts-ignore
import axios from "axios";
import './bpmn.css'

export type IBpmnViewerProps = {
  className?: string;
  url?: string;
  diagramXml?: string;
  activityInstances?: any[];
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
  const bpmnViewer = useRef<BaseViewer>();

  useEffect(() => {
    if (!containerRef || !containerRef.current) {
      return;
    }

    if (bpmnViewer.current) {
      bpmnViewer.current.destroy();
    }

    bpmnViewer.current = new BaseViewer({
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
        bpmnViewer.current && bpmnViewer.current.importXML(res.data);
      });
    } else if (props.diagramXml) {
      bpmnViewer.current.importXML(props.diagramXml).then((result) => {
        if (!bpmnViewer.current) {
          return;
        }
        var canvas: any = bpmnViewer.current.get('canvas');
        canvas.zoom('fit-viewport');
        if (props.activityInstances) {
          console.log(props.activityInstances);
          props.activityInstances.forEach((ai: any) => {
            canvas.addMarker(ai.activityId, 'highlight');
          });
          
        }

      });
    }

    return () => {
      bpmnViewer.current && bpmnViewer.current.destroy();
    }
  }, [props]);

  // 暴露组件函数
  useImperativeHandle(ref, () => ({
    importXML: async (xml: string): Promise<ImportXMLResult> => {
      console.log(xml);

      if (!bpmnViewer.current) {
        return { warnings: [] };
      }
      
      return bpmnViewer.current.importXML(xml);
    },
    saveSVG: async (): Promise<SaveSVGResult> => {
      if (!bpmnViewer.current) {
        return { svg: '' };
      }
      return bpmnViewer.current.saveSVG();
    },
    saveXML: async (options?: SaveXMLOptions): Promise<SaveXMLResult> => {
      if (!bpmnViewer.current) {
        return { xml: '' };
      }
      return bpmnViewer.current.saveXML({ ...options, format: true });
    },
    
  }), [bpmnViewer.current]);

  return (
    <div className={mergeClasses(styles.root, props.className)}>
      <div ref={containerRef} className={styles.modelerPanel}></div>
    </div>
  )
});