
import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface Props {
  visible: boolean;
  mode: 'date' | 'time';
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}

export default function RNDateTimePicker({ visible, mode, onConfirm, onCancel }: Props) {
  return (
    <DateTimePickerModal
      isVisible={visible}
      mode={mode}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}