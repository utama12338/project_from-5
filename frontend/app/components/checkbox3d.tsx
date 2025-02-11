'use client'
import styled from 'styled-components';
import { ReactNode } from 'react';

const Checkbox3d = styled.div`
  .container {
    cursor: pointer;
  }

  .container input {
    display: none;
  }

  .container svg {
    overflow: visible;
  }

  .path {
    fill: none;
    stroke: var(--text-primary);
    stroke-width: 6;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease;
    stroke-dasharray: 241 9999999;
    stroke-dashoffset: 0;
  }

  .container input:checked ~ svg .path {
    stroke-dasharray: 70.5096664428711 9999999;
    stroke-dashoffset: -262.2723388671875;
  }
`;

interface CheckboxItemProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
}

export const CheckboxItem = ({ checked, onChange, children }: CheckboxItemProps) => (
  <Checkbox3d>
    <label className="container flex items-center space-x-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <svg viewBox="0 0 64 64" height="24" width="24">
        <path
          d="M 0 16 V 56 A 8 8 0 0 0 8 64 H 56 A 8 8 0 0 0 64 56 V 8 A 8 8 0 0 0 56 0 H 8 A 8 8 0 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 0 0 0 56 0 H 8 A 8 8 0 0 0 0 8 V 16"
          className="path"
        />
      </svg>
      {children}
    </label>
  </Checkbox3d>
);

export default Checkbox3d;
