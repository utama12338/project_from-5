"use client"
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { styled } from '@mui/material/styles';
import {colors,shadows} from '@/styles/theme';
import StepLabel from '@mui/material/StepLabel';
export const ColorlibConnector = styled(StepConnector)(() => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage: colors.gradient.primary,
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage: colors.gradient.primary,
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor: colors.background.tertiary,
      borderRadius: 1,
    },
  }));
  
  export const ColorlibStepIconRoot = styled('div')<{
    ownerState: { completed?: boolean; active?: boolean };
  }>(({  ownerState }) => ({
    backgroundColor: colors.background.tertiary,
    zIndex: 1,
    color: colors.text.primary,
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundImage: colors.gradient.secondary,
      boxShadow: shadows.primary,
    }),
    ...(ownerState.completed && {
      backgroundImage: colors.gradient.completed,
    }),
  }));


  export const CustomStepLabel = styled(StepLabel)({
    '& .MuiStepLabel-label': {
      color: colors.text.secondary,
    },
    '& .MuiStepLabel-label.Mui-active': {
      color: colors.text.primary,
    },
    '& .MuiStepLabel-label.Mui-completed': {
      color: colors.text.primary,
    }
  });