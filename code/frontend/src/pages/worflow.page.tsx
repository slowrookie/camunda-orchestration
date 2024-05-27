import { DrawerBody, DrawerHeader, DrawerHeaderNavigation, DrawerHeaderTitle, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, OverlayDrawer, Toolbar, ToolbarButton, ToolbarDivider, makeStyles, tokens } from '@fluentui/react-components';
import { Add20Regular, Dismiss20Regular, Dismiss24Regular } from '@fluentui/react-icons';
import { useRef } from 'preact/hooks';
import { useState } from 'react';
import { BpmnDesigner, IBpmnDesigerRef } from '../components/bpmn/bpmn-designer.component';

var diagramUrl = 'https://cdn.statically.io/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: tokens.spacingHorizontalXS,
  },
  drawer: {
    transitionDuration: '0s',
  },
  toolbar: {
    // padding: tokens.spacingHorizontalXS,
  },
  bpmnDesignerToolbar: {
    // justifyContent: 'space-between',
  },
  bpmnDesignerBody: {
    padding: 0,
    borderTop: '1px solid #ccc',
  }
});

export const WorkflowPage = () => {
  const styles = useStyles();
  const designerRef = useRef<IBpmnDesigerRef>(null);
  const [isOpen, setIsOpen] = useState(false);

  const bpmnDesigner = () => {
  
    let handleDownloadXml = () => {
      designerRef.current?.saveXML().then((result: any) => {
        if (!result) {
          return;
        }
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result.xml));
        element.setAttribute('download', 'diagram.bpmn');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      });
    }

    let handleDownloadSvg = () => {
      designerRef.current?.saveSVG().then((result: any) => {
        if (!result) {
          return;
        }
        var element = document.createElement('a');
        element.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(result.svg));
        element.setAttribute('download', 'diagram.svg');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      });
    }

    return (
      <OverlayDrawer
        className={styles.drawer}
        size='full'
        open={isOpen}
        position='end'
        onOpenChange={(_, { open }) => setIsOpen(open)}
      >
        <DrawerHeader>
          <DrawerHeaderNavigation>
            <Toolbar className={styles.bpmnDesignerToolbar}>
              <DrawerHeaderTitle>流程设计</DrawerHeaderTitle>
              <div style={{flex: '1'}}></div>
              <ToolbarButton appearance='primary'>部署</ToolbarButton>
              <ToolbarDivider />
              <Menu>
                <MenuTrigger>
                  <ToolbarButton aria-label="">导出</ToolbarButton>
                </MenuTrigger>
                <MenuPopover>
                  <MenuList>
                    <MenuItem onClick={handleDownloadXml}>XML</MenuItem>
                    <MenuItem onClick={handleDownloadSvg}>SVG</MenuItem>
                  </MenuList>
                </MenuPopover>
              </Menu>
              <ToolbarDivider />
              <ToolbarButton appearance="subtle" icon={<Dismiss24Regular />} onClick={() => setIsOpen(false)} />
            </Toolbar>
          </DrawerHeaderNavigation>
        </DrawerHeader>
        <DrawerBody className={styles.bpmnDesignerBody}>
          <BpmnDesigner url={diagramUrl} ref={designerRef} />
        </DrawerBody>
      </OverlayDrawer>
    );
  }

  return (
    <div className={styles.root}>
      <Toolbar size="small" className={styles.toolbar}>
        <ToolbarButton appearance="primary" icon={isOpen ? <Dismiss20Regular /> : <Add20Regular />} onClick={() => { setIsOpen(!isOpen) }} />
        {bpmnDesigner()}
      </Toolbar>
    </div>
  )
}