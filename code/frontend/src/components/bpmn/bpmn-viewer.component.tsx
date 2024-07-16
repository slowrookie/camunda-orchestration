import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { ImportXMLResult, SaveSVGResult, SaveXMLOptions, SaveXMLResult } from 'bpmn-js/lib/BaseViewer';
import BaseViewer from 'camunda-bpmn-js/lib/camunda-platform/Viewer';
// @ts-ignore
import Minimap from 'diagram-js-minimap';
import MoveCanvas from 'diagram-js/lib/navigation/movecanvas'; // 导入 MoveCanvas 模块
import ZoomScroll from 'diagram-js/lib/navigation/zoomscroll'; // 导入 ZoomScroll 模块

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { translateModule } from '../../i18n/bpmn/translate.provider';
// @ts-ignore
import axios from "axios";
import './bpmn.css'
import dayjs from "dayjs";

export type IBpmnViewerProps = {
  className?: string;
  url?: string;
  diagramXml?: string;
  currentTasks?: any[];
  userTasks?: any[];
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
        Minimap,
        MoveCanvas,
        ZoomScroll
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
      bpmnViewer.current.importXML(props.diagramXml).then(() => {
        if (!bpmnViewer.current) {
          return;
        }
        var canvas: any = bpmnViewer.current.get('canvas');
        var overlays: any = bpmnViewer.current.get('overlays');
        // canvas.zoom('fit-viewport');
        if (props.userTasks) {
          
          props.userTasks.forEach((ai: any) => {
            if(ai.endTime) {
              canvas.addMarker(ai.taskDefinitionKey, 'highlight-completed');
              const keyValuePairs: string[] = [];
              if (ai.assignee) {
                keyValuePairs.push(`<div><strong>处理人:</strong> ${ai.assignee}</div> `);
              }
              if (ai.startTime) {
                keyValuePairs.push(`<div><strong>开始:</strong> ${dayjs(ai.startTime).format('YYYY-MM-DD HH:mm:ss')}</div>`);
              }
              if (ai.endTime) {
                keyValuePairs.push(`<div><strong>结束:</strong> ${dayjs(ai.endTime).format('YYYY-MM-DD HH:mm:ss')}</div>`);
              }

              const info: string = keyValuePairs.join(' ');
              overlays.add(ai.taskDefinitionKey, 'note', {
                position: {
                  bottom: -5,
                  right: 110,
                },
                html: `<div class="diagram-note">${info}</div>`
              });
            }
          });
        }
        if (props.currentTasks && props.currentTasks.length) {
          props.currentTasks.forEach((ai: any) => {
            canvas.addMarker(ai.taskDefinitionKey, 'highlight-current');
              const keyValuePairs: string[] = [];
              if (ai.assignee) {
                keyValuePairs.push(`<div><strong>待处理人:</strong> ${ai.assignee}</div> `);
              }
              if (ai.candidateUsers && ai.candidateUsers.length > 0) {
                keyValuePairs.push(`<div><strong>候选人:</strong> ${ai.candidateUsers.join(',')}</div>`);
              }
              if (ai.candidateGroups && ai.candidateGroups.length > 0) {
                keyValuePairs.push(`<div><strong>候选组:</strong> ${ai.candidateGroups.join(',')}</div>`);
              }
              if (ai.createTime) {
                keyValuePairs.push(`<div><strong>时间:</strong> ${dayjs(ai.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>`);
              }
              const info: string = keyValuePairs.join(' ');
              overlays.add(ai.taskDefinitionKey, 'note', {
                position: {
                  bottom: -5,
                  right: 110,
                },
                html: `<div class="diagram-note">${info}</div>`
              });
          });
        }
        if (props.activityInstances && props.activityInstances.length) {
          // exclude currentTasks
          let activityInstances = props.activityInstances.filter((ai: any) => {
            return !props.userTasks || !props.userTasks.find((ct: any) => ct.taskDefinitionKey === ai.activityId);
          });
          activityInstances.forEach((ai: any) => {
            canvas.addMarker(ai.activityId, 'highlight-completed');
              const keyValuePairs: string[] = [];
              if (ai.startTime) {
                keyValuePairs.push(`<div><strong>开始:</strong> ${dayjs(ai.startTime).format('YYYY-MM-DD HH:mm:ss')}</div>`);
              }
              if (ai.endTime) {
                keyValuePairs.push(`<div><strong>结束:</strong> ${dayjs(ai.endTime).format('YYYY-MM-DD HH:mm:ss')}</div>`);
              }

              const info: string = keyValuePairs.join(' ');
              overlays.add(ai.activityId, 'note', {
                position: {
                  bottom: -5,
                  right: 110,
                },
                html: `<div class="diagram-note">${info}</div>`
              });
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