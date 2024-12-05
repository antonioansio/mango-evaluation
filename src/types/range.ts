export interface RangeProps {
  minLimit: number;
  maxLimit: number;
  predefinedSteps?: number[];
  step?: number;
  onChangeRange?: (min: number, max: number) => void;
  initialMin?: number;
  initialMax?: number;
  disableModal?: boolean;
}

export interface ModalConfig {
  value: number;
  minLimit: number;
  maxLimit: number;
  onChange: (value: number) => void;
  title: string;
}

export interface RangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: number;
  onChange: (value: number) => void;
  minLimit: number;
  maxLimit: number;
  step: number;
  title: string;
}
