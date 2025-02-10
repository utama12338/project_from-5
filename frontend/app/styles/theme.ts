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
  themes: {
    light: {
      background: string;
      text: string;
      primary: string;
    };
    dark: {
      background: string;
      text: string;
      primary: string;
    };
  };
}

// ระบุ type ให้กับ colors object
export const colors: ThemeColors = {
  background: {
    primary: 'var(--background-primary)',
    secondary: 'var(--background-secondary)',
    tertiary: 'var(--background-tertiary)',
    hover: 'var(--background-hover)'
  },
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    muted: 'var(--text-muted)',
    hover: 'var(--text-hover)'
  },
  border: {
    primary: 'var(--border-primary)',
    focused: 'var(--border-focused)'
  },
  button: {
    primary: {
      background: 'var(--button-primary)',
      hover: 'var(--button-primary-hover)',
      active: 'var(--button-primary)'
    },
    secondary: {
      background: 'var(--button-secondary)',
      hover: 'var(--button-secondary-hover)'
    },
    danger: {
      background: 'var(--button-danger)',
      hover: 'var(--button-danger-hover)'
    }
  },
  input: {
    background: 'var(--input-bg)',
    placeholder: 'var(--text-muted)',
    border: 'var(--input-border)'
  },
  gradient: {
    primary: 'var(--gradient-primary)',
    secondary: 'var(--gradient-primary)',
    completed: 'var(--gradient-primary)'
  },
  shadows: {
    primary: 'var(--shadow-primary)'
  },
  themes: {
    light: {
      background: '#ffffff',
      text: '#171717',
      primary: 'rgb(236,72,153)',
    },
    dark: {
      background: 'rgb(18, 18, 18)',
      text: '#ffffff',
      primary: 'rgb(244,114,182)',
    }
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

