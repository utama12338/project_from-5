// เพิ่ม interface สำหรับ theme
export interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    hover: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    hover: string;
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
  shadows: {
    primary: string;
  };
}

// ระบุ type ให้กับ colors object
export const colors: ThemeColors = {
  background: {
    primary: 'rgb(18, 18, 18)',
    secondary: 'rgb(32, 32, 31)',
    tertiary: 'rgb(27, 27, 26)',
    hover: 'rgba(96, 165, 250, 0.15)'
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
    muted: '#9CA3AF',
    hover: '#93c5fd'
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
  },
  shadows: {
    primary: '0 4px 6px rgba(0, 0, 0, 0.1)'
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


// detail model ดูรายระเอียด
// Add new theme elements
export const layout = {
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    xl: '16px'
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
    xl: '32px'
  }
};

export const animation = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideIn: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 }
  }
};

export const menu = {
  icons: {
    expand: '▼',
    collapse: '▲',
  },
  text: {
    active: '#FFFFFF',
    inactive: 'rgba(255, 255, 255, 0.7)',
    hover: 'rgb(236,72,153)',
  }
};

export const labels = {
  section: {
    background: `${colors.button.primary.background}20`,
    text: colors.button.primary.background,
    activeBackground: `${colors.button.primary.background}40`,
    activeText: colors.text.primary,
    padding: '0.75rem 1rem',
    border: `1px solid ${colors.button.primary.background}20`,
    borderRadius: '8px',
  }
};

