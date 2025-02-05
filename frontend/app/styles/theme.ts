// เพิ่ม interface สำหรับ theme
export interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: {
    primary: string;
    focused: string;
  };
  button: {
    primary: {
      background: string;
      hover: string;
      active: string;
    };
    secondary: {
      background: string;
      hover: string;
    };
    danger: {
      background: string;
      hover: string;
    };
  };
  input: {
    background: string;
    placeholder: string;
    border: string;
  };
  gradient: {
    primary: string;
    secondary: string;
    completed: string;
  };
}

// ระบุ type ให้กับ colors object
export const colors: ThemeColors = {
  background: {
    primary: 'rgb(17,17,16)',
    secondary: 'rgb(27,27,26)',
    tertiary: 'rgb(32,32,31)'
  },
  text: {
    primary: '#fff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    muted: '#9CA3AF'
  },
  border: {
    primary: 'rgb(75, 85, 99)',
    focused: 'rgb(236,72,153)'
  },
  button: {
    primary: {
      background: 'rgb(236,72,153)',
      hover: 'rgb(244,114,182)',
      active: 'rgb(255, 0, 144)'
    },
    secondary: {
      background: 'rgb(99, 102, 241)',
      hover: 'rgba(99, 102, 241, 0.05)'
    },
    danger: {
      background: 'rgb(220, 38, 38)',
      hover: 'rgb(185, 28, 28)'
    }
  },
  input: {
    background: 'rgb(55, 65, 81)',
    placeholder: 'rgb(156, 163, 175)',
    border: 'rgb(75, 85, 99)'
  },
  gradient: {
    primary: 'linear-gradient( 95deg,rgb(236,72,153) 0%,rgb(244,114,182) 50%,rgb(255, 0, 144) 100%)',
    secondary: 'linear-gradient( 136deg, rgb(236,72,153) 0%, rgb(244,114,182) 50%, rgb(126, 0, 71) 100%)',
    completed: 'linear-gradient( 136deg, rgb(236,72,153) 0%, rgb(244,114,182) 50%, rgb(170, 0, 96) 100%)'
  }
};

export const shadows = {
  primary: '0 4px 10px 0 rgba(236,72,153,.25)',
  hover: '0 8px 16px 0 rgba(236,72,153,.3)'
};

export const transitions = {
  default: 'all 0.2s ease-in-out'
};


export const line = {
  line:'linear-gradient(to right, rgb(236, 72, 153), rgb(168, 85, 247), rgb(59, 130, 246))'

};

