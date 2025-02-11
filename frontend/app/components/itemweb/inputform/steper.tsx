import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import {ColorlibConnector, CustomStepLabel} from './color';
import {iconstrper} from './iconstrper';
import { motion } from 'framer-motion';

interface StepperProps {
  currentStep: number;
}

export default function ProgressStepper({ currentStep }: StepperProps) {
  const { steps, ColorlibStepIcon } = iconstrper();

  return (
    <motion.div 
      className="mb-12"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Stack spacing={4}>
        <Stepper alternativeLabel activeStep={currentStep - 1} connector={<ColorlibConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <CustomStepLabel StepIconComponent={ColorlibStepIcon}>{label}</CustomStepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>
    </motion.div>
  );
}
