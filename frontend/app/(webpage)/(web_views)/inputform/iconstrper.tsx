import {ColorlibConnector,ColorlibStepIconRoot,CustomStepLabel} from './color' 
import { StepIconProps } from '@mui/material/StepIcon';
import DescriptionIcon from '@mui/icons-material/Description';
import StorageIcon from '@mui/icons-material/Storage';
import LinkIcon from '@mui/icons-material/Link';
import SecurityIcon from '@mui/icons-material/Security';


export const iconstrper = () => {
    function ColorlibStepIcon(props: StepIconProps) {
        const { active, completed, className } = props;
      
        const icons: { [index: string]: React.ReactElement } = {
          1: <DescriptionIcon />,
          2: <StorageIcon />,
          3: <LinkIcon />,
          4: <SecurityIcon />,
        };
      
        return (
          <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
            {icons[String(props.icon)]}
          </ColorlibStepIconRoot>
          
        );
      }
      const steps = ['ข้อมูลระบบ (Systeminfo)', 'สภาพแวดล้อม (Environment)', 'การเชื่อมต่อ (ConnectionInfo)', 'ความปลอดภัย (Security)'];
  return {
    steps,
    ColorlibStepIcon
  }
}
